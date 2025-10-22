const express = require('express');
const router = express.Router();
const { Patient, Appointment } = require('../models');
const { validate, patientSchema } = require('../middlewares/validation');

// GET /api/patients - Récupérer tous les patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [{
        model: Appointment,
        as: 'appointments',
        attributes: ['id', 'date', 'motif', 'status'] // Inclure les rendez-vous associés
      }]
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/patients/:id - Récupérer un patient par ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id, {
      include: [{
        model: Appointment,
        as: 'appointments',
        attributes: ['id', 'date', 'motif', 'status']
      }]
    });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/patients - Créer un nouveau patient
router.post('/', validate(patientSchema), async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    // Gestion des erreurs de validation Sequelize (unicité, etc.)
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(422).json({ error: 'Validation failed', details: errors });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Patient already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/patients/:id - Mettre à jour un patient
router.put('/:id', validate(patientSchema), async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    await patient.update(req.body);
    res.json(patient);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(422).json({ error: 'Validation failed', details: errors });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Patient already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/patients/:id - Supprimer un patient
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    await patient.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;