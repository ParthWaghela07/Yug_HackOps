import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '..', 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePathFor(collectionName) {
  ensureDataDir();
  return path.join(DATA_DIR, `${collectionName}.json`);
}

function readAll(collectionName) {
  const file = filePathFor(collectionName);
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    if (!raw.trim()) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[jsonStore] failed to read ${collectionName}:`, err.message);
    return [];
  }
}

function writeAll(collectionName, records) {
  const file = filePathFor(collectionName);
  fs.writeFileSync(file, JSON.stringify(records, null, 2), 'utf-8');
}

/**
 * A tiny synchronous JSON-file-backed collection.
 * Good enough for a single-demo-user hackathon backend: human-inspectable,
 * dependency-free, and trivially resettable.
 */
export function collection(name) {
  return {
    all() {
      return readAll(name);
    },
    find(predicate) {
      return readAll(name).filter(predicate);
    },
    findOne(predicate) {
      return readAll(name).find(predicate) || null;
    },
    findById(id) {
      return readAll(name).find((r) => r.id === id) || null;
    },
    insert(record) {
      const records = readAll(name);
      records.push(record);
      writeAll(name, records);
      return record;
    },
    insertMany(newRecords) {
      const records = readAll(name);
      records.push(...newRecords);
      writeAll(name, records);
      return newRecords;
    },
    update(id, patch) {
      const records = readAll(name);
      const idx = records.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      records[idx] = { ...records[idx], ...patch };
      writeAll(name, records);
      return records[idx];
    },
    delete(id) {
      const records = readAll(name);
      const idx = records.findIndex((r) => r.id === id);
      if (idx === -1) return false;
      records.splice(idx, 1);
      writeAll(name, records);
      return true;
    },
    clear() {
      writeAll(name, []);
    },
  };
}

export default collection;
