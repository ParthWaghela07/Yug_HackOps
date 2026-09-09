/**
 * Memora LocalStorage Persistence Engine
 */

const STORAGE_KEYS = {
  MEMORIES: 'memora_memories_v2',
  MESSAGES: 'memora_messages_v2',
  EVALUATIONS: 'memora_evaluations_v2',
  EXPLAINABILITY: 'memora_explainability_v2',
};

export function getStoredMemories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMORIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMemories(memories) {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
  } catch (err) {
    console.error('Failed to save memories to localStorage:', err);
  }
}

export function getStoredMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (err) {
    console.error('Failed to save messages to localStorage:', err);
  }
}

export function getStoredEvaluations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEvaluations(evals) {
  try {
    localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evals));
  } catch (err) {
    console.error('Failed to save evaluations to localStorage:', err);
  }
}

export function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.MEMORIES);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.EVALUATIONS);
    localStorage.removeItem(STORAGE_KEYS.EXPLAINABILITY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}
