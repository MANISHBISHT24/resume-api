// controllers/authController.js
// No real auth yet - sensible mock responses, as the task asks.

const { readData, writeData, nextId } = require('../store');
const { createUser, toPublicJSON } = require('../models/User');

function register(req, res) {
  const { name, email, password } = req.body;
  const data = readData();

  const existing = data.users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = createUser({ id: nextId(data), name, email, password });
  data.users.push(newUser);
  writeData(data);

  res.status(201).json({
    user: toPublicJSON(newUser),
    token: 'mock-token-' + newUser.id,
  });
}

function login(req, res) {
  const { email, password } = req.body;
  const data = readData();
  const user = data.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.status(200).json({
    token: 'mock-token-' + user.id,
    user: toPublicJSON(user),
  });
}

function logout(req, res) {
  res.status(204).send();
}

function forgotPassword(req, res) {
  res.status(200).json({ message: 'If that email exists, a reset link has been sent' });
}

function resetPassword(req, res) {
  res.status(200).json({ message: 'Password has been reset' });
}

module.exports = { register, login, logout, forgotPassword, resetPassword };
