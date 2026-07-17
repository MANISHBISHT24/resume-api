// middleware/requestLogger.js
// Logs every incoming request - method + URL - to the console.
// Handy while testing routes manually.

function requestLogger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}

module.exports = requestLogger;
