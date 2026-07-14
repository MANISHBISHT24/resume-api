// routes/applications.js
// Simple job application tracker tied to the logged-in user.

const express = require('express');
const router = express.Router();
const { readData, writeData, nextId } = require('../store');

// GET /api/applications - list tracked applications
router.get('/', (req, res) => {
  const data = readData();
  res.status(200).json(data.applications);
});

// POST /api/applications - log one
router.post('/', (req, res) => {
  const { company, role, status, documentId } = req.body || {};
  if (!company || !role) {
    return res.status(400).json({ error: 'company and role are required' });
  }

  const data = readData();
  const application = {
    id: nextId(data),
    ownerId: 'u1',
    company,
    role,
    status: status || 'applied',
    documentId: documentId || null,
    createdAt: new Date().toISOString(),
  };
  data.applications.push(application);

  writeData(data);
  res.status(201).json(application);
});

// PATCH /api/applications/:id - update status
router.patch('/:id', (req, res) => {
  const data = readData();
  const application = data.applications.find((a) => a.id === req.params.id);
  if (!application) return res.status(404).json({ error: 'Application not found' });

  const { status, company, role } = req.body || {};
  if (status !== undefined) application.status = status;
  if (company !== undefined) application.company = company;
  if (role !== undefined) application.role = role;

  writeData(data);
  res.status(200).json(application);
});

// DELETE /api/applications/:id - remove one
router.delete('/:id', (req, res) => {
  const data = readData();
  const exists = data.applications.some((a) => a.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Application not found' });

  data.applications = data.applications.filter((a) => a.id !== req.params.id);
  writeData(data);
  res.status(204).send();
});

module.exports = router;
