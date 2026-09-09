import collection from '../db/jsonStore.js';
import { newId } from '../utils/idGenerator.js';
import { wordCount } from '../utils/textUtils.js';
import * as messageService from './messageService.js';

const evaluations = collection('evaluations');

/**
 * Compare a naive "send the whole transcript" context against Memora's
 * structured-memory context for the current turn, and store the result.
 */
export function recordEvaluation(userId, { currentMessage, selectedMemories }) {
  const history = messageService.listByUser(userId);
  const naiveText = history.map((m) => m.text).join(' ');
  const naiveWordCount = wordCount(naiveText) + wordCount(currentMessage);

  const structuredText = selectedMemories.map((s) => s.memory.text).join(' ');
  const structuredWordCount = wordCount(structuredText) + wordCount(currentMessage);

  const reductionPct =
    naiveWordCount === 0 ? 0 : Math.max(0, Math.round((1 - structuredWordCount / naiveWordCount) * 100));

  const record = {
    id: newId('eval'),
    userId,
    query: currentMessage,
    naiveWordCount,
    structuredWordCount,
    reductionPct,
    memoriesUsed: selectedMemories.length,
    createdAt: new Date().toISOString(),
  };
  evaluations.insert(record);
  return record;
}

export function getLatest(userId) {
  const all = evaluations.find((e) => e.userId === userId);
  return all.length ? all[all.length - 1] : null;
}

export function queryEvaluations(userId, query) {
  const all = evaluations.find((e) => e.userId === userId);
  if (!query) return all;
  return all.filter((e) => e.query.toLowerCase().includes(query.toLowerCase()));
}

export function clearForUser(userId) {
  const remaining = evaluations.all().filter((e) => e.userId !== userId);
  evaluations.clear();
  if (remaining.length) evaluations.insertMany(remaining);
}

export default { recordEvaluation, getLatest, queryEvaluations, clearForUser };
