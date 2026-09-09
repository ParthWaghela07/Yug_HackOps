/**
 * Memora Master UI Application Coordinator
 * Binds all buttons, tabs, prompt chips, voice STT/TTS, explainability rendering,
 * memory vault rendering, and evaluation metrics.
 */

import * as store from './store.js';
import * as apiClient from './apiClient.js';
import * as memoryEngine from './memoryEngine.js';

let isListening = false;
let autoSpeakEnabled = false;
let speechRecognition = null;

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  initTabs();
  initVoice();
  bindButtons();
  bindPromptChips();
  bindChatForm();
  bindMoodMusic();
  
  // Render existing or initial state
  renderAll();
  fetchMoodTracks('focused');
});

// --- Mood Music Integration ---
function bindMoodMusic() {
  const moodBtns = document.querySelectorAll('.mood-chip-btn');
  moodBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      moodBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const mood = btn.dataset.mood;
      fetchMoodTracks(mood);
    });
  });

  const searchForm = document.getElementById('mood-search-form');
  const moodInput = document.getElementById('mood-input');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = moodInput ? moodInput.value.trim() : '';
      if (val) {
        moodBtns.forEach((b) => b.classList.remove('active'));
        fetchMoodTracks(val);
      }
    });
  }
}

async function fetchMoodTracks(mood) {
  const container = document.getElementById('mood-tracks-container');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; color: var(--text-dim); padding: 30px 0;">
      <div style="font-size: 1.5rem; margin-bottom: 8px;" class="animate-spin">⏳</div>
      <p style="font-size: 0.8rem;">Searching Spotify tracks for "${escapeHtml(mood)}"...</p>
    </div>
  `;

  try {
    const data = await apiClient.getMoodMusic(mood);
    renderMoodTracks(data);
  } catch (err) {
    container.innerHTML = `
      <div style="background: rgba(244, 63, 94, 0.15); border: 1px solid rgba(244, 63, 94, 0.3); padding: 12px; border-radius: 8px; font-size: 0.8rem; color: #f43f5e;">
        Failed to load Spotify music for mood "${escapeHtml(mood)}": ${escapeHtml(err.message)}
      </div>
    `;
  }
}

function renderMoodTracks(data) {
  const container = document.getElementById('mood-tracks-container');
  if (!container) return;

  const tracks = data?.tracks || [];
  let html = '';

  if (data?.isFallback) {
    html += `
      <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.25); padding: 8px 10px; border-radius: 6px; font-size: 0.72rem; color: #fbbf24; margin-bottom: 12px;">
        ℹ️ Demo fallback tracks shown. Set SPOTIFY_CLIENT_ID & SPOTIFY_CLIENT_SECRET in backend/.env for live Spotify API search!
      </div>
    `;
  }

  if (tracks.length === 0) {
    container.innerHTML = html + `<p style="font-size:0.8rem; color:var(--text-dim);">No Spotify tracks found for "${escapeHtml(data?.mood)}". Try another mood!</p>`;
    return;
  }

  html += tracks
    .map(
      (t) => `
    <div class="track-card">
      <img src="${t.albumArt || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300'}" alt="${escapeHtml(t.name)}" class="track-art" />
      <div class="track-info">
        <div class="track-title">${escapeHtml(t.name)}</div>
        <div class="track-artist">${escapeHtml(t.artist)}</div>
        ${t.album ? `<div class="track-album">${escapeHtml(t.album)}</div>` : ''}
        ${
          t.previewUrl
            ? `<audio controls class="track-audio" src="${t.previewUrl}"></audio>`
            : `<a href="${t.spotifyUrl}" target="_blank" rel="noopener noreferrer" class="btn-spotify">🎧 Listen on Spotify ➔</a>`
        }
      </div>
    </div>
  `
    )
    .join('');

  container.innerHTML = html;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Tab Controller ---
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(`tab-${target}`);
      if (activeContent) activeContent.classList.add('active');
    });
  });
}

export function switchTab(tabName) {
  const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
  if (btn) btn.click();
}

// --- Voice Recognition (STT) & Speech Synthesis (TTS) ---
function initVoice() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const statusEl = document.getElementById('voice-status-bar');

  if (SpeechRec) {
    speechRecognition = new SpeechRec();
    speechRecognition.continuous = false;
    speechRecognition.interimResults = true;
    speechRecognition.lang = 'en-IN';

    const chatInput = document.getElementById('chat-input');

    speechRecognition.onstart = () => {
      isListening = true;
      const micBtn = document.getElementById('btn-mic');
      if (micBtn) micBtn.classList.add('recording');
      if (statusEl) statusEl.style.display = 'flex';
    };

    speechRecognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (chatInput) chatInput.value = transcript;
    };

    speechRecognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      stopListening();
    };

    speechRecognition.onend = () => {
      stopListening();
    };
  } else {
    if (statusEl) {
      statusEl.innerHTML = '<span style="color:#9ca3af; font-size:0.75rem;">Voice STT: Web Speech API available in Chrome/Edge</span>';
    }
  }
}

function toggleListening() {
  if (!speechRecognition) {
    alert('Web Speech STT recognition is natively supported in Chrome, Edge, and Safari.');
    return;
  }

  if (isListening) {
    speechRecognition.stop();
  } else {
    speechRecognition.start();
  }
}

function stopListening() {
  isListening = false;
  const micBtn = document.getElementById('btn-mic');
  if (micBtn) micBtn.classList.remove('recording');
  const statusEl = document.getElementById('voice-status-bar');
  if (statusEl) statusEl.style.display = 'none';
}

export function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel(); // Stop prior speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = 'en-IN';
  window.speechSynthesis.speak(utterance);
}

// --- Bind Action Buttons ---
function bindButtons() {
  // 1. Load Demo Conversation Button
  const btnDemo = document.getElementById('btn-load-demo');
  if (btnDemo) {
    btnDemo.addEventListener('click', async () => {
      btnDemo.disabled = true;
      btnDemo.innerText = 'Loading...';
      try {
        await apiClient.loadDemoConversation();
        renderAll();
        switchTab('vault');
      } finally {
        btnDemo.disabled = false;
        btnDemo.innerHTML = '⚡ Load Demo Conversation';
      }
    });
  }

  // 2. Load Music Profile Button
  const btnMusic = document.getElementById('btn-load-music');
  if (btnMusic) {
    btnMusic.addEventListener('click', async () => {
      btnMusic.disabled = true;
      try {
        await apiClient.loadMusicProfile();
        renderAll();
        switchTab('vault');
      } finally {
        btnMusic.disabled = false;
      }
    });
  }

  // 3. Load Social Context Button
  const btnSocial = document.getElementById('btn-load-social');
  if (btnSocial) {
    btnSocial.addEventListener('click', async () => {
      btnSocial.disabled = true;
      try {
        await apiClient.loadSocialContext();
        renderAll();
        switchTab('vault');
      } finally {
        btnSocial.disabled = false;
      }
    });
  }

  // 4. Reset Data Button
  const btnReset = document.getElementById('btn-reset-data');
  if (btnReset) {
    btnReset.addEventListener('click', async () => {
      if (confirm('Reset memory vault and conversation history back to clean state?')) {
        await apiClient.resetAllData();
        renderAll();
      }
    });
  }

  // 5. Microphone Button
  const btnMic = document.getElementById('btn-mic');
  if (btnMic) {
    btnMic.addEventListener('click', toggleListening);
  }

  // 6. Auto-Speak Toggle
  const toggleAutoSpeak = document.getElementById('toggle-auto-speak');
  if (toggleAutoSpeak) {
    toggleAutoSpeak.addEventListener('change', (e) => {
      autoSpeakEnabled = e.target.checked;
    });
  }
}

// --- Prompt Chips ---
function bindPromptChips() {
  const chips = document.querySelectorAll('.chip');
  const chatInput = document.getElementById('chat-input');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const text = chip.dataset.prompt || chip.innerText.trim();
      if (chatInput) {
        chatInput.value = text;
        submitChatMessage(text);
      }
    });
  });
}

// --- Chat Form Handler ---
function bindChatForm() {
  const form = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (text) {
        submitChatMessage(text);
        chatInput.value = '';
      }
    });
  }
}

async function submitChatMessage(text) {
  const sendBtn = document.getElementById('btn-send');
  if (sendBtn) sendBtn.disabled = true;

  try {
    const res = await apiClient.sendMessage(text);
    renderAll();

    if (res?.suggestedMusic) {
      renderMoodTracks(res.suggestedMusic);
      switchTab('music');
    }

    // Auto-speak if enabled
    if (autoSpeakEnabled && res?.assistantMessage?.text) {
      speakText(res.assistantMessage.text);
    }
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

// --- Render Functions ---
function renderAll() {
  renderChatHistory();
  renderMemoryVault();
  renderExplainability();
  renderEvaluationDashboard();
}

function renderChatHistory() {
  const container = document.getElementById('chat-history');
  if (!container) return;

  const messages = store.getStoredMessages();
  if (messages.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-dim); margin-top: 40px; font-size: 0.9rem;">
        <div style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.8;">🧠</div>
        <p style="font-weight: 600; color: var(--text-muted);">Welcome to Memora</p>
        <p style="font-size: 0.8rem; margin-top: 4px;">Click <strong>"Load Demo Conversation"</strong> above or type a message to start!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = messages
    .map(
      (m) => `
    <div class="message-wrapper ${m.role}">
      <div class="message-header">
        <span>${m.role === 'user' ? 'Alex (User)' : 'Memora Companion'}</span>
        <span>•</span>
        <span>${new Date(m.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="message-bubble">
        ${m.text}
      </div>
      ${
        m.role === 'assistant'
          ? `
        <div class="message-actions">
          <button class="btn-icon btn-listen" data-text="${escapeHtml(m.text)}">🔊 Listen</button>
          <button class="btn-icon btn-explain-inline">💡 Why this response?</button>
        </div>
      `
          : ''
      }
    </div>
  `
    )
    .join('');

  // Bind listen and inline explain buttons
  container.querySelectorAll('.btn-listen').forEach((btn) => {
    btn.addEventListener('click', () => {
      speakText(btn.dataset.text);
    });
  });

  container.querySelectorAll('.btn-explain-inline').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchTab('explain');
    });
  });

  // Auto-scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function renderMemoryVault() {
  const factualContainer = document.getElementById('factual-layer');
  const emotionalContainer = document.getElementById('emotional-layer');
  if (!factualContainer || !emotionalContainer) return;

  const memories = store.getStoredMemories();
  const factuals = memories.filter((m) => m.layer === 'factual');
  const emotionals = memories.filter((m) => m.layer === 'emotional');

  factualContainer.innerHTML =
    factuals.length === 0
      ? `<p style="font-size:0.78rem; color:var(--text-dim);">No factual memories stored yet.</p>`
      : factuals.map(renderMemoryCard).join('');

  emotionalContainer.innerHTML =
    emotionals.length === 0
      ? `<p style="font-size:0.78rem; color:var(--text-dim);">No emotional/style memories stored yet.</p>`
      : emotionals.map(renderMemoryCard).join('');

  // Bind memory delete buttons
  document.querySelectorAll('.btn-delete-memory').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      await apiClient.deleteMemory(id);
      renderAll();
    });
  });
}

function renderMemoryCard(m) {
  const badgeClass = m.badgeText ? 'badge-demo' : m.layer === 'factual' ? 'badge-factual' : 'badge-emotional';
  const badgeLabel = m.badgeText || (m.layer === 'factual' ? 'Factual Layer' : 'Emotional & Style');

  return `
    <div class="memory-card">
      <div class="memory-card-header">
        <span class="memory-badge ${badgeClass}">${badgeLabel}</span>
        <button class="btn-icon btn-delete-memory" data-id="${m.id}" title="Delete memory">🗑️</button>
      </div>
      <div class="memory-text">${escapeHtml(m.text)}</div>
      <div class="memory-meta">
        <span>Category: <strong>${m.category || 'general'}</strong></span>
        <span>Importance: <strong>${Math.round((m.importance || 0.5) * 100)}%</strong></span>
      </div>
    </div>
  `;
}

function renderExplainability() {
  const container = document.getElementById('tab-explain');
  if (!container) return;

  const memories = store.getStoredMemories();
  const messages = store.getStoredMessages();
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');

  if (!lastUserMsg || memories.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-dim); margin-top: 40px;">
        <p style="font-size: 0.9rem;">No recent message explainability available yet.</p>
        <p style="font-size: 0.78rem; margin-top: 6px;">Load demo conversation or ask a question to see memory retrieval breakdowns!</p>
      </div>
    `;
    return;
  }

  const result = memoryEngine.retrieveTopMemories(memories, lastUserMsg.text, 3, 5, 0.08);

  let html = `
    <div style="margin-bottom: 16px;">
      <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main);">Why This Response?</h3>
      <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">Transparent memory retrieval breakdown for query: <em>"${escapeHtml(lastUserMsg.text)}"</em></p>
    </div>
    
    <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.25); border-radius: 10px; padding: 12px; font-size: 0.8rem; color: #c7d2fe; margin-bottom: 16px;">
      💡 <strong>Rationale:</strong> ${result.selectionReason}
    </div>
    
    <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-dim); margin-bottom: 10px;">Top Retrieved Memories (${result.selected.length})</div>
  `;

  html += result.selected
    .map(
      (s) => `
    <div class="explain-card">
      <div class="explain-score-row">
        <span class="memory-badge ${s.memory.layer === 'factual' ? 'badge-factual' : 'badge-emotional'}">${s.memory.layer}</span>
        <span class="score-pill">Relevance: ${Math.round(s.score * 100)}%</span>
      </div>
      <div class="memory-text" style="font-weight: 600;">${escapeHtml(s.memory.text)}</div>
      <div class="breakdown-grid">
        <div>Topical Similarity: <strong>${Math.round(s.breakdown.similarity * 100)}%</strong> (60%)</div>
        <div>Importance Weight: <strong>${Math.round(s.breakdown.importance * 100)}%</strong> (20%)</div>
        <div>Recency Decay: <strong>${Math.round(s.breakdown.recency * 100)}%</strong> (10%)</div>
        <div>Emotional Match: <strong>${Math.round(s.breakdown.emotionalMatch * 100)}%</strong> (10%)</div>
      </div>
    </div>
  `
    )
    .join('');

  if (result.excludedExample) {
    const ex = result.excludedExample;
    html += `
      <div style="font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--text-dim); margin: 20px 0 10px 0;">Excluded Candidate Example</div>
      <div class="explain-card" style="opacity: 0.65; border-style: dashed;">
        <div class="explain-score-row">
          <span class="memory-badge badge-demo">Filtered Out</span>
          <span class="score-pill" style="color: var(--text-muted); background: rgba(255,255,255,0.08);">Score: ${Math.round(ex.score * 100)}%</span>
        </div>
        <div class="memory-text">${escapeHtml(ex.memory.text)}</div>
        <p style="font-size: 0.72rem; color: var(--text-dim); margin-top: 6px;">Excluded because topical similarity to the current question was below cutoff.</p>
      </div>
    `;
  }

  container.innerHTML = html;
}

