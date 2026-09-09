import config from '../config.js';
import * as memoryService from './memoryService.js';
import { keywordOverlapSimilarity, emotionalSignal } from '../utils/textUtils.js';

/**
 * Exponential decay with a configurable half-life, so seeded demo memories
 * (all created within the same second) don't all score identically on
 * recency — the curve still differentiates them by creation order.
 */
function recencyScore(createdAt, now) {
  const hours = Math.max(0, (now - new Date(createdAt).getTime()) / 36e5);
  const halfLife = config.retrieval.recencyHalfLifeHours;
  return Math.pow(0.5, hours / halfLife);
}

function emotionalMatchScore(memory, queryHasEmotion) {
  if (memory.layer !== 'emotional') return queryHasEmotion ? 0.2 : 0.4;
  return queryHasEmotion ? 1 : 0.3;
}

function scoreMemory(memory, query, now) {
  const { weights } = config.retrieval;
  const similarity = keywordOverlapSimilarity(memory.text, query);
  const importance = memory.importance ?? 0.5;
  const recency = recencyScore(memory.createdAt, now);
  const emotional = emotionalMatchScore(memory, emotionalSignal(query));

  const score =
    weights.similarity * similarity +
    weights.importance * importance +
    weights.recency * recency +
    weights.emotionalMatch * emotional;

  return {
    score,
    breakdown: {
      similarity: round(similarity),
      importance: round(importance),
      recency: round(recency),
      emotionalMatch: round(emotional),
    },
  };
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}

/**
 * Retrieve the top 3–5 memories relevant to a query, plus one excluded
 * example just outside the cutoff for explainability contrast.
 */
export function retrieveTopMemories(userId, query) {
  const now = Date.now();
  const all = memoryService.listByUser(userId);

  const scored = all
    .map((m) => {
      const { score, breakdown } = scoreMemory(m, query, now);
      return { memory: m, score, breakdown };
    })
    .sort((a, b) => b.score - a.score);

  const { minMemories, maxMemories, minScoreThreshold } = config.retrieval;

  const aboveThreshold = scored.filter((s) => s.score >= minScoreThreshold);
  const selected = (aboveThreshold.length >= minMemories ? aboveThreshold : scored).slice(
    0,
    maxMemories
  );

  const excluded = scored.find((s) => !selected.some((sel) => sel.memory.id === s.memory.id)) || null;

  return {
    selected: selected.map(toExplainable),
    excludedExample: excluded ? toExplainable(excluded) : null,
    selectionReason: buildSelectionReason(selected.length, query),
  };
}

function toExplainable({ memory, score, breakdown }) {
  return { memory, score: round(score), breakdown };
}

function buildSelectionReason(count, query) {
  if (count === 0) return 'No stored memories were relevant enough to this message yet.';
  return `Selected the ${count} memories most relevant to this message, weighted by topical similarity, importance, recency, and emotional tone match.`;
}

export default { retrieveTopMemories };
