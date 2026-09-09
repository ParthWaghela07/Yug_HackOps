import config from '../config.js';

export class TTSNotConfiguredError extends Error {
  constructor() {
    super('RIME_API_KEY is not set — voice replies require it');
    this.name = 'TTSNotConfiguredError';
  }
}

export function isConfigured() {
  return Boolean(config.rime.apiKey);
}

// Rime's API accepts up to 1,000 characters per request.
const MAX_CHARS = 1000;

function truncateForTTS(text) {
  if (text.length <= MAX_CHARS) return text;
  return `${text.slice(0, MAX_CHARS - 1)}…`;
}

/**
 * Synthesize speech for the given text via Rime.
 * @param {string} text
 * @returns {Promise<{buffer: Buffer, mime: string}>}
 */
export async function synthesize(text) {
  if (!isConfigured()) throw new TTSNotConfiguredError();
  const trimmed = truncateForTTS(String(text || '').trim());
  if (!trimmed) throw new Error('No text to synthesize');

  const res = await fetch(config.rime.baseUrl, {
    method: 'POST',
    headers: {
      Accept: 'audio/mpeg',
      Authorization: `Bearer ${config.rime.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: trimmed,
      modelId: config.rime.modelId,
      speaker: config.rime.speaker,
      lang: config.rime.lang,
      samplingRate: config.rime.samplingRate,
      speedAlpha: 1.0,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Rime TTS failed (${res.status}): ${errText.slice(0, 300)}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return { buffer: Buffer.from(arrayBuffer), mime: 'audio/mpeg' };
}

export default { isConfigured, synthesize, TTSNotConfiguredError };
