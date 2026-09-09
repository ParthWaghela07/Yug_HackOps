# Memora — Personalized AI Text Companion with Structured Memory

> **PS4 Hackathon MVP**: A personalized companion that remembers structured facts, routines, and emotional style signals across sessions without expensive, noisy transcript replay.

---

## 🌟 Overview & Architecture

Memora addresses the core dilemma of conversational AI companions:
1. **Stateless assistants** lose critical user context between sessions.
2. **Naive full-transcript stuffing** sends hundreds of irrelevant past tokens to the model, which inflates latency, explodes costs, and introduces context distraction.

Memora solves this with an **explainable dual-layer memory system**:
```text
Chat Message 
   ↓
Memory Extraction (Fact, Preference, Goal, Routine, Emotion/Style)
   ↓
Structured Store (Factual Layer vs. Emotional & Style Layer)
   ↓
Transparent Retrieval (Score = 0.60*S + 0.20*I + 0.10*R + 0.10*E)
   ↓
Personalized Companion Generation (Concise, grounded response)
   ↓
Full Explainability ("Why this response?") & Runtime Context Reduction (~85%+)
```

---

## 🚀 Quickstart & Setup

Memora requires **no external database**, **no vector database**, and **no paid API keys**. All data persists reliably in the browser via `localStorage` with deterministic local fallback logic.

### 1. Run with any local static server:

**Option A (Node / npx):**
```bash
npx -y serve . -l 3000
```

**Option B (Python 3):**
```bash
python -m http.server 3000
```

### 2. Open in your browser:
Navigate to: **`http://localhost:3000`**

---

## ⏱️ 60-Second Hackathon Judge Demo Script

Follow these steps to demonstrate every requirement in 60 seconds:

1. **Initialize Demo Context (5s)**
   - Click the **"Load Demo Conversation"** button in the top action bar.
   - Observe 12 realistic prior chat turns appear, representing Alex's prior study week (~620 words).

2. **Inspect Dual-Layer Memory Vault (10s)**
   - Switch to the **"Memory Vault"** tab in the right-hand panel.
   - Show the two visible layers:
     - **Factual Memory Layer** (e.g. ML exam Friday, studies best at night, likes lo-fi music).
     - **Emotional & Style Memory Layer** (e.g. pre-exam anxiety, prefers concise motivation).

3. **Enrich with Mock Music & Social Context (10s)**
   - Click **"Load Music Profile (Demo Context)"** — notice a new factual music preference memory added (`music_demo`).
   - Click **"Load Social Context (Demo Context)"** — notice a new routine memory added (`social_demo`).
   - Highlight that imported data is explicitly labeled as demo context.

4. **Ask the Core Challenge Question (15s)**
   - In the quick prompt chips, click:
     > **“I’m anxious about studying tonight. What should I do?”**
   - Watch Memora deliver the grounded, concise, motivational answer:
     > *"Since your ML exam is Friday and you usually focus better at night with lo-fi music, begin with one 45-minute study block on your hardest topic. Put on your focus playlist, keep the plan small, and take a 10-minute break after it. You’ve already identified what helps you study—use that routine tonight. You've got this!"*

5. **Examine Explainability ("Why this response?") (10s)**
   - Look at the **"Why This Response?"** tab (or click *"Why this response?"* on the assistant bubble).
   - Point out the top scored memories (96%–88% relevance), category badges, and transparent rationale.
   - Expand the *"Unused / Filtered Memories"* to show that unrelated context was excluded.

6. **Demonstrate Measurable Context Reduction (10s)**
   - Switch to the **"Context Evaluation"** tab.
   - Point to the **Context Size Reduction (~88%)** hero stat:
     - Full conversation history: **~620 words**.
     - Selected memory context: **~74 words**.
     - Prompt words saved: **~546 words**.
   - Show the side-by-side comparison table demonstrating efficiency vs. naive transcript stuffing.

7. **Demonstrate User Data Control (Delete & Reset)**
   - Go to the **Memory Vault** and click the trash can icon on any memory. It is instantly deleted.
   - Click **"Reset Data"** to clear storage back to clean state.

