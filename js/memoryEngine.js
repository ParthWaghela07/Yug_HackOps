/**
 * Memora Memory Engine: Extraction, 4-Factor Scoring Formula, Top-K Retrieval, Metrics
 * Formula: Score = 0.60 * Similarity + 0.20 * Importance + 0.10 * Recency + 0.10 * EmotionalMatch
 */

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'so', 'to', 'of', 'in',
  'on', 'at', 'for', 'with', 'about', 'as', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'i', 'me', 'my', 'myself', 'we', 'our', 'you', 'your',
  'he', 'him', 'his', 'she', 'her', 'it', 'its', 'they', 'them', 'their',
  'this', 'that', 'these', 'those', 'am', 'do', 'does', 'did', 'have', 'has',
  'had', 'having', 'will', 'would', 'shall', 'should', 'can', 'could', 'may',
  'might', 'must', 'not', 'no', 'yes', 'just', 'really', 'very', 'im', 'ive',
  'dont', 'up', 'out', 'from', 'by', 'into', 'over', 'again', 'there',
]);

const EMOTIONAL_LEXICON = [
  'anxious', 'anxiety', 'worried', 'worry', 'stressed', 'stress', 'sad',
  'happy', 'excited', 'nervous', 'scared', 'afraid', 'overwhelmed', 'tired',
  'exhausted', 'lonely', 'angry', 'frustrated', 'hopeful', 'proud', 'calm',
  'upset', 'down', 'depressed', 'grateful', 'relieved', 'love', 'hate',
  'hurt', 'hard time', 'struggling', 'panic', 'burnt out', 'burned out',
];

const SENSITIVE_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/,
  /\b(?:\d[ -]*?){13,16}\b/,
  /\bpassword\s*[:=]/i,
  /\bapi[_ -]?key\s*[:=]/i,
];

const GREETING_PATTERNS = [
  /^(hi|hey|hello|yo|sup|good (morning|afternoon|evening))\b/i,
  /^(thanks|thank you|ok|okay|cool|got it|sounds good)\.?$/i,
];

