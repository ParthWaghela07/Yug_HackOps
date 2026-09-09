import { scriptedTurns } from '../db/demoData.js';
import * as chatService from './chatService.js';
import * as messageService from './messageService.js';
import * as memoryService from './memoryService.js';
import * as evaluationService from './evaluationService.js';

/**
 * Replays the scripted 12-turn conversation through the real pipeline
 * (extraction -> retrieval -> generation), sequentially so later turns can
 * reference memories extracted earlier.
 */
export async function loadDemoConversation(userId) {
  const turns = [];
  for (const text of scriptedTurns) {
    // eslint-disable-next-line no-await-in-loop
    const turn = await chatService.handleTurn({ userId, text, modality: 'text', synthesizeAudio: false });
    turns.push(turn);
  }
  return turns;
}

export function resetAll(userId) {
  messageService.clearForUser(userId);
  memoryService.clearForUser(userId);
  evaluationService.clearForUser(userId);
}

export default { loadDemoConversation, resetAll };
