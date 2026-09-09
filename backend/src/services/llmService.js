import config from '../config.js';

export class LLMNotConfiguredError extends Error {
  constructor() {
    super('GROQ_API_KEY is not set');
    this.name = 'LLMNotConfiguredError';
  }
}

export function isConfigured() {
  return Boolean(config.groq.apiKey);
}

function stripJsonFences(text) {
  return text
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

/**
 * Raw call to the Groq Messages API (OpenAI-compatible /chat/completions).
 * @param {{system?: string, messages: {role: string, content: string}[], temperature?: number, maxTokens?: number, jsonMode?: boolean}} opts
 * @returns {Promise<string>} the assistant's text content
 */
export async function chatComplete({ system, messages, temperature = 0.4, maxTokens = 600, jsonMode = false }) {
  if (!isConfigured()) throw new LLMNotConfiguredError();

  const body = {
    model: config.groq.chatModel,
    temperature,
    max_tokens: maxTokens,
    messages: [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages,
    ],
  };

  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetch(`${config.groq.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.groq.apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Groq chat completion failed (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content || '';
  return jsonMode ? stripJsonFences(text) : text.trim();
}

/**
 * Convenience wrapper that asks for a JSON object and parses it.
 * Throws if the model didn't return valid JSON.
 */
export async function chatCompleteJSON(opts) {
  const raw = await chatComplete({ ...opts, jsonMode: true });
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Groq did not return valid JSON: ${raw.slice(0, 200)}`);
  }
}

export default { isConfigured, chatComplete, chatCompleteJSON, LLMNotConfiguredError };
