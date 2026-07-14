// routes/auth.js
// No real auth yet - we just return sensible mock responses,
// like the task asks. Shapes and status codes matter here, not logic.

const express = require('express');
const router = express.Router();
const { readData, writeData, nextId } = require('../store');

// POST /api/auth/register - create account
router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const data = readData();
  const existing = data.users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: nextId(data),
    name: name || 'New User',
    email,
    password, // plaintext only because this is a mock task, never do this for real
    tier: 'free',
    aiCredits: 10,
  };
  data.users.push(newUser);
  writeData(data);

  res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
    token: 'mock-token-' + newUser.id,
  });
});

// POST /api/auth/login - obtain an access token
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const data = readData();
  const user = data.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.status(200).json({
    token: 'mock-token-' + user.id,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// POST /api/auth/logout - invalidate the session
router.post('/logout', (req, res) => {
  // Nothing to actually invalidate yet since tokens are fake.
  res.status(204).send();
});

// POST /api/auth/forgot-password - begin password recovery
router.post('/forgot-password', (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }
  res.status(200).json({ message: 'If that email exists, a reset link has been sent' });
});

// POST /api/auth/reset-password - complete password reset
router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'token and newPassword are required' });
  }
  res.status(200).json({ message: 'Password has been reset' });
});

module.exports = router;
