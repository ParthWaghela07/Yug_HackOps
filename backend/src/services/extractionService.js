import config from '../config.js';
import * as llmService from './llmService.js';
import { isGreetingOrTrivia, containsSensitiveInfo, emotionalSignal } from '../utils/textUtils.js';

const EXTRACTION_SYSTEM_PROMPT = `You extract structured long-term memories from a single chat message written by a user talking to their personal AI companion, Memora.

Return ONLY a JSON object of the form:
{"memories": [{"layer": "factual" | "emotional", "category": "string, e.g. routine, relationship, preference, mood, goal", "text": "a short third-person memory statement, e.g. 'Prefers studying late at night with lo-fi music'", "importance": 0.0-1.0, "confidence": 0.0-1.0, "source_type": "explicit" | "inferred"}]}

Rules:
- Extract at most 3 memories, only the ones genuinely worth remembering long-term.
- Skip greetings, small talk, and trivia that has no lasting relevance.
- NEVER extract sensitive information such as passwords, card numbers, or government ID numbers.
- "factual" memories are concrete facts (name, routine, relationships, preferences, schedule).
- "emotional" memories are about mood, stress, feelings, or emotional patterns.
- "explicit" means the user stated it directly; "inferred" means you deduced it from tone or phrasing.
- If nothing is worth remembering, return {"memories": []}.
- Do not include any text outside the JSON object.`;

function heuristicExtract(text) {
  const memories = [];
  const trimmed = text.trim();

  // Very simple rule-based fallback: look for factual "I ..." statements
  // and emotional-lexicon hits, so the demo still works with no API key.
  const factualCue = /\bi\s+(am|study|live|work|have|love|like|prefer|use|play|listen)\b/i;
  if (factualCue.test(trimmed)) {
    memories.push({
      layer: 'factual',
      category: 'general',
      text: trimmed.length > 140 ? `${trimmed.slice(0, 137)}...` : trimmed,
      importance: 0.55,
      confidence: 0.5,
      source_type: 'explicit',
    });
  }

  if (emotionalSignal(trimmed)) {
    memories.push({
      layer: 'emotional',
      category: 'mood',
      text: `Expressed a feeling: "${trimmed.length > 100 ? `${trimmed.slice(0, 97)}...` : trimmed}"`,
      importance: 0.65,
      confidence: 0.5,
      source_type: 'inferred',
    });
  }

  return memories.slice(0, config.extraction.maxMemoriesPerTurn);
}

function sanitize(candidates) {
  return candidates
    .filter((m) => m && typeof m.text === 'string' && m.text.trim().length > 0)
    .filter((m) => !containsSensitiveInfo(m.text))
    .map((m) => ({
      layer: m.layer === 'emotional' ? 'emotional' : 'factual',
      category: (m.category || 'general').toString().slice(0, 40),
      text: m.text.trim().slice(0, 240),
      importance: clamp01(Number(m.importance) || 0.5),
      confidence: clamp01(Number(m.confidence) || 0.5),
      source_type: m.source_type === 'inferred' ? 'inferred' : 'explicit',
    }))
    .slice(0, config.extraction.maxMemoriesPerTurn);
}

function clamp01(n) {
  if (Number.isNaN(n)) return 0.5;
  return Math.min(1, Math.max(0, n));
}

/**
 * Extract structured memory candidates from a single user message.
 * Uses Groq via llmService when configured, otherwise a deterministic
 * heuristic fallback — matching the PRD's "LLM extraction is inconsistent"
 * risk mitigation: the demo never depends on the LLM being available.
 */
export async function extractMemories(text) {
  const trimmed = (text || '').trim();
  if (!trimmed || isGreetingOrTrivia(trimmed)) return [];

  if (llmService.isConfigured()) {
    try {
      const parsed = await llmService.chatCompleteJSON({
        system: EXTRACTION_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: trimmed }],
        temperature: 0.2,
        maxTokens: 400,
      });
      const candidates = Array.isArray(parsed?.memories) ? parsed.memories : [];
      return sanitize(candidates);
    } catch (err) {
      console.warn('[extractionService] LLM extraction failed, falling back to heuristics:', err.message);
    }
  }

  return sanitize(heuristicExtract(trimmed));
}

export default { extractMemories };
