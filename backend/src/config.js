import 'dotenv/config';

const num = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export const config = {
  port: num(process.env.PORT, 4000),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  demoUserId: process.env.DEMO_USER_ID || 'demo-user',

  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    baseUrl: 'https://api.groq.com/openai/v1',
    chatModel: process.env.GROQ_CHAT_MODEL || 'llama-3.3-70b-versatile',
    whisperModel: process.env.GROQ_WHISPER_MODEL || 'whisper-large-v3-turbo',
  },

  rime: {
    apiKey: process.env.RIME_API_KEY || '',
    baseUrl: 'https://users.rime.ai/v1/rime-tts',
    modelId: process.env.RIME_MODEL_ID || 'mistv2',
    speaker: process.env.RIME_SPEAKER || 'astra',
    lang: process.env.RIME_LANG || 'eng',
    samplingRate: num(process.env.RIME_SAMPLING_RATE, 22050),
  },

  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || '',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
  },

  // Retrieval scoring weights (see retrievalService) — must sum to 1.0
  retrieval: {
    weights: {
      similarity: 0.6,
      importance: 0.2,
      recency: 0.1,
      emotionalMatch: 0.1,
    },
    recencyHalfLifeHours: 72,
    minMemories: 3,
    maxMemories: 5,
    minScoreThreshold: 0.08,
  },

  extraction: {
    maxMemoriesPerTurn: 3,
    duplicateSimilarityThreshold: 0.82,
  },
};

export default config;
