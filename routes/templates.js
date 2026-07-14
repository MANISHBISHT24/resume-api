// routes/templates.js
// Read-only list of available resume designs.

const express = require('express');
const router = express.Router();
const { readData } = require('../store');

// GET /api/templates - list available designs
router.get('/', (req, res) => {
  const data = readData();
  res.status(200).json(data.templates);
});

// GET /api/templates/:id - one template's config
router.get('/:id', (req, res) => {
  const data = readData();
  const template = data.templates.find((t) => t.id === req.params.id);
  if (!template) return res.status(404).json({ error: 'Template not found' });
  res.status(200).json(template);
});

module.exports = router;
