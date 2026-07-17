// middleware/aiValidator.js

function requireText(req, res, next) {
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text is required' });
  next();
}

function requireContext(req, res, next) {
  const { context } = req.body || {};
  if (!context) return res.status(400).json({ error: 'context is required' });
  next();
}

function requirePrompt(req, res, next) {
  const { text, instruction } = req.body || {};
  if (!text || !instruction) {
    return res.status(400).json({ error: 'text and instruction are required' });
  }
  next();
}

module.exports = { requireText, requireContext, requirePrompt };
