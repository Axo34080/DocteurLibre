const express = require('express');
const router = express.Router();
const { Appointment, Patient, Practitioner } = require('../models');
const { Op } = require('sequelize');
const { validate, appointmentSchema } = require('../middlewares/validation');

// GET /api/appointments - Récupérer tous les rendez-vous avec filtres optionnels
router.get('/', async (req, res) => {
  try {
    const { status, dateFrom, dateTo } = req.query;
    const whereClause = {};
    
    // Filtre par statut si fourni
    if (status) {
      whereClause.status = status;
    }
    
    // Filtre par plage de dates si fournie
    if (dateFrom || dateTo) {
      whereClause.date = {};
      if (dateFrom) whereClause.date[Op.gte] = new Date(dateFrom);
      if (dateTo) whereClause.date[Op.lte] = new Date(dateTo);
    }
    
    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName'] },
        { model: Practitioner, as: 'practitioner', attributes: ['id', 'firstName', 'lastName', 'specialty'] }
      ],
      order: [['date', 'ASC']] // Trier par date croissante
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/appointments/:id - Récupérer un rendez-vous par ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName'] },
        { model: Practitioner, as: 'practitioner', attributes: ['id', 'firstName', 'lastName', 'specialty'] }
      ]
    });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patient/:id/appointments - Récupérer les rendez-vous d'un patient
router.get('/patient/:id/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientId: req.params.id },
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName'] },
        { model: Practitioner, as: 'practitioner', attributes: ['id', 'firstName', 'lastName', 'specialty'] }
      ],
      order: [['date', 'ASC']]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/appointments - Créer un nouveau rendez-vous
router.post('/', validate(appointmentSchema), async (req, res) => {
  try {
    const { patientId, practitionerId, date } = req.body;
    
    // Vérifier les conflits horaires (30 minutes avant et après)
    const conflictStart = new Date(date);
    conflictStart.setMinutes(conflictStart.getMinutes() - 30);
    const conflictEnd = new Date(date);
    conflictEnd.setMinutes(conflictEnd.getMinutes() + 30);
    
    const existingAppointment = await Appointment.findOne({
      where: {
        practitionerId,
        date: {
          [Op.between]: [conflictStart, conflictEnd]
        },
        status: { [Op.ne]: 'cancelled' } // Exclure les rendez-vous annulés
      }
    });
    
    if (existingAppointment) {
      return res.status(409).json({ 
        error: 'Time conflict: Another appointment exists within 30 minutes of this time slot' 
      });
    }
    
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(422).json({ error: 'Validation failed', details: errors });
    }
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/appointments/:id - Mettre à jour un rendez-vous
router.put('/:id', validate(appointmentSchema), async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    // Vérifier les conflits horaires si la date change
    if (req.body.date && req.body.date !== appointment.date.toISOString()) {
      const { practitionerId, date } = req.body;
      const conflictStart = new Date(date);
      conflictStart.setMinutes(conflictStart.getMinutes() - 30);
      const conflictEnd = new Date(date);
      conflictEnd.setMinutes(conflictEnd.getMinutes() + 30);
      
      const existingAppointment = await Appointment.findOne({
        where: {
          practitionerId,
          date: {
            [Op.between]: [conflictStart, conflictEnd]
          },
          id: { [Op.ne]: req.params.id }, // Exclure le rendez-vous actuel
          status: { [Op.ne]: 'cancelled' }
        }
      });
      
      if (existingAppointment) {
        return res.status(409).json({ 
          error: 'Time conflict: Another appointment exists within 30 minutes of this time slot' 
        });
      }
    }
    
    await appointment.update(req.body);
    res.json(appointment);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(422).json({ error: 'Validation failed', details: errors });
    }
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/appointments/:id - Supprimer un rendez-vous
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    await appointment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;