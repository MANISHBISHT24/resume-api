// app.js
// Entry point for the AI Resume Builder backend.
// One server, one express.json() call, clean route files per resource.

const express = require('express');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const documentsRoutes = require('./routes/documents');
const templatesRoutes = require('./routes/templates');
const aiRoutes = require('./routes/ai');
const applicationsRoutes = require('./routes/applications');

const app = express();
const PORT = process.env.PORT || 3000;

// So req.body works for POST/PUT/PATCH
app.use(express.json());

// Simple request logger, handy while testing routes manually
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'AI Resume Builder API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/applications', applicationsRoutes);

// 404 for anything not matched above
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Basic error handler so unexpected errors still return JSON
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Resume API listening on http://localhost:${PORT}`);
});
