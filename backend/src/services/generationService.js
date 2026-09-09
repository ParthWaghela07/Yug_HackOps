import * as llmService from './llmService.js';

const GENERATION_SYSTEM_PROMPT = `You are Memora, a warm and personalized AI companion. You are having a real-time text or voice conversation with one specific person.

You are given ONLY the person's current message and a short list of relevant memories you've stored about them — never the full conversation history. Use the memories naturally to personalize your reply, the way a close friend who remembers details would, without listing them mechanically or saying "according to my notes."

Hard rules:
- You are NOT a therapist, doctor, or emergency service, and must never present yourself as one. If the person describes a medical emergency or crisis, gently encourage them to reach out to a real person or professional/emergency service — do not attempt to handle it yourself.
- Keep replies conversational and concise (2-5 sentences unless the person clearly wants more detail).
- Reference at most one or two memories explicitly; weave them in naturally.
- If no memories are relevant, just respond thoughtfully to the message itself.`;

function formatMemoriesForPrompt(selectedMemories) {
  if (!selectedMemories?.length) return 'No relevant memories stored yet.';
  return selectedMemories
    .map((s, i) => `${i + 1}. [${s.memory.layer}] ${s.memory.text}`)
    .join('\n');
}

function templatedFallback(currentMessage, selectedMemories) {
  const top = selectedMemories?.[0]?.memory;
  const lower = currentMessage.toLowerCase();

  if (/anxious|anxiety|worried|stressed|overwhelmed|nervous/.test(lower)) {
    const suffix = top
      ? ` I remember ${top.text.toLowerCase().startsWith('expressed') ? 'you\'ve felt this way before' : top.text.toLowerCase()} — maybe that could help tonight too.`
      : '';
    return `That sounds like a lot to carry right now. Take a breath — you don't have to solve everything at once.${suffix}`;
  }

  if (top) {
    return `Thanks for sharing that. Since ${top.text.toLowerCase()}, I'll keep that in mind — tell me more about what's on your mind.`;
  }

  return "Got it — I'm listening. Tell me more about what's going on.";
}

/**
 * Generate a personalized reply from ONLY the current message + selected
 * memories (never the full transcript), per the PRD.
 */
export async function generateReply(currentMessage, selectedMemories) {
  if (llmService.isConfigured()) {
    try {
      const userContent = `Current message: "${currentMessage}"\n\nRelevant memories:\n${formatMemoriesForPrompt(
        selectedMemories
      )}`;
      const reply = await llmService.chatComplete({
        system: GENERATION_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userContent }],
        temperature: 0.7,
        maxTokens: 300,
      });
      if (reply) return reply;
    } catch (err) {
      console.warn('[generationService] LLM generation failed, falling back to template:', err.message);
    }
  }

  return templatedFallback(currentMessage, selectedMemories);
}

export default { generateReply };
