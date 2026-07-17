// controllers/usersController.js

const { readData, writeData } = require('../store');
const { toPublicJSON } = require('../models/User');

function getCurrentUser(req, data) {
  const headerId = req.header('X-User-Id');
  if (headerId) return data.users.find((u) => u.id === headerId);
  return data.users[0];
}

function getMe(req, res) {
  const data = readData();
  const user = getCurrentUser(req, data);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.status(200).json(toPublicJSON(user));
}

function updateMe(req, res) {
  const data = readData();
  const user = getCurrentUser(req, data);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name, email } = req.body || {};
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;

  writeData(data);
  res.status(200).json(toPublicJSON(user));
}

function deleteMe(req, res) {
  const data = readData();
  const user = getCurrentUser(req, data);
  if (!user) return res.status(404).json({ error: 'User not found' });

  data.users = data.users.filter((u) => u.id !== user.id);
  data.documents = data.documents.filter((d) => d.ownerId !== user.id);
  data.applications = data.applications.filter((a) => a.ownerId !== user.id);

  writeData(data);
  res.status(204).send();
}

module.exports = { getMe, updateMe, deleteMe };
