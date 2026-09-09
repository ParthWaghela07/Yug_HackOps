const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

// ---- Text chat (secondary channel) ----------------------------------

export async function sendTextMessage(text) {
  const res = await fetch(`${BASE_URL}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return handle(res);
}

export async function getMessages() {
  const res = await fetch(`${BASE_URL}/api/messages`);
  return handle(res);
}

// ---- Voice (primary channel) -----------------------------------------

export async function sendVoiceMessage(audioBlob, filename = 'recording.webm') {
  const form = new FormData();
  form.append('audio', audioBlob, filename);
  const res = await fetch(`${BASE_URL}/api/voice/message`, {
    method: 'POST',
    body: form,
  });
  return handle(res);
}

export async function transcribeOnly(audioBlob, filename = 'recording.webm') {
  const form = new FormData();
  form.append('audio', audioBlob, filename);
  const res = await fetch(`${BASE_URL}/api/voice/transcribe`, {
    method: 'POST',
    body: form,
  });
  return handle(res);
}

export async function synthesizeSpeech(text) {
  const res = await fetch(`${BASE_URL}/api/voice/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return handle(res);
}

export async function getVoiceStatus() {
  const res = await fetch(`${BASE_URL}/api/voice/status`);
  return handle(res);
}

// ---- Memories -----------------------------------------------------------

export async function getMemories(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/api/memories${qs ? `?${qs}` : ''}`);
  return handle(res);
}

export async function deleteMemory(id) {
  const res = await fetch(`${BASE_URL}/api/memories/${id}`, { method: 'DELETE' });
  return handle(res);
}

// ---- Enrichment -----------------------------------------------------------

export async function loadMusicProfile() {
  const res = await fetch(`${BASE_URL}/api/enrichment/music`, { method: 'POST' });
  return handle(res);
}

export async function loadSocialContext(posts) {
  const res = await fetch(`${BASE_URL}/api/enrichment/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ posts }),
  });
  return handle(res);
}

// ---- Demo -----------------------------------------------------------

export async function loadDemoConversation() {
  const res = await fetch(`${BASE_URL}/api/demo/load`, { method: 'POST' });
  return handle(res);
}

export async function resetDemo() {
  const res = await fetch(`${BASE_URL}/api/demo/reset`, { method: 'POST' });
  return handle(res);
}

// ---- Evaluation -----------------------------------------------------------

export async function getLatestEvaluation() {
  const res = await fetch(`${BASE_URL}/api/evaluation/latest`);
  return handle(res);
}

export async function queryEvaluation(query) {
  const res = await fetch(`${BASE_URL}/api/evaluation?query=${encodeURIComponent(query || '')}`);
  return handle(res);
}

// ---- Mood Music (Spotify Integration) -------------------------------------

export async function getMoodMusic(mood) {
  const res = await fetch(`${BASE_URL}/api/mood-music`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mood }),
  });
  return handle(res);
}
