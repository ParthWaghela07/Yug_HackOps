const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'so', 'to', 'of', 'in',
  'on', 'at', 'for', 'with', 'about', 'as', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'i', 'me', 'my', 'myself', 'we', 'our', 'you', 'your',
  'he', 'him', 'his', 'she', 'her', 'it', 'its', 'they', 'them', 'their',
  'this', 'that', 'these', 'those', 'am', 'do', 'does', 'did', 'have', 'has',
  'had', 'having', 'will', 'would', 'shall', 'should', 'can', 'could', 'may',
  'might', 'must', 'not', 'no', 'yes', 'just', 'really', 'very', 'im', 'ive',
  'dont', 'im', 'up', 'out', 'from', 'by', 'into', 'over', 'again', 'there',
]);

export function tokenize(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function filterStopwords(tokens = []) {
  return tokens.filter((t) => !STOPWORDS.has(t) && t.length > 1);
}

export function keywordTokens(text = '') {
  return filterStopwords(tokenize(text));
}

/**
 * Jaccard-style keyword overlap similarity between two strings, in [0, 1].
 */
export function keywordOverlapSimilarity(textA = '', textB = '') {
  const a = new Set(keywordTokens(textA));
  const b = new Set(keywordTokens(textB));
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const tok of a) if (b.has(tok)) intersection += 1;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

export function wordCount(text = '') {
  return String(text).trim().split(/\s+/).filter(Boolean).length;
}

const EMOTIONAL_LEXICON = [
  'anxious', 'anxiety', 'worried', 'worry', 'stressed', 'stress', 'sad',
  'happy', 'excited', 'nervous', 'scared', 'afraid', 'overwhelmed', 'tired',
  'exhausted', 'lonely', 'angry', 'frustrated', 'hopeful', 'proud', 'calm',
  'upset', 'down', 'depressed', 'grateful', 'relieved', 'love', 'hate',
  'hurt', 'hard time', 'struggling', 'panic', 'burnt out', 'burned out',
];

export function emotionalSignal(text = '') {
  const lower = String(text).toLowerCase();
  return EMOTIONAL_LEXICON.some((w) => lower.includes(w));
}

const SENSITIVE_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/, // SSN-like
  /\b(?:\d[ -]*?){13,16}\b/, // card-number-like runs of digits
  /\bpassword\s*[:=]/i,
  /\bapi[_ -]?key\s*[:=]/i,
];

export function containsSensitiveInfo(text = '') {
  return SENSITIVE_PATTERNS.some((re) => re.test(text));
}

const GREETING_PATTERNS = [
  /^(hi|hey|hello|yo|sup|good (morning|afternoon|evening))\b/i,
  /^(thanks|thank you|ok|okay|cool|got it|sounds good)\.?$/i,
];

export function isGreetingOrTrivia(text = '') {
  const trimmed = String(text).trim();
  if (trimmed.length < 3) return true;
  return GREETING_PATTERNS.some((re) => re.test(trimmed));
}
