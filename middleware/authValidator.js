// middleware/authValidator.js
// Checks that required fields are present before a controller runs.
// If validation fails, it responds immediately - the controller never runs.

function validateRegister(req, res, next) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }
  next();
}

function validateForgotPassword(req, res, next) {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }
  next();
}

function validateResetPassword(req, res, next) {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'token and newPassword are required' });
  }
  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
};
