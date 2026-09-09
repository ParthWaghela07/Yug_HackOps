# PRD — Memora: Personalized AI Companion with Structured Memory

**Hackathon problem statement:** PS4 — Personalized Voice AI Companion  
**Document status:** MVP / Hackathon Build  
**Target build time:** 3 hours  
**Primary mode:** Text chat (voice is out of scope for the MVP)

---

## 1. Product Summary

Memora is a personalized AI chat companion that remembers useful user information across conversations without replaying the full chat transcript. It extracts important facts, preferences, goals, and emotional/style signals from messages, stores them as structured memories, and retrieves only the few memories relevant to the user’s current request.

The product demonstrates an explainable memory workflow:

```text
Chat → Extract memories → Structure/store → Retrieve top relevant memories
→ Generate personalized response → Explain memories used → Compare context size
```

The MVP addresses PS4’s central requirements:

- Persistent conversation memory.
- Separate factual and emotional/personality memory layers.
- Context-aware retrieval and ranking.
- Enrichment through music and social-context signals.
- Personalized companion responses.
- Measurable reduction in context size versus naive full-transcript retrieval.
- Clear explanation of why each memory influenced a response.

---

## 2. Problem

Most AI companions either:

1. Forget user details between sessions, resulting in generic conversations; or
2. Send the entire previous transcript to the model, which becomes costly, slow, noisy, and difficult to explain.

A user may have mentioned an upcoming exam, a preferred communication style, and a music preference across many prior messages. A full-history approach includes irrelevant details, while a stateless assistant loses the meaningful details entirely.

### Problem statement

Build a chat companion that persists user context as structured memories, retrieves only the most relevant memories for each new message, generates personalized responses, and visibly proves that this approach is more focused than full-transcript context.

---

## 3. Goals and Scope

### Goals

- Provide a working personalized chat companion.
- Extract durable, useful memories from user messages.
- Separate memories into factual and emotional/style layers.
- Retrieve the top 3–5 memories relevant to a new question.
- Generate a response using only the selected context plus recent chat context.
- Show the user exactly which memories were used and why.
- Demonstrate lower context size than naive full-history prompting.
- Simulate music and social-context enrichment through opt-in demo data.

### Non-goals

The following are intentionally out of scope for the three-hour MVP:

- Production-quality voice input, speech recognition, or text-to-speech.
- Real Spotify, Instagram, X, or other OAuth integrations.
- Production authentication and multi-user account management.
- A graph database or advanced graph visualizer.
- Full production encryption, audit logging, and compliance workflows.
- Medical, therapy, diagnosis, or crisis-support claims.
- High-stakes decision making.
- Long-term accuracy benchmarking with real users.
- Full multilingual support.

---

## 4. Target User

### Primary persona: Busy student

A student wants an AI companion that remembers their goals, study habits, and preferred encouragement style across sessions.

**Example details:**

- Has a machine-learning exam on Friday.
- Studies most effectively at night.
- Likes lo-fi music while studying.
- Feels anxious before exams.
- Prefers concise, motivational answers.

### Core user job

> “Help me with my current situation while remembering the things I have already told you, without making me repeat myself.”

---

## 5. User Stories

### Core chat and memory

- As a user, I want to chat with a companion so that I can receive helpful responses.
- As a user, I want the companion to remember important details I explicitly share so that future responses are personalized.
- As a user, I want the system to distinguish facts from emotional or communication-style context.
- As a user, I want the companion to retrieve only relevant memories so that its responses remain focused.
- As a user, I want to see which memories influenced a response so that personalization is transparent.
- As a user, I want to delete an incorrect memory so that I remain in control of my data.

### Context enrichment

- As a user, I want to load optional music activity so that the companion can understand music-related preferences.
- As a user, I want to load optional demo social context so that the companion can identify relevant interests and routines.

### Evaluation

- As a hackathon judge, I want to compare naive full-history context with structured-memory context so that I can see the benefit of the proposed approach.

---

## 6. MVP Requirements

### 6.1 Chat companion

**Priority: Must have**

- Text input and send action.
- Message list for user and assistant messages.
- Basic loading state while a response is generated.
- Persistent messages for the current demo user.
- Button to load a prebuilt demo conversation.
- Button to clear/reset demo data.

**Acceptance criteria**

- The user can send a message and receives a generated assistant response.
- The user can run the scripted demo without manually entering all prior messages.

### 6.2 Structured memory extraction

**Priority: Must have**

After each user message, the system extracts at most 1–3 useful memories.

Memory categories:

- `fact`
- `preference`
- `goal`
- `routine`
- `emotion_style`

Memory layers:

