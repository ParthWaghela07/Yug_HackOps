import * as messageService from './messageService.js';
import * as extractionService from './extractionService.js';
import * as memoryService from './memoryService.js';
import * as retrievalService from './retrievalService.js';
import * as generationService from './generationService.js';
import * as evaluationService from './evaluationService.js';
import * as ttsService from './ttsService.js';
import * as spotifyService from './spotifyService.js';

function detectMood(text) {
  const lower = (text || '').toLowerCase();
  if (/sad|depressed|unhappy|down|heartbroken|gloomy/.test(lower)) return 'sad';
  if (/anxious|anxiety|worried|stressed|overwhelmed|nervous/.test(lower)) return 'anxious';
  if (/happy|excited|great|cheerful|joyful/.test(lower)) return 'happy';
  if (/calm|peaceful|relaxed|mellow/.test(lower)) return 'calm';
  if (/study|focus|cramming|exam|work/.test(lower)) return 'focused';
  if (/energetic|workout|hyped|pumped/.test(lower)) return 'energetic';
  if (/angry|frustrated|mad|furious/.test(lower)) return 'angry';
  if (/romantic|love|dating|crush/.test(lower)) return 'romantic';
  return null;
}

/**
 * Orchestrates a single conversational turn.
 *
 * @param {{userId: string, text: string, modality?: 'text'|'voice', synthesizeAudio?: boolean}} params
 */
export async function handleTurn({ userId, text, modality = 'text', synthesizeAudio }) {
  const trimmed = (text || '').trim();
  if (!trimmed) throw new Error('Message text is required');

  // 1. store the user's turn
  const userMessage = messageService.addMessage({ userId, role: 'user', text: trimmed, modality });

  // 2. extract structured memories from it, then persist (deduped)
  const candidates = await extractionService.extractMemories(trimmed);
  const newMemories = memoryService.upsertMany(userId, candidates, 'chat');

  // 3. retrieve the top 3-5 relevant memories for this message
  const { selected, excludedExample, selectionReason } = retrievalService.retrieveTopMemories(
    userId,
    trimmed
  );

  // 4. detect mood & fetch Spotify tracks if emotional signal present
  const detectedMood = detectMood(trimmed);
  let suggestedMusic = null;
  let replySuffix = '';

  if (detectedMood) {
    suggestedMusic = await spotifyService.getTracksByMood(detectedMood);
    const topTrack = suggestedMusic?.tracks?.[0];
    if (topTrack) {
      replySuffix = ` I've recommended some ${detectedMood} tracks for you, starting with "${topTrack.name}" by ${topTrack.artist} — check out the Mood Music tab!`;
    }
  }

  // 5. generate a personalized reply from ONLY the message + selected memories
  let replyText = await generationService.generateReply(trimmed, selected);
  if (replySuffix && !replyText.includes(detectedMood)) {
    replyText += replySuffix;
  }

  // 6. store the assistant's turn
  const assistantMessage = messageService.addMessage({
    userId,
    role: 'assistant',
    text: replyText,
    modality,
  });

  // 7. record the context-size comparison for this turn
  const evaluation = evaluationService.recordEvaluation(userId, {
    currentMessage: trimmed,
    selectedMemories: selected,
  });

  const result = {
    userMessage,
    assistantMessage,
    newMemories,
    explainability: { selected, excludedExample, selectionReason },
    evaluation,
    suggestedMusic,
    audio: null,
  };

  // 7. voice replies get synthesized speech attached, when Rime is configured
  const wantsAudio = synthesizeAudio ?? modality === 'voice';
  if (wantsAudio && ttsService.isConfigured()) {
    try {
      const { buffer, mime } = await ttsService.synthesize(replyText);
      result.audio = { base64: buffer.toString('base64'), mime };
    } catch (err) {
      console.warn('[chatService] TTS synthesis failed:', err.message);
      result.audioError = err.message;
    }
  }

  return result;
}

export default { handleTurn };
