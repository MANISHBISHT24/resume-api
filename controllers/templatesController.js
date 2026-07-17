// controllers/templatesController.js

const { readData } = require('../store');

function list(req, res) {
  const data = readData();
  res.status(200).json(data.templates);
}

function getOne(req, res) {
  const data = readData();
  const template = data.templates.find((t) => t.id === req.params.id);
  if (!template) return res.status(404).json({ error: 'Template not found' });
  res.status(200).json(template);
}

module.exports = { list, getOne };