- `factual`: identity, preferences, activities, routines, events, relationships, goals.
- `emotional`: mood, recurring emotional context, personality and communication preferences.

**Extraction rules**

- Do not store greetings or trivial one-off statements.
- Prefer durable facts and explicit preferences.
- Mark inferred information distinctly from explicitly stated information.
- Attach a confidence score and an importance score.
- Do not automatically store highly sensitive information in the MVP.

**Acceptance criteria**

- A message such as “I focus better at night with lo-fi music” produces a factual preference/routine memory.
- A message such as “I get anxious before exams; keep me motivated” produces an emotional/style memory.
- Extracted memories are displayed in the UI.

### 6.3 Memory store

**Priority: Must have**

Use local storage, SQLite, Supabase, or JSON persistence. A full graph database is not required.

Each memory must include:

| Field | Description |
|---|---|
| `id` | Unique memory identifier |
| `text` | Human-readable memory statement |
| `category` | Fact, preference, goal, routine, or emotion/style |
| `layer` | Factual or emotional |
| `entities` | Related keywords/entities |
| `importance` | 0–1 relevance for future use |
| `confidence` | 0–1 extraction confidence |
| `source` | Chat, music demo, or social demo |
| `source_type` | Explicit or inferred |
| `created_at` | Creation timestamp |
| `last_used_at` | Latest retrieval timestamp |

**Acceptance criteria**

- Memories remain available after a chat message is sent and across page refreshes if the selected persistence layer supports it.
- The user can delete individual memories.

### 6.4 Relevant-memory retrieval

**Priority: Must have**

For each new user message:

1. Identify its topic, intent, and entities.
2. Compare it with saved memories.
3. Score each candidate memory.
4. Select the top 3–5 relevant memories.
5. Build the assistant prompt using selected memories rather than the full chat history.

Suggested scoring formula:

\[
\text{Retrieval Score} = 0.60S + 0.20I + 0.10R + 0.10E
\]

Where:

- \(S\): semantic or keyword similarity.
- \(I\): memory importance.
- \(R\): recency.
- \(E\): emotional/style relevance.

The implementation may use keyword overlap for speed or embeddings if the team already has them ready.

**Acceptance criteria**

- On “I’m anxious about studying tonight,” the system retrieves exam, night-study, lo-fi preference, and anxiety/style memories.
- Unrelated memories are excluded.
- The UI shows relevance scores or a readable selection reason.

### 6.5 Personalized response generation

**Priority: Must have**

The generation prompt must contain:

- The current user message.
- The selected structured memories.
- A short recent conversation window, if needed.
- Instructions to avoid inventing personal facts.
- Instructions to use a warm, helpful tone matching stored style preferences.

**Acceptance criteria**

- The answer refers naturally to relevant stored context.
- The assistant does not claim memories that were not present in the selected context.
- The response style reflects a saved preference when available.

### 6.6 Explainability panel

**Priority: Must have**

After every assistant response, display:

- The selected memory cards.
- Memory source and layer.
- Relevance score or simple relevance label.
- A brief explanation of why each memory was chosen.
- Optional excluded-memory example to show filtering.

Example UI text:

```text
Why this reply is personalized

Used memories
• ML exam is on Friday — 96% relevant
• User studies at night with lo-fi music — 89% relevant
• User feels anxious before exams — 93% relevant
• User prefers concise motivation — 85% relevant

Reason: The current message mentions studying tonight and anxiety.
```

**Acceptance criteria**

- Every generated response has visible evidence of the memory context used.
- A judge can tell factual and emotional memories apart.

### 6.7 Music context enrichment

**Priority: Should have**

Provide a button such as **Load Music Profile**. It loads mock listening-history data rather than a live external integration.

Example demo data:

```json
{
  "recently_played": ["Lo-fi Beats", "Deep Focus", "Ambient Study"],
  "top_genres": ["Lo-fi", "Ambient", "Indie"],
  "context": "Frequently listens to calming music during evening study hours."
}
```

Derived memory:

> User frequently listens to lo-fi and ambient music during evening study sessions.

**Acceptance criteria**

- Loading the profile creates at least one music-sourced memory.
- The source is clearly marked as `music_demo`.

### 6.8 Social context enrichment

**Priority: Should have**

Provide a button such as **Load Social Context**. It loads sample, opt-in demo posts or user-provided snippets.

Example demo data:

```json
[
  "Preparing hard for my ML exam this week!",
  "Late-night study session with coffee.",
  "Really enjoying lo-fi playlists lately."
]
```

Derived memories may include:

- User is preparing for a machine-learning exam.
- User has a late-night study routine.
- User enjoys lo-fi playlists.

**Acceptance criteria**

