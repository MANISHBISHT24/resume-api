// routes/users.js
// "me" routes - normally you'd get the current user from a verified token.
// Since auth is mocked, we just use the first user as "the logged in user"
// (or read an X-User-Id header if you want to test with a specific user).

const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../store');

function getCurrentUser(req, data) {
  const headerId = req.header('X-User-Id');
  if (headerId) {
    return data.users.find((u) => u.id === headerId);
  }
  return data.users[0];
}

// GET /api/users/me - current profile, tier, AI credits
router.get('/me', (req, res) => {
  const data = readData();
  const user = getCurrentUser(req, data);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    tier: user.tier,
    aiCredits: user.aiCredits,
  });
});

// PUT /api/users/me - update profile
router.put('/me', (req, res) => {
  const data = readData();
  const user = getCurrentUser(req, data);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, email } = req.body || {};
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;

  writeData(data);
  res.status(200).json({ id: user.id, name: user.name, email: user.email, tier: user.tier });
});

// DELETE /api/users/me - delete account and data
router.delete('/me', (req, res) => {
  const data = readData();
  const user = getCurrentUser(req, data);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  data.users = data.users.filter((u) => u.id !== user.id);
  // Also clean up anything that belonged to this user
  data.documents = data.documents.filter((d) => d.ownerId !== user.id);
  data.applications = data.applications.filter((a) => a.ownerId !== user.id);

  writeData(data);
  res.status(204).send();
});

module.exports = router;
