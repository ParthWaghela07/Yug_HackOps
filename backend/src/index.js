import config from './config.js';
import createApp from './app.js';
import * as llmService from './services/llmService.js';
import * as sttService from './services/sttService.js';
import * as ttsService from './services/ttsService.js';

const app = createApp();

app.listen(config.port, () => {
  console.log(`\nMemora backend listening on http://localhost:${config.port}`);
  console.log(`  LLM (Groq, extraction+generation): ${llmService.isConfigured() ? `LIVE (${config.groq.chatModel})` : 'fallback (heuristic/templated)'}`);
  console.log(`  STT (Groq Whisper):                ${sttService.isConfigured() ? `LIVE (${config.groq.whisperModel})` : 'unavailable — voice input needs GROQ_API_KEY'}`);
  console.log(`  TTS (Rime):                        ${ttsService.isConfigured() ? `LIVE (${config.rime.modelId}/${config.rime.speaker})` : 'unavailable — voice replies need RIME_API_KEY'}`);
  console.log(`  Text chat always works, with or without keys, via the heuristic/templated fallback path.\n`);
});
