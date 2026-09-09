/**
 * Memora API Client: Integrates with Express Backend (http://localhost:4000/api)
 * with automatic deterministic client-side memory engine fallback.
 */

import * as store from './store.js';
import * as memoryEngine from './memoryEngine.js';
import * as responseGenerator from './responseGenerator.js';
import { MOCK_PRESEEDED_MEMORIES, DEMO_CONVERSATION_HISTORY, MOCK_MUSIC_PROFILE, MOCK_SOCIAL_POSTS } from './demoData.js';

const BACKEND_BASE_URL = 'http://localhost:4000';

async function isBackendOnline() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/health`, { method: 'GET', signal: AbortSignal.timeout(1200) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function sendMessage(text) {
  const online = await isBackendOnline();
  if (online) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend message request failed, using local engine:', err);
    }
  }

  // --- Local Memory Engine Processing ---
  const currentMemories = store.getStoredMemories();
  const currentMessages = store.getStoredMessages();

  // 1. Extract new memories
  const newExtracted = memoryEngine.extractMemories(text);
  const updatedMemories = [...currentMemories, ...newExtracted];
  store.saveMemories(updatedMemories);

  // 2. Retrieve top memories
  const explainability = memoryEngine.retrieveTopMemories(updatedMemories, text, 3, 5, 0.08);

  // 3. Generate response & detect mood music
  let assistantReplyText = responseGenerator.generatePersonalizedResponse(text, explainability.selected);

  let suggestedMusic = null;
  const lower = text.toLowerCase();
  let mood = null;
  if (/sad|depressed|unhappy|down/.test(lower)) mood = 'sad';
  else if (/anxious|anxiety|worried|stressed/.test(lower)) mood = 'anxious';
  else if (/happy|excited|great/.test(lower)) mood = 'happy';
  else if (/calm|peaceful|relaxed/.test(lower)) mood = 'calm';
  else if (/study|focus|cramming|exam/.test(lower)) mood = 'focused';

  if (mood) {
    suggestedMusic = await getMoodMusic(mood);
    const topTrack = suggestedMusic?.tracks?.[0];
    if (topTrack && !assistantReplyText.includes(topTrack.name)) {
      assistantReplyText += ` I've recommended some ${mood} tracks for you, starting with "${topTrack.name}" by ${topTrack.artist} — check out the Mood Music tab!`;
    }
  }

  // 4. Save user & assistant messages
  const userMsg = { id: `msg-${Date.now()}-u`, role: 'user', text, timestamp: new Date().toISOString() };
  const assistantMsg = { id: `msg-${Date.now()}-a`, role: 'assistant', text: assistantReplyText, timestamp: new Date().toISOString() };
  const updatedMessages = [...currentMessages, userMsg, assistantMsg];
  store.saveMessages(updatedMessages);

  // 5. Calculate evaluation metrics
  const evaluation = memoryEngine.calculateContextEvaluation(updatedMessages, text, explainability.selected);
  const storedEvals = store.getStoredEvaluations();
  store.saveEvaluations([...storedEvals, evaluation]);

  return {
    userMessage: userMsg,
    assistantMessage: assistantMsg,
    newMemories: newExtracted,
    explainability,
    evaluation,
    suggestedMusic,
  };
}

