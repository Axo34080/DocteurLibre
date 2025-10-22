const express = require('express');
const router = express.Router();
const { Bill, Patient, Appointment } = require('../models');
const { validate, billSchema } = require('../middlewares/validation');

// GET /api/bills - Récupérer toutes les factures
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.findAll({
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName'] },
        { model: Appointment, as: 'appointment', attributes: ['id', 'date', 'motif'] }
      ]
    });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/bills/:id - Récupérer une facture par ID
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id, {
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'firstName', 'lastName'] },
        { model: Appointment, as: 'appointment', attributes: ['id', 'date', 'motif'] }
      ]
    });
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/bills - Créer une nouvelle facture
router.post('/', validate(billSchema), async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json(bill);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(422).json({ error: 'Validation failed', details: errors });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Bill already exists for this appointment' });
    }
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/bills/:id - Mettre à jour une facture
router.put('/:id', validate(billSchema), async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    await bill.update(req.body);
    res.json(bill);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(422).json({ error: 'Validation failed', details: errors });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Bill already exists for this appointment' });
    }
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/bills/:id - Supprimer une facture
router.delete('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByPk(req.params.id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    await bill.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;