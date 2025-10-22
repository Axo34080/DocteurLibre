const express = require('express');
const router = express.Router();
const { Practitioner, Appointment } = require('../models');
const { validate, practitionerSchema } = require('../middlewares/validation');

// GET /api/praticiens - Get all practitioners
router.get('/', async (req, res) => {
  try {
    const { specialty, sortBy } = req.query;
    let where = {};
    let order = [['lastName', 'ASC']];

    if (specialty) {
      where.specialty = specialty;
    }

    if (sortBy) {
      switch (sortBy) {
        case 'firstName':
          order = [['firstName', 'ASC']];
          break;
        case 'lastName':
          order = [['lastName', 'ASC']];
          break;
        case 'specialty':
          order = [['specialty', 'ASC']];
          break;
        case 'experience':
          order = [['experience', 'DESC']];
          break;
      }
    }

    const practitioners = await Practitioner.findAll({ where, order });
    res.status(200).json(practitioners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/praticiens - Create new practitioner
router.post('/', validate(practitionerSchema), async (req, res) => {
  try {
    const practitioner = await Practitioner.create(req.body);
    res.status(201).json(practitioner);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(422).json({ 
        error: 'Validation exception',
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).json({ error: 'Practitioner already exists' });
    } else {
      res.status(400).json({ error: 'Invalid input' });
    }
  }
});

// GET /api/praticien/:id - Get practitioner by ID
router.get('/:id', async (req, res) => {
  try {
    const practitioner = await Practitioner.findByPk(req.params.id);
    if (!practitioner) {
      return res.status(404).json({ error: 'Practitioner not found' });
    }
    res.status(200).json(practitioner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/praticien/:id - Update practitioner
router.put('/:id', validate(practitionerSchema), async (req, res) => {
  try {
    const [updated] = await Practitioner.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ error: 'Practitioner not found' });
    }
    const updatedPractitioner = await Practitioner.findByPk(req.params.id);
    res.status(200).json(updatedPractitioner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/praticien/:id - Delete practitioner
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Practitioner.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ error: 'Practitioner not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/praticien/:id/appointments - Get practitioner appointments
router.get('/:id/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { practitionerId: req.params.id }
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;