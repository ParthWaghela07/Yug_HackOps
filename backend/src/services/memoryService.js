import collection from '../db/jsonStore.js';
import config from '../config.js';
import { newMemoryId } from '../utils/idGenerator.js';
import { keywordOverlapSimilarity } from '../utils/textUtils.js';

const memories = collection('memories');

function normalize(userId, candidate, source) {
  const now = new Date().toISOString();
  return {
    id: newMemoryId(),
    userId,
    layer: candidate.layer === 'emotional' ? 'emotional' : 'factual',
    category: candidate.category || 'general',
    text: candidate.text,
    importance: candidate.importance ?? 0.5,
    confidence: candidate.confidence ?? 0.5,
    source, // e.g. 'chat', 'music_demo', 'social_demo', 'demo_conversation'
    source_type: candidate.source_type === 'inferred' ? 'inferred' : 'explicit',
    tags: candidate.tags || [],
    createdAt: now,
    updatedAt: now,
  };
}

function isNearDuplicate(userId, text) {
  const existing = memories.find((m) => m.userId === userId);
  return existing.some(
    (m) => keywordOverlapSimilarity(m.text, text) >= config.extraction.duplicateSimilarityThreshold
  );
}

/**
 * Insert new memory candidates, skipping near-duplicates of existing memories.
 * @returns {object[]} the memories actually inserted
 */
export function upsertMany(userId, candidates, source) {
  const toInsert = [];
  for (const c of candidates) {
    if (isNearDuplicate(userId, c.text)) continue;
    toInsert.push(normalize(userId, c, source));
  }
  if (toInsert.length) memories.insertMany(toInsert);
  return toInsert;
}

export function listByUser(userId, { layer, category, source } = {}) {
  return memories.find(
    (m) =>
      m.userId === userId &&
      (!layer || m.layer === layer) &&
      (!category || m.category === category) &&
      (!source || m.source === source)
  );
}

export function getById(id) {
  return memories.findById(id);
}

export function remove(id) {
  return memories.delete(id);
}

export function clearForUser(userId) {
  const remaining = memories.all().filter((m) => m.userId !== userId);
  memories.clear();
  if (remaining.length) memories.insertMany(remaining);
}

export default { upsertMany, listByUser, getById, remove, clearForUser };