- Imported social context is visible as demo data.
- Each derived memory indicates `social_demo` as its source.
- The user can remove imported demo memories.

### 6.9 Performance comparison

**Priority: Must have**

Create a simple dashboard comparing the current conversation’s full-history context with selected-memory context.

Display:

| Metric | Naive full history | Structured memory retrieval |
|---|---:|---:|
| Context items | All chat messages | Top 3–5 memories |
| Approximate words/tokens | Calculated at runtime | Calculated at runtime |
| Relevant context | Mixed with unrelated content | Focused selected memories |
| Explainability | Low | High |

Calculate demonstrable context reduction:

\[
\text{Context Reduction (\%)} = \left(1 - \frac{\text{selected-memory words}}{\text{full-history words}}\right) \times 100
\]

**Acceptance criteria**

- The dashboard uses actual counts from the current demo session.
- It does not claim benchmark-quality scientific performance.
- It visibly demonstrates a smaller structured-memory context.

---

## 7. Demo Flow

### Scripted flow

1. Open Memora and select **Load Demo Conversation**.
2. Show the saved memories, including factual and emotional layers.
3. Load mock music and social context.
4. Ask: “I’m anxious about studying tonight. What should I do?”
5. Show the personalized answer.
6. Open the explainability panel and show the 3–5 retrieved memories.
7. Open the performance panel.
8. Compare full transcript word count with selected-memory word count.
9. Delete a memory to demonstrate user control.

### Expected personalized answer

> Since your ML exam is Friday and you usually focus better at night with lo-fi music, begin with one 45-minute study block on your hardest topic. Put on your focus playlist, keep the plan small, and take a 10-minute break after it. You’ve already identified what helps you study—use that routine tonight.

---

## 8. UX and Screens

### Screen 1: Chat companion

- Main chat area.
- Text input and send button.
- Side panel: **Active Personal Context**.
- Buttons: `Load Demo`, `Load Music Profile`, `Load Social Context`, `Reset`.

### Screen 2: Memory dashboard

Each memory card shows:

- Memory statement.
- Category.
- Layer badge: factual or emotional/style.
- Source badge: chat, music demo, social demo.
- Importance and confidence.
- Delete action.

### Screen 3: Response explainability

- Memories selected for the latest response.
- Relevance values or labels.
- Selection reason.
- Optional section: “Not used because unrelated.”

### Screen 4: Evaluation dashboard

- Full history context size.
- Selected memory context size.
- Percentage reduction.
- Count of selected memories.
- Side-by-side comparison cards.

---

## 9. Data Examples

### Example factual memory

```json
{
  "id": "mem_001",
  "text": "User has a machine-learning exam on Friday.",
  "category": "goal",
  "layer": "factual",
  "entities": ["machine learning", "exam", "Friday"],
  "importance": 0.95,
  "confidence": 0.95,
  "source": "chat",
  "source_type": "explicit"
}
```

### Example emotional/style memory

```json
{
  "id": "mem_002",
  "text": "User becomes anxious before exams and prefers concise motivational support.",
  "category": "emotion_style",
  "layer": "emotional",
  "entities": ["exam", "anxiety", "motivation", "concise"],
  "importance": 0.90,
  "confidence": 0.88,
  "source": "chat",
  "source_type": "explicit"
}
```

### Example retrieval response

```json
{
  "query": "I'm anxious about studying tonight.",
  "selected_memory_ids": ["mem_001", "mem_002", "mem_003", "mem_004"],
  "selection_reason": "Memories match the topics studying, tonight, exam anxiety, and preferred support style.",
  "full_history_words": 620,
  "selected_memory_words": 74,
  "context_reduction_percent": 88.06
}
```

---

## 10. LLM Prompts

### Memory extraction prompt

```text
You extract useful, durable user memories from a chat message.

Return JSON only:
{
  "memories": [
    {
      "text": "...",
      "category": "fact | preference | goal | routine | emotion_style",
      "layer": "factual | emotional",
      "entities": ["..."],
      "importance": 0.0,
      "confidence": 0.0,
      "source_type": "explicit | inferred"
    }
  ]
}

Rules:
- Extract at most three memories.
- Ignore greetings, vague remarks, and trivial one-time details.
- Preserve only useful long-term preferences, routines, goals, facts, or emotional/style signals.
- Never fabricate user information.
- Mark inferred memories as inferred.
- Do not extract sensitive personal information unless the user explicitly requests that it be remembered.
```

### Response generation prompt

```text
You are Memora, a supportive personalized AI companion.

Current user message:
{user_message}

Relevant memories selected for this response:
{selected_memories}

Instructions:
- Answer the user’s current request directly.
- Use the listed memories only when relevant.
- Do not claim to remember information that is not listed above.
- Match the user's stored communication preference when available.
- Be warm, concise, and practical.
- Do not present yourself as a therapist, doctor, or emergency service.
```