function renderEvaluationDashboard() {
  const container = document.getElementById('tab-eval');
  if (!container) return;

  const evals = store.getStoredEvaluations();
  const latest = evals.length ? evals[evals.length - 1] : null;

  if (!latest) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-dim); margin-top: 40px;">
        <p style="font-size: 0.9rem;">No context evaluation baseline calculated yet.</p>
        <p style="font-size: 0.78rem; margin-top: 6px;">Click <strong>"Load Demo Conversation"</strong> to trigger runtime context reduction analysis!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="margin-bottom: 16px;">
      <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main);">Context Size Efficiency</h3>
      <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">Measurable reduction comparing full-transcript replay vs. Memora dual-layer memory.</p>
    </div>

    <div class="hero-stat-card">
      <div class="hero-stat-number">~${latest.reductionPct}%</div>
      <div class="hero-stat-label">Runtime Context Size Reduction</div>
      <p style="font-size: 0.75rem; color: #a7f3d0; margin-top: 8px;">Saved ${latest.promptWordsSaved || latest.naiveWordCount - latest.structuredWordCount} unnecessary prompt words this turn!</p>
    </div>

    <div class="explain-card">
      <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 12px; color: var(--text-main);">Turn Metric Comparison</h4>
      <table class="eval-table">
        <thead>
          <tr>
            <th>Context Approach</th>
            <th>Word Count</th>
            <th>Efficiency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Naive Full Transcript</strong></td>
            <td>${latest.naiveWordCount} words</td>
            <td><span style="color:var(--accent-rose)">100% baseline</span></td>
          </tr>
          <tr>
            <td><strong>Memora Dual-Layer Vault</strong></td>
            <td>${latest.structuredWordCount} words</td>
            <td><span style="color:#34d399">~${100 - latest.reductionPct}% context (${latest.reductionPct}% saved)</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div style="font-size: 0.75rem; color: var(--text-dim); line-height: 1.5; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px;">
      ℹ️ <strong>Why this matters:</strong> Naive full-transcript stuffed ~${latest.naiveWordCount} words to the LLM on every call. Memora's transparent score retriever selected only ${latest.memoriesUsed} relevant memories (~${latest.structuredWordCount} words total), dramatically lowering latency, cost, and hallucination risk.
    </div>
  `;
}
