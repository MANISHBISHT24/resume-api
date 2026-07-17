// middleware/applicationValidator.js

function validateCreateApplication(req, res, next) {
  const { company, role } = req.body || {};
  if (!company || !role) {
    return res.status(400).json({ error: 'company and role are required' });
  }
  next();
}

module.exports = { validateCreateApplication };
