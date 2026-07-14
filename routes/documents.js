// routes/documents.js
// The core resource: resumes / cover letters, plus nested sections, items,
// and saved versions. Full CRUD lives here first, as the task suggests.

const express = require('express');
const router = express.Router();
const { readData, writeData, nextId } = require('../store');

function findDocument(data, id) {
  return data.documents.find((d) => d.id === id);
}

// ---------- Documents (core CRUD) ----------

// GET /api/documents - list my resumes and cover letters
router.get('/', (req, res) => {
  const data = readData();
  res.status(200).json(data.documents);
});

// POST /api/documents - create one (blank or from a template)
router.post('/', (req, res) => {
  const { title, templateId } = req.body || {};
  const data = readData();

  const newDoc = {
    id: nextId(data),
    ownerId: 'u1',
    title: title || 'Untitled resume',
    templateId: templateId || null,
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.documents.push(newDoc);
  writeData(data);
  res.status(201).json(newDoc);
});

// POST /api/documents/import - create one from an upload or LinkedIn data
router.post('/import', (req, res) => {
  const { source, title } = req.body || {};
  const data = readData();

  const newDoc = {
    id: nextId(data),
    ownerId: 'u1',
    title: title || `Imported from ${source || 'unknown source'}`,
    templateId: null,
    sections: [],
    importedFrom: source || 'unknown',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.documents.push(newDoc);
  writeData(data);
  res.status(201).json(newDoc);
});

// GET /api/documents/:id - read one with its full content
router.get('/:id', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.status(200).json(doc);
});

// PUT /api/documents/:id - save edits (whole document replace)
router.put('/:id', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const { title, templateId, sections } = req.body || {};
  if (title !== undefined) doc.title = title;
  if (templateId !== undefined) doc.templateId = templateId;
  if (sections !== undefined) doc.sections = sections;
  doc.updatedAt = new Date().toISOString();

  writeData(data);
  res.status(200).json(doc);
});

// POST /api/documents/:id/duplicate - copy it (a tailored version)
router.post('/:id/duplicate', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const copy = {
    ...JSON.parse(JSON.stringify(doc)),
    id: nextId(data),
    title: `${doc.title} (copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.documents.push(copy);
  writeData(data);
  res.status(201).json(copy);
});

// DELETE /api/documents/:id - delete it
router.delete('/:id', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  data.documents = data.documents.filter((d) => d.id !== req.params.id);
  writeData(data);
  res.status(204).send();
});

// ---------- Sections & items (nested under a document) ----------

// POST /api/documents/:id/sections - add a section
router.post('/:id/sections', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const { type, title } = req.body || {};
  const section = {
    id: nextId(data),
    type: type || 'custom',
    title: title || 'New section',
    order: doc.sections.length,
    items: [],
  };
  doc.sections.push(section);
  doc.updatedAt = new Date().toISOString();

  writeData(data);
  res.status(201).json(section);
});

// PATCH /api/documents/:id/sections/:sectionId - edit or reorder a section
router.patch('/:id/sections/:sectionId', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const section = doc.sections.find((s) => s.id === req.params.sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });

  const { title, order } = req.body || {};
  if (title !== undefined) section.title = title;
  if (order !== undefined) section.order = order;
  doc.updatedAt = new Date().toISOString();

  writeData(data);
  res.status(200).json(section);
});

// DELETE /api/documents/:id/sections/:sectionId - remove a section
router.delete('/:id/sections/:sectionId', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const exists = doc.sections.some((s) => s.id === req.params.sectionId);
  if (!exists) return res.status(404).json({ error: 'Section not found' });

  doc.sections = doc.sections.filter((s) => s.id !== req.params.sectionId);
  doc.updatedAt = new Date().toISOString();

  writeData(data);
  res.status(204).send();
});

// POST /api/documents/:id/sections/:sectionId/items - add an entry
router.post('/:id/sections/:sectionId/items', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const section = doc.sections.find((s) => s.id === req.params.sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });

  const item = {
    id: nextId(data),
    order: section.items.length,
    ...req.body,
  };
  section.items.push(item);
  doc.updatedAt = new Date().toISOString();

  writeData(data);
  res.status(201).json(item);
});

// PATCH /api/documents/:id/sections/:sectionId/items/:itemId - edit or reorder an entry
router.patch('/:id/sections/:sectionId/items/:itemId', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const section = doc.sections.find((s) => s.id === req.params.sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });

  const item = section.items.find((i) => i.id === req.params.itemId);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  Object.assign(item, req.body || {});
  doc.updatedAt = new Date().toISOString();

  writeData(data);
  res.status(200).json(item);
});

// DELETE /api/documents/:id/sections/:sectionId/items/:itemId - remove an entry
router.delete('/:id/sections/:sectionId/items/:itemId', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const section = doc.sections.find((s) => s.id === req.params.sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });

  const exists = section.items.some((i) => i.id === req.params.itemId);
  if (!exists) return res.status(404).json({ error: 'Item not found' });

  section.items = section.items.filter((i) => i.id !== req.params.itemId);
  doc.updatedAt = new Date().toISOString();

  writeData(data);
  res.status(204).send();
});

// ---------- Versions ----------

// GET /api/documents/:id/versions - list saved versions
router.get('/:id/versions', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const versions = data.versions.filter((v) => v.documentId === doc.id);
  res.status(200).json(versions);
});

// POST /api/documents/:id/versions - save the current state as a version
router.post('/:id/versions', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const version = {
    id: nextId(data),
    documentId: doc.id,
    snapshot: JSON.parse(JSON.stringify(doc)),
    createdAt: new Date().toISOString(),
  };
  data.versions.push(version);

  writeData(data);
  res.status(201).json(version);
});

// POST /api/documents/:id/versions/:versionId/restore - roll back to one
router.post('/:id/versions/:versionId/restore', (req, res) => {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const version = data.versions.find(
    (v) => v.id === req.params.versionId && v.documentId === doc.id
  );
  if (!version) return res.status(404).json({ error: 'Version not found' });

  const idx = data.documents.findIndex((d) => d.id === doc.id);
  data.documents[idx] = {
    ...version.snapshot,
    id: doc.id,
    updatedAt: new Date().toISOString(),
  };

  writeData(data);
  res.status(200).json(data.documents[idx]);
});

module.exports = router;
