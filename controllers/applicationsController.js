// controllers/applicationsController.js

const { readData, writeData, nextId } = require('../store');
const { createApplication } = require('../models/Application');

function list(req, res) {
  const data = readData();
  res.status(200).json(data.applications);
}

function create(req, res) {
  const { company, role, status, documentId } = req.body;
  const data = readData();

  const application = createApplication({
    id: nextId(data),
    company,
    role,
    status,
    documentId,
  });
  data.applications.push(application);

  writeData(data);
  res.status(201).json(application);
}

function update(req, res) {
  const data = readData();
  const application = data.applications.find((a) => a.id === req.params.id);
  if (!application) return res.status(404).json({ error: 'Application not found' });

  const { status, company, role } = req.body || {};
  if (status !== undefined) application.status = status;
  if (company !== undefined) application.company = company;
  if (role !== undefined) application.role = role;

  writeData(data);
  res.status(200).json(application);
}

function remove(req, res) {
  const data = readData();
  const exists = data.applications.some((a) => a.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Application not found' });

  data.applications = data.applications.filter((a) => a.id !== req.params.id);
  writeData(data);
  res.status(204).send();
}

module.exports = { list, create, update, remove };