export function tokenize(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function stem(word) {
  const w = word.toLowerCase();
  for (const suffix of ['ing', 'ies', 'es', 'ed', 's']) {
    if (w.endsWith(suffix) && w.length - suffix.length >= 3) {
      return w.slice(0, -suffix.length);
    }
  }
  return w;
}

export function keywordTokens(text = '') {
  return tokenize(text)
    .filter((t) => !STOPWORDS.has(t) && t.length > 1)
    .map(stem);
}

export function keywordOverlapSimilarity(textA = '', textB = '') {
  const a = new Set(keywordTokens(textA));
  const b = new Set(keywordTokens(textB));
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const tok of a) if (b.has(tok)) intersection += 1;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

export function emotionalSignal(text = '') {
  const lower = String(text).toLowerCase();
  return EMOTIONAL_LEXICON.some((w) => lower.includes(w));
}

export function containsSensitiveInfo(text = '') {
  return SENSITIVE_PATTERNS.some((re) => re.test(text));
}

export function isGreetingOrTrivia(text = '') {
  const trimmed = String(text).trim();
  if (trimmed.length < 3) return true;
  return GREETING_PATTERNS.some((re) => re.test(trimmed));
}

export function wordCount(text = '') {
  return String(text).trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Heuristic Memory Extraction
 */
export function extractMemories(text = '') {
  const trimmed = text.trim();
  if (!trimmed || isGreetingOrTrivia(trimmed) || containsSensitiveInfo(trimmed)) {
    return [];
  }

  const memories = [];
  const factualCue = /\bi\s+(am|study|live|work|have|love|like|prefer|use|play|listen)\b/i;
  
  if (factualCue.test(trimmed)) {
    memories.append || memories.push({
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      layer: 'factual',
      category: 'general',
      text: trimmed.length > 140 ? `${trimmed.slice(0, 137)}...` : trimmed,
      importance: 0.75,
      confidence: 0.8,
      source_type: 'explicit',
      createdAt: new Date().toISOString(),
    });
  }

  if (emotionalSignal(trimmed)) {
    memories.push({
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      layer: 'emotional',
      category: 'mood',
      text: `Expressed feeling/mood: "${trimmed.length > 100 ? `${trimmed.slice(0, 97)}...` : trimmed}"`,
      importance: 0.85,
      confidence: 0.85,
      source_type: 'inferred',
      createdAt: new Date().toISOString(),
    });
  }

  return memories.slice(0, 3);
}

/**
 * Recency Exponential Decay (72h half-life)
 */
function recencyScore(createdAt, nowMs) {
  const createdMs = new Date(createdAt).getTime() || nowMs;
  const hours = Math.max(0, (nowMs - createdMs) / 36e5);
  return Math.pow(0.5, hours / 72.0);
}

function emotionalMatchScore(layer, queryHasEmotion) {
  if (layer !== 'emotional') return queryHasEmotion ? 0.2 : 0.4;
  return queryHasEmotion ? 1.0 : 0.3;
}

/**
 * Score Memory: 0.60*S + 0.20*I + 0.10*R + 0.10*E
 */
export function scoreMemory(memory, query, nowMs = Date.now()) {
  const similarity = keywordOverlapSimilarity(memory.text, query);
  const importance = memory.importance ?? 0.5;
  const recency = recencyScore(memory.createdAt, nowMs);
  const emotional = emotionalMatchScore(memory.layer, emotionalSignal(query));

  const totalScore =
    0.60 * similarity +
    0.20 * importance +
    0.10 * recency +
    0.10 * emotional;

  return {
    score: Math.round(totalScore * 1000) / 1000,
    breakdown: {
      similarity: Math.round(similarity * 1000) / 1000,
      importance: Math.round(importance * 1000) / 1000,
      recency: Math.round(recency * 1000) / 1000,
      emotionalMatch: Math.round(emotional * 1000) / 1000,
    },
  };
}

/**
 * Retrieve Top 3-5 Relevant Memories
 */
export function retrieveTopMemories(allMemories = [], query = '', minCount = 3, maxCount = 5, threshold = 0.08) {
  const nowMs = Date.now();
  const scored = allMemories
    .map((m) => {
      const { score, breakdown } = scoreMemory(m, query, nowMs);
      return { memory: m, score, breakdown };
    })
    .sort((a, b) => b.score - a.score);

  const aboveThresh = scored.filter((s) => s.score >= threshold);
  const selected = (aboveThresh.length >= minCount ? aboveThresh : scored).slice(0, maxCount);
  const selectedIds = new Set(selected.map((s) => s.memory.id));
  const excluded = scored.find((s) => !selectedIds.has(s.memory.id)) || null;

  return {
    selected,
    excludedExample: excluded,
    selectionReason: selected.length > 0
      ? `Selected ${selected.length} memories most relevant to this message, weighted by topical similarity (60%), importance (20%), recency (10%), and emotional tone match (10%).`
      : 'No stored memories met the threshold for relevance.',
  };
}

/**
 * Context Evaluation Calculation
 */
export function calculateContextEvaluation(historyMessages = [], query = '', selectedMemories = []) {
  const naiveText = historyMessages.map((m) => m.text).join(' ');
  const naiveWordCount = wordCount(naiveText) + wordCount(query);

  const structuredText = selectedMemories.map((s) => s.memory.text).join(' ');
  const structuredWordCount = wordCount(structuredText) + wordCount(query);

  const reductionPct =
    naiveWordCount === 0 ? 0 : Math.max(0, Math.round((1.0 - structuredWordCount / naiveWordCount) * 100));

  return {
    naiveWordCount,
    structuredWordCount,
    reductionPct,
    promptWordsSaved: Math.max(0, naiveWordCount - structuredWordCount),
    memoriesUsed: selectedMemories.length,
  };
}
