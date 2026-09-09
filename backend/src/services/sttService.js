import config from '../config.js';

export class STTNotConfiguredError extends Error {
  constructor() {
    super('GROQ_API_KEY is not set — voice input requires it');
    this.name = 'STTNotConfiguredError';
  }
}

export function isConfigured() {
  return Boolean(config.groq.apiKey);
}

/**
 * Transcribe an audio buffer to text via Groq's OpenAI-compatible Whisper endpoint.
 * @param {Buffer} buffer raw audio bytes (webm/opus, mp3, wav, m4a, etc.)
 * @param {string} mimetype e.g. 'audio/webm'
 * @param {string} filename e.g. 'recording.webm'
 * @returns {Promise<string>} the transcript
 */
export async function transcribe(buffer, mimetype = 'audio/webm', filename = 'recording.webm') {
  if (!isConfigured()) throw new STTNotConfiguredError();

  const form = new FormData();
  const blob = new Blob([buffer], { type: mimetype || 'application/octet-stream' });
  form.append('file', blob, filename);
  form.append('model', config.groq.whisperModel);
  form.append('response_format', 'json');

  const res = await fetch(`${config.groq.baseUrl}/audio/transcriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.groq.apiKey}`,
    },
    body: form,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Groq transcription failed (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  return (data?.text || '').trim();
}

export default { isConfigured, transcribe, STTNotConfiguredError };
