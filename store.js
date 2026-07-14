// store.js
// Tiny helper that treats data.json as our "database".
// We read the whole file into memory on every request and write it back
// on every change. Fine for a learning project, not for production.

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Generates a simple unique id like "101", "102", ...
function nextId(data) {
  const id = data.nextId || 1;
  data.nextId = id + 1;
  return String(id);
}

module.exports = { readData, writeData, nextId };
