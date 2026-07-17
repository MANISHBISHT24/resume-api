// models/Document.js
// Shape of a resume/cover letter document, plus its nested sections and items.

function createDocument({ id, ownerId, title, templateId, importedFrom }) {
  const now = new Date().toISOString();
  return {
    id,
    ownerId: ownerId || 'u1',
    title: title || 'Untitled resume',
    templateId: templateId || null,
    importedFrom: importedFrom || undefined,
    sections: [],
    createdAt: now,
    updatedAt: now,
  };
}

function createSection({ id, type, title, order }) {
  return {
    id,
    type: type || 'custom',
    title: title || 'New section',
    order,
    items: [],
  };
}

function createItem({ id, order, fields }) {
  return {
    id,
    order,
    ...fields,
  };
}

function createVersion({ id, documentId, snapshot }) {
  return {
    id,
    documentId,
    snapshot,
    createdAt: new Date().toISOString(),
  };
}

module.exports = { createDocument, createSection, createItem, createVersion };
