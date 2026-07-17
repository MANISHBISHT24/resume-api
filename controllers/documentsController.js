// controllers/documentsController.js

const { readData, writeData, nextId } = require('../store');
const {
  createDocument,
  createSection,
  createItem,
  createVersion,
} = require('../models/Document');

function findDocument(data, id) {
  return data.documents.find((d) => d.id === id);
}

// ---------- Documents ----------

function list(req, res) {
  const data = readData();
  res.status(200).json(data.documents);
}

function create(req, res) {
  const { title, templateId } = req.body || {};
  const data = readData();

  const newDoc = createDocument({ id: nextId(data), title, templateId });
  data.documents.push(newDoc);
  writeData(data);
  res.status(201).json(newDoc);
}

function importDocument(req, res) {
  const { source, title } = req.body || {};
  const data = readData();

  const newDoc = createDocument({
    id: nextId(data),
    title: title || `Imported from ${source || 'unknown source'}`,
    importedFrom: source || 'unknown',
  });
  data.documents.push(newDoc);
  writeData(data);
  res.status(201).json(newDoc);
}

function getOne(req, res) {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.status(200).json(doc);
}

function update(req, res) {
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
}

function duplicate(req, res) {
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
}

function remove(req, res) {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  data.documents = data.documents.filter((d) => d.id !== req.params.id);
  writeData(data);
  res.status(204).send();
}

// ---------- Sections & items ----------

function addSection(req, res) {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const { type, title } = req.body || {};
  const section = createSection({
    id: nextId(data),
    type,
    title,
    order: doc.sections.length,
  });
  doc.sections.push(section);
  doc.updatedAt = new Date().toISOString();

  writeData(data);
  res.status(201).json(section);
}

function updateSection(req, res) {
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
}

function removeSection(req, res) {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const exists = doc.sections.some((s) => s.id === req.params.sectionId);
  if (!exists) return res.status(404).json({ error: 'Section not found' });

  doc.sections = doc.sections.filter((s) => s.id !== req.params.sectionId);
  doc.updatedAt = new Date().toISOString();

  writeData(data);
  res.status(204).send();
}

function addItem(req, res) {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const section = doc.sections.find((s) => s.id === req.params.sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });

  const item = createItem({
    id: nextId(data),
    order: section.items.length,
    fields: req.body || {},
  });
  section.items.push(item);
  doc.updatedAt = new Date().toISOString();

  writeData(data);
  res.status(201).json(item);
}

function updateItem(req, res) {
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
}

function removeItem(req, res) {
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
}

// ---------- Versions ----------

function listVersions(req, res) {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const versions = data.versions.filter((v) => v.documentId === doc.id);
  res.status(200).json(versions);
}

function saveVersion(req, res) {
  const data = readData();
  const doc = findDocument(data, req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });

  const version = createVersion({
    id: nextId(data),
    documentId: doc.id,
    snapshot: JSON.parse(JSON.stringify(doc)),
  });
  data.versions.push(version);

  writeData(data);
  res.status(201).json(version);
}

function restoreVersion(req, res) {
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
}

module.exports = {
  list,
  create,
  importDocument,
  getOne,
  update,
  duplicate,
  remove,
  addSection,
  updateSection,
  removeSection,
  addItem,
  updateItem,
  removeItem,
  listVersions,
  saveVersion,
  restoreVersion,
};
