const express = require('express');
const { Op } = require('sequelize');
const Brew = require('../models/Brew');

const router = express.Router();

const REQUIRED_FIELDS = [
  'beans',
  'method',
  'coffeeGrams',
  'waterGrams',
  'rating',
  'tastingNotes',
];

function findMissingFields(body) {
  return REQUIRED_FIELDS.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });
}

// GET /api/brews?method=Aeropress — list all brews, optionally filtered by method
router.get('/', async (req, res) => {
  try {
    const { method } = req.query;
    const where = method ? { method } : undefined;
    const brews = await Brew.findAll({ where, order: [['createdAt', 'DESC']] });
    res.status(200).json(brews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brews' });
  }
});

// GET /api/brews/:id — fetch a single brew
router.get('/:id', async (req, res) => {
  try {
    const brew = await Brew.findByPk(req.params.id);
    if (!brew) return res.status(404).json({ error: 'Brew not found' });
    res.status(200).json(brew);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch brew' });
  }
});

// POST /api/brews — create a brew
router.post('/', async (req, res) => {
  const missing = findMissingFields(req.body);
  if (missing.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required field(s): ${missing.join(', ')}` });
  }

  try {
    const brew = await Brew.create(req.body);
    res.status(201).json(brew);
  } catch (err) {
    res.status(400).json({ error: err.errors ? err.errors.map((e) => e.message) : err.message });
  }
});

// PUT /api/brews/:id — update a brew
router.put('/:id', async (req, res) => {
  const missing = findMissingFields(req.body);
  if (missing.length > 0) {
    return res
      .status(400)
      .json({ error: `Missing required field(s): ${missing.join(', ')}` });
  }

  try {
    const brew = await Brew.findByPk(req.params.id);
    if (!brew) return res.status(404).json({ error: 'Brew not found' });

    await brew.update(req.body);
    res.status(200).json(brew);
  } catch (err) {
    res.status(400).json({ error: err.errors ? err.errors.map((e) => e.message) : err.message });
  }
});

// DELETE /api/brews/:id — delete a brew
router.delete('/:id', async (req, res) => {
  try {
    const brew = await Brew.findByPk(req.params.id);
    if (!brew) return res.status(404).json({ error: 'Brew not found' });

    await brew.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete brew' });
  }
});

module.exports = router;
