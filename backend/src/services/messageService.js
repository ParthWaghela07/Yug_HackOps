import collection from '../db/jsonStore.js';
import { newMessageId } from '../utils/idGenerator.js';

const messages = collection('messages');

/**
 * @param {{userId: string, role: 'user'|'assistant', text: string, modality?: 'text'|'voice'}} params
 */
export function addMessage({ userId, role, text, modality = 'text' }) {
  const record = {
    id: newMessageId(),
    userId,
    role,
    text,
    modality,
    createdAt: new Date().toISOString(),
  };
  return messages.insert(record);
}

export function listByUser(userId) {
  return messages
    .find((m) => m.userId === userId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export function clearForUser(userId) {
  const remaining = messages.all().filter((m) => m.userId !== userId);
  messages.clear();
  if (remaining.length) messages.insertMany(remaining);
}

export default { addMessage, listByUser, clearForUser };