---

## 11. Technical Approach

### Recommended lightweight stack

| Layer | Recommended option |
|---|---|
| Front end | React + Vite / Next.js, or Streamlit for fastest delivery |
| Styling | Tailwind CSS or basic component library |
| Backend | Node/Express, FastAPI, or Streamlit backend |
| Storage | LocalStorage, SQLite, JSON, or Supabase |
| LLM | Any team-approved LLM API or local model endpoint |
| Retrieval | Keyword overlap first; embeddings if already available |
| Evaluation | Runtime word-count comparison |

### Retrieval approach

For a three-hour MVP, use keyword/entity overlap plus importance and optional recency. Embeddings are optional, not required.

Pseudo-logic:

```text
for every memory:
  similarity = keyword_overlap(query, memory.text + memory.entities)
  score = 0.60 * similarity + 0.20 * importance + 0.10 * recency + 0.10 * emotional_match

select top 3–5 memories by score
```

### Storage approach

Keep one `messages` collection and one `memories` collection. Treat `entities` as lightweight graph-like links; no graph database is needed for the MVP.

---

## 12. Success Metrics

### Demo success metrics

- At least one memory is extracted from a user message.
- At least one factual memory and one emotional/style memory are shown.
- A later question retrieves relevant rather than random memories.
- The response visibly reflects the retrieved context.
- The explainability panel lists each selected memory.
- The performance panel reports real word counts.
- The selected-memory context is materially smaller than full history in the demo.
- The user can delete a memory.

### Suggested presentation metrics

| Metric | Demo target |
|---|---:|
| Memories retrieved per response | 3–5 |
| Structured-memory context reduction | 60%+ in scripted demo |
| Memory provenance coverage | 100% of displayed memories |
| Explainability coverage | 100% of assistant responses |
| User control | Individual deletion enabled |

---

## 13. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| LLM extraction is inconsistent | Use a prepared demo flow and validate JSON before storing |
| Retrieval misses a key memory | Seed clean entities in demo memories; use a keyword fallback |
| External APIs take too long | Use local mock music/social data |
| Voice implementation consumes time | Make text chat the official MVP; describe voice as future work |
| Claims appear black-box | Show sources, scores, selected memories, and selection reasons |
| User trust/privacy concerns | Include visible delete/reset buttons and label imported signals clearly |
| Demo has insufficient chat history | Use a Load Demo Conversation button with 10–20 preloaded turns |

---

## 14. Three-Hour Delivery Plan

### 0–20 minutes: Setup and demo data

- Lock scope to text chat.
- Choose the stack already familiar to the team.
- Prepare one demo persona, 10–20 chat messages, and 6–10 memories.
- Build the initial page layout.

### 20–70 minutes: Core data flow

- Implement chat input/output.
- Add message persistence.
- Add memory extraction or a reliable fallback.
- Store and display structured memories.

### 70–120 minutes: Retrieval and response

- Implement scoring and top-k selection.
- Construct context with selected memories.
- Generate personalized assistant responses.
- Record which memories were used.

### 120–145 minutes: Explainability and evaluation

- Build response explainability panel.
- Build full-history vs. structured-memory cards.
- Calculate context word counts and reduction percentage.

### 145–180 minutes: Polish and rehearsal

- Add mock music/social loaders.
- Add memory deletion.
- Test reset and demo flow.
- Prepare the pitch and record screenshots if needed.

---

## 15. Future Enhancements

These are explicitly not required for the MVP but form a strong roadmap:

- Voice input and expressive text-to-speech.
- Real Spotify or other music-service OAuth integrations.
- Consent-based social platform integrations.
- True knowledge-graph visualization and traversal.
- Embedding/vector search and hybrid retrieval.
- Automatic memory consolidation and aging.
- Contradiction detection and user confirmation.
- Multilingual text and voice support.
- Proactive reminders and goal follow-up.
- Fine-grained privacy settings, data export, and encryption.
- Personalized companion personality and voice settings.

---

## 16. Definition of Done

The MVP is presentation-ready when it can:

- Run a text conversation with a demo user.
- Extract and persist useful structured memories.
- Separate factual and emotional/style memories.
- Load sample music and social-context data.
- Retrieve the top relevant memories for a new user question.
- Generate a personalized response from that selected context.
- Explain exactly which memories were used and why.
- Compare full-history context with structured-memory context using actual runtime counts.
- Allow a user to delete a stored memory.

The final product message is simple: **Memora makes AI companionship persistent and personal while keeping memory retrieval focused, transparent, and efficient.**