export async function loadDemoConversation() {
  const online = await isBackendOnline();
  if (online) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/demo/load`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend demo load failed, using local store:', err);
    }
  }

  // Local demo seeding
  store.saveMemories(MOCK_PRESEEDED_MEMORIES);
  const historyMsgs = DEMO_CONVERSATION_HISTORY.map((m, idx) => ({
    id: `demo-msg-${idx}`,
    role: m.role,
    text: m.text,
    timestamp: new Date(Date.now() - (DEMO_CONVERSATION_HISTORY.length - idx) * 60000).toISOString(),
  }));
  store.saveMessages(historyMsgs);

  // Initial evaluation baseline
  const evalData = memoryEngine.calculateContextEvaluation(historyMsgs, "I'm anxious about studying tonight. What should I do?", MOCK_PRESEEDED_MEMORIES.slice(0, 3));
  store.saveEvaluations([evalData]);

  return { success: true, memories: MOCK_PRESEEDED_MEMORIES, messages: historyMsgs, evaluation: evalData };
}

export async function loadMusicProfile() {
  const online = await isBackendOnline();
  if (online) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/enrichment/music`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend music load failed, using local store:', err);
    }
  }

  const musicMemories = [
    {
      id: `mem-music-1`,
      layer: 'factual',
      category: 'preference',
      text: `Top Music Genres: ${MOCK_MUSIC_PROFILE.topGenres.join(', ')} (Spotify Sync)`,
      importance: 0.7,
      confidence: 0.9,
      source_type: 'explicit',
      badgeText: 'music_demo',
      createdAt: new Date().toISOString(),
    },
    {
      id: `mem-music-2`,
      layer: 'emotional',
      category: 'routine',
      text: MOCK_MUSIC_PROFILE.listeningContext,
      importance: 0.75,
      confidence: 0.85,
      source_type: 'inferred',
      badgeText: 'music_demo',
      createdAt: new Date().toISOString(),
    },
  ];

  const current = store.getStoredMemories();
  const updated = [...current, ...musicMemories];
  store.saveMemories(updated);
  return { success: true, newMemories: musicMemories };
}

export async function loadSocialContext() {
  const online = await isBackendOnline();
  if (online) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/enrichment/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: MOCK_SOCIAL_POSTS }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend social load failed, using local store:', err);
    }
  }

  const socialMemories = MOCK_SOCIAL_POSTS.slice(0, 3).map((post, i) => ({
    id: `mem-social-${i}`,
    layer: post.includes('anxious') || post.includes('😩') ? 'emotional' : 'factual',
    category: 'social',
    text: `Recent Social Post: "${post}"`,
    importance: 0.65,
    confidence: 0.75,
    source_type: 'inferred',
    badgeText: 'social_demo',
    createdAt: new Date().toISOString(),
  }));

  const current = store.getStoredMemories();
  const updated = [...current, ...socialMemories];
  store.saveMemories(updated);
  return { success: true, newMemories: socialMemories };
}

export async function deleteMemory(id) {
  const online = await isBackendOnline();
  if (online) {
    try {
      await fetch(`${BACKEND_BASE_URL}/api/memories/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Backend memory delete failed:', err);
    }
  }

  const current = store.getStoredMemories();
  const updated = current.filter((m) => m.id !== id);
  store.saveMemories(updated);
  return { success: true };
}

export async function resetAllData() {
  const online = await isBackendOnline();
  if (online) {
    try {
      await fetch(`${BACKEND_BASE_URL}/api/demo/reset`, { method: 'POST' });
    } catch (err) {
      console.warn('Backend reset failed:', err);
    }
  }

  store.clearAllData();
  return { success: true };
}

export async function getMoodMusic(mood) {
  const online = await isBackendOnline();
  if (online) {
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/mood-music`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood }),
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend mood music failed, using local fallback:', err);
    }
  }

  return {
    mood,
    isFallback: true,
    fallbackMessage: 'Offline mode active — showing curated demo tracks for ' + mood,
    tracks: [
      { id: 'fb-1', name: 'Lofi Focus Beat', artist: 'Lofi Girl', album: 'Chillhop Essentials', albumArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300', previewUrl: null, spotifyUrl: 'https://open.spotify.com' },
      { id: 'fb-2', name: 'Deep Focus Synth', artist: 'Kiasmos', album: 'Blurred', albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300', previewUrl: null, spotifyUrl: 'https://open.spotify.com' },
      { id: 'fb-3', name: 'Ambient Sunrise', artist: 'Brian Eno', album: 'Reflection', albumArt: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300', previewUrl: null, spotifyUrl: 'https://open.spotify.com' }
    ]
  };
}