---

## 🛠️ File Structure

```text
c:/memora/
├── index.html                 # Single-page interface (Semantic HTML5, ARIA labels, responsive)
├── css/
│   └── styles.css             # Design system: Glassmorphic dark mode, Plus Jakarta Sans, neon accents
├── js/
│   ├── demoData.js            # Pre-seeded persona, 12-turn conversation, mock music/social feeds
│   ├── store.js               # LocalStorage data persistence layer
│   ├── memoryEngine.js        # Extraction rules, scoring formula (0.60S+0.20I+0.10R+0.10E), metrics
│   ├── responseGenerator.js   # Grounded companion response synthesizer with style adaptation
│   └── app.js                 # Application coordinator, DOM event listeners, view rendering
└── README.md                  # Documentation and 60-second judge presentation script
```

---

## 📋 PRD Requirement Traceability

| PRD Section | Requirement | Implementation Status |
|---|---|---|
| **6.1** | Responsive Chat companion with demo loader & reset | ✅ Complete (`index.html`, `app.js`) |
| **6.2** | Memory extraction: fact, preference, goal, routine, emotion_style | ✅ Complete (`memoryEngine.js`) |
| **6.3** | Two visible memory layers (Factual vs Emotional) | ✅ Complete (`app.js`, `styles.css`) |
| **6.4** | Top 3–5 memory retrieval with scoring formula | ✅ Complete (`memoryEngine.js`) |
| **6.5** | Grounded personalized response generator | ✅ Complete (`responseGenerator.js`) |
| **6.6** | "Why this response?" explainability panel | ✅ Complete (`app.js`, `index.html`) |
| **6.7** | Mock music profile enrichment (`music_demo`) | ✅ Complete (`demoData.js`, `store.js`) |
| **6.8** | Mock social context enrichment (`social_demo`) | ✅ Complete (`demoData.js`, `store.js`) |
| **6.9** | Context reduction calculation & comparison card | ✅ Complete (`memoryEngine.js`, `app.js`) |
| **7.0** | Specific test prompt & expected answer match | ✅ Complete (`responseGenerator.js`) |

---

## 🎙️ Voice Layer (Browser-Native Web Speech APIs)

Memora includes a lightweight browser-based voice layer built entirely with standard Web Speech APIs, without requiring backend speech servers, paid API keys, or raw audio file storage.

### Key Capabilities:
- **Speech-to-Text (STT)**: Uses `SpeechRecognition` / `webkitSpeechRecognition` configured to Indian English (`en-IN`).
  - Clicking the microphone icon begins voice recognition and displays a live "Listening (en-IN)..." status bar.
  - The live transcribed text streams directly into the chat input, allowing the user to review and edit before sending.
  - On send, the input flows through the existing memory extraction, retrieval, and explainability pipeline unchanged.
- **Text-to-Speech (TTS)**: Uses `speechSynthesis` and `SpeechSynthesisUtterance` with `en-IN` voice selection.
  - Each assistant response includes a **"Listen"** speaker button that reads the grounded answer aloud.
  - **Auto-Speak Toggle**: Can be enabled from the chat header to automatically vocalize new assistant replies.
  - **Stop Button**: An immediate "Stop Speaking" action is displayed while Memora is vocalizing.

### Browser Compatibility & Limitations:
- **Google Chrome & Microsoft Edge**: Recommended. Full native support for both `webkitSpeechRecognition` and `speechSynthesis`.
- **Mozilla Firefox**: `speechSynthesis` (TTS) is natively supported. `SpeechRecognition` (STT) is disabled by default in Firefox behind `about:config` flags. When unsupported, Memora displays a non-blocking fallback banner, and text chat remains 100% operational.
- **Apple Safari**: Full `speechSynthesis` support; speech recognition requires active HTTPS and explicit microphone authorization.
- **Privacy Guarantee**: Zero audio recordings are stored in browser storage, databases, or third-party servers.

