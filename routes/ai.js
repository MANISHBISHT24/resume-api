// routes/ai.js
// No real AI yet. We accept the input and return a mock response.
// Each call also "spends" one AI credit from the current user, since
// the task calls these action resources that are metered.

const express = require('express');
const router = express.Router();
const { readData, writeData } = require('../store');

function spendCredit(data) {
  const user = data.users[0];
  if (user && user.aiCredits > 0) {
    user.aiCredits -= 1;
    return true;
  }
  return false;
}

// POST /api/ai/bullets - generate or improve bullet points
router.post('/bullets', (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });

  const data = readData();
  if (!spendCredit(data)) {
    return res.status(400).json({ error: 'No AI credits remaining' });
  }
  writeData(data);

  const bullets = Array.isArray(text) ? text : [text];
  res.status(200).json({ bullets: bullets.map((b) => `${b} (improved)`) });
});

// POST /api/ai/summary - generate a summary or headline
router.post('/summary', (req, res) => {
  const { context } = req.body || {};
  if (!context) return res.status(400).json({ error: 'context is required' });

  const data = readData();
  if (!spendCredit(data)) {
    return res.status(400).json({ error: 'No AI credits remaining' });
  }
  writeData(data);

  res.status(200).json({ summary: `${context} (improved)` });
});

// POST /api/ai/rewrite - tighten or improve selected text
router.post('/rewrite', (req, res) => {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });

  const data = readData();
  if (!spendCredit(data)) {
    return res.status(400).json({ error: 'No AI credits remaining' });
  }
  writeData(data);

  res.status(200).json({ text: `${text} (improved)` });
});

// POST /api/ai/prompt - apply a freeform instruction to a section
router.post('/prompt', (req, res) => {
  const { text, instruction } = req.body || {};
  if (!text || !instruction) {
    return res.status(400).json({ error: 'text and instruction are required' });
  }

  const data = readData();
  if (!spendCredit(data)) {
    return res.status(400).json({ error: 'No AI credits remaining' });
  }
  writeData(data);

  res.status(200).json({ text: `${text} (improved per: "${instruction}")` });
});

module.exports = router;
