/**
 * Memora Synthetic Persona Dataset: Dr. Elena Vance
 * Role: Staff AI Research Scientist & Climate Tech Lead (San Francisco, CA)
 * Single persona dataset covering identity, education, career, relationships, health, routine, hobbies, travel, achievements, and future goals.
 */

export const DEMO_PERSONA = {
  name: 'Dr. Elena Vance',
  role: 'Staff AI Research Scientist & Climate Tech Lead',
  location: 'San Francisco, CA',
  organization: 'TerraAI Labs',
  education: 'Ph.D. UC Berkeley (2023), B.S. Stanford University (2019)',
};

export const MOCK_PRESEEDED_MEMORIES = [
  // Factual Layer
  {
    id: 'mem-elena-1',
    layer: 'factual',
    category: 'identity',
    text: 'Full Name: Dr. Elena Vance, 29-year-old AI Climate Research Scientist residing in San Francisco, CA.',
    importance: 0.95,
    confidence: 1.0,
    source_type: 'explicit',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem-elena-2',
    layer: 'factual',
    category: 'education',
    text: 'Earned Ph.D. in AI & Environmental Data Science from UC Berkeley in 2023; B.S. in CS from Stanford (3.94 GPA).',
    importance: 0.9,
    confidence: 0.98,
    source_type: 'explicit',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem-elena-3',
    layer: 'factual',
    category: 'career',
    text: 'Staff AI Research Scientist & Climate Tech Lead at TerraAI Labs; Lead architect on "EcoGraph-1" wildfire model.',
    importance: 0.95,
    confidence: 0.98,
    source_type: 'explicit',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem-elena-4',
    layer: 'factual',
    category: 'relationship',
    text: 'In a 3.5-year relationship with partner Marcus Chen, a Staff Software Engineer at Anthropic.',
    importance: 0.9,
    confidence: 0.95,
    source_type: 'explicit',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem-elena-5',
    layer: 'factual',
    category: 'routine',
    text: 'Runs 5K every Monday, Wednesday, and Friday morning at 6:45 AM before starting deep work focus blocks.',
    importance: 0.85,
    confidence: 0.9,
    source_type: 'explicit',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem-elena-6',
    layer: 'factual',
    category: 'hobby',
    text: 'Plays classical cello in the SF Community Symphony and bakes sourdough bread using a 4-year-old starter.',
    importance: 0.8,
    confidence: 0.88,
    source_type: 'explicit',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem-elena-7',
    layer: 'factual',
    category: 'achievement',
    text: 'Named one of MIT Technology Review 35 Innovators Under 35 (2025) for AI climate models.',
    importance: 0.92,
    confidence: 0.98,
    source_type: 'explicit',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem-elena-8',
    layer: 'factual',
    category: 'goal',
    text: 'Goals: Publish "AI for Planetary Resilience" book by 2027; Qualify for Boston Marathon in 2026 (sub-3:30).',
    importance: 0.9,
    confidence: 0.92,
    source_type: 'explicit',
    createdAt: new Date().toISOString(),
  },

  // Emotional & Style Layer
  {
    id: 'mem-elena-emo-1',
    layer: 'emotional',
    category: 'emotion_style',
    text: 'Prefers concise, highly structured, data-driven answers with clear action items.',
    importance: 0.9,
    confidence: 0.95,
    source_type: 'inferred',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem-elena-emo-2',
    layer: 'emotional',
    category: 'mood',
    text: 'Experiences deadline anxiety before major grant submissions; resets via cello practice and sourdough baking.',
    importance: 0.85,
    confidence: 0.9,
    source_type: 'inferred',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem-elena-emo-3',
    layer: 'emotional',
    category: 'personality',
    text: 'Values intellectual rigor, climate urgency, and mentorship of early-career women engineers.',
    importance: 0.88,
    confidence: 0.92,
    source_type: 'inferred',
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_CONVERSATION_HISTORY = [
  { role: 'user', text: "Hi Memora! I'm Dr. Elena Vance. I lead the climate AI research team at TerraAI Labs here in San Francisco." },
  { role: 'assistant', text: "Welcome Dr. Elena! It's a pleasure to assist you. I'm ready to learn your preferences and help with your climate AI research, schedule, and daily routines." },
  { role: 'user', text: "I finished my PhD at UC Berkeley back in 2023 on ocean graph neural networks, and I usually run 5K every M/W/F morning before starting deep work." },
  { role: 'assistant', text: "That's fantastic! I've noted your Berkeley PhD background and your 5K morning running routine. I'll tailor my recommendations around your focus blocks." },
  { role: 'user', text: "My partner Marcus works at Anthropic, and when I get stressed before major grant deadlines, playing classical cello or baking sourdough helps me reset." },
  { role: 'assistant', text: "Recorded! I'll remember Marcus, your cello playing, sourdough baking, and your preferred way to decompress when grant deadlines get intense." },
  { role: 'user', text: "I'm currently writing a proposal for our open-source EcoGraph-1 model and aiming to qualify for the Boston Marathon next year." },
  { role: 'assistant', text: "Double goals locked in: EcoGraph-1 model proposal and sub-3:30 Boston Marathon qualification! I'm here to support both your technical research and training milestones." }
];

export const MOCK_MUSIC_PROFILE = {
  source: 'music_demo',
  topGenres: ['Classical Cello', 'Ambient Ambient Focus', 'Post-Rock'],
  topArtists: ['Yo-Yo Ma', 'Kiasmos', 'Max Richter'],
  listeningContext: 'Plays classical cello suites and ambient focus beats during late-night paper writing sessions',
};

export const MOCK_SOCIAL_POSTS = [
  ' Thrilled to announce our EcoGraph-1 wildfire neural model is now open-source! Check out the PyTorch repo',
  ' 7 AM morning 5K done in 23:45 🏃‍♀️ Boston Marathon 2026 qualifier training is officially underway',
  ' Saturday morning sourdough ritual: Yeasty Boy (our 4yo starter) delivered the best crust yet 🥖',
  ' Grateful to be named in MIT Tech Review 35 Under 35! Huge shoutout to my amazing team at TerraAI Labs',
];
