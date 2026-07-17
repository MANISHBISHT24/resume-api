// models/Application.js
// Shape of a tracked job application.

function createApplication({ id, ownerId, company, role, status, documentId }) {
  return {
    id,
    ownerId: ownerId || 'u1',
    company,
    role,
    status: status || 'applied',
    documentId: documentId || null,
    createdAt: new Date().toISOString(),
  };
}

module.exports = { createApplication };
