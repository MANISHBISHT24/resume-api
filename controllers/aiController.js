// controllers/aiController.js
// No real AI - mock responses. Each call spends one AI credit.

const { readData, writeData } = require('../store');

function spendCredit(data) {
  const user = data.users[0];
  if (user && user.aiCredits > 0) {
    user.aiCredits -= 1;
    return true;
  }
  return false;
}

function bullets(req, res) {
  const { text } = req.body;
  const data = readData();
  if (!spendCredit(data)) return res.status(400).json({ error: 'No AI credits remaining' });
  writeData(data);

  const list = Array.isArray(text) ? text : [text];
  res.status(200).json({ bullets: list.map((b) => `${b} (improved)`) });
}

function summary(req, res) {
  const { context } = req.body;
  const data = readData();
  if (!spendCredit(data)) return res.status(400).json({ error: 'No AI credits remaining' });
  writeData(data);

  res.status(200).json({ summary: `${context} (improved)` });
}

function rewrite(req, res) {
  const { text } = req.body;
  const data = readData();
  if (!spendCredit(data)) return res.status(400).json({ error: 'No AI credits remaining' });
  writeData(data);

  res.status(200).json({ text: `${text} (improved)` });
}

function prompt(req, res) {
  const { text, instruction } = req.body;
  const data = readData();
  if (!spendCredit(data)) return res.status(400).json({ error: 'No AI credits remaining' });
  writeData(data);

  res.status(200).json({ text: `${text} (improved per: "${instruction}")` });
}

module.exports = { bullets, summary, rewrite, prompt };
