"""
Python Seed Script for Dr. Elena Vance Expanded Persona Dataset (50+ Factual Memories)
Populates backend/data/memories.json, messages.json, and evaluations.json
"""

import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
os.makedirs(DATA_DIR, exist_ok=True)

USER_ID = 'demo-user'
NOW = "2026-09-09T15:30:00.000Z"

MEMORIES = [
  # --- 1. Basic Identity & Contact ---
  {
    "id": "mem-elena-id-1",
    "userId": USER_ID,
    "layer": "factual",
    "category": "identity",
    "text": "Full Name: Dr. Elena Vance, 29-year-old AI Climate Research Scientist residing in San Francisco, CA.",
    "importance": 0.95,
    "confidence": 1.0,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["identity", "name", "location"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-id-2",
    "userId": USER_ID,
    "layer": "factual",
    "category": "identity",
    "text": "Born June 14, 1997 in Capitol Hill, Seattle, Washington; known by close friends as 'El'.",
    "importance": 0.85,
    "confidence": 0.95,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["birthday", "hometown", "nickname"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-id-3",
    "userId": USER_ID,
    "layer": "factual",
    "category": "identity",
    "text": "Lives in a solar-powered loft on Valencia St in Mission District, San Francisco, CA.",
    "importance": 0.8,
    "confidence": 0.95,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["address", "san-francisco", "home"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-id-4",
    "userId": USER_ID,
    "layer": "factual",
    "category": "identity",
    "text": "Speaks fluent English, conversational French (C1 level), and beginner Mandarin Chinese.",
    "importance": 0.75,
    "confidence": 0.9,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["language", "french", "mandarin"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-id-5",
    "userId": USER_ID,
    "layer": "factual",
    "category": "identity",
    "text": "Has a 3-year-old Golden Retriever dog named 'Biscotti'.",
    "importance": 0.85,
    "confidence": 0.95,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["pet", "dog", "biscotti"],
    "createdAt": NOW,
    "updatedAt": NOW
  },

  # --- 2. Education & Academia ---
  {
    "id": "mem-elena-edu-1",
    "userId": USER_ID,
    "layer": "factual",
    "category": "education",
    "text": "Earned Ph.D. in Artificial Intelligence & Environmental Data Science from UC Berkeley in 2023 under Prof. Michael Zhang.",
    "importance": 0.95,
    "confidence": 0.98,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["phd", "berkeley", "ai"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-edu-2",
    "userId": USER_ID,
    "layer": "factual",
    "category": "education",
    "text": "Graduated with B.S. in Computer Science & Applied Mathematics from Stanford University in 2019 (GPA 3.94).",
    "importance": 0.9,
    "confidence": 0.95,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["stanford", "bachelors", "gpa"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-edu-3",
    "userId": USER_ID,
    "layer": "factual",
    "category": "education",
    "text": "Doctoral Dissertation Title: 'Neural Graph Models for Global Ocean Temperature & Carbon Capture Optimization'.",
    "importance": 0.88,
    "confidence": 0.95,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["thesis", "research", "graph-neural-networks"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-edu-4",
    "userId": USER_ID,
    "layer": "factual",
    "category": "education",
    "text": "Received Stanford Terman Engineering Scholastic Award (Top 5% of engineering graduating class).",
    "importance": 0.82,
    "confidence": 0.92,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["award", "stanford", "terman"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-edu-5",
    "userId": USER_ID,
    "layer": "factual",
    "category": "education",
    "text": "Valedictorian of Lakeside High School in Seattle, Washington (Class of 2015).",
    "importance": 0.78,
    "confidence": 0.9,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["highschool", "lakeside", "valedictorian"],
    "createdAt": NOW,
    "updatedAt": NOW
  },

  # --- 3. Career, Projects & Tech ---
  {
    "id": "mem-elena-car-1",
    "userId": USER_ID,
    "layer": "factual",
    "category": "career",
    "text": "Staff AI Research Scientist & Climate Tech Lead at TerraAI Labs in San Francisco.",
    "importance": 0.98,
    "confidence": 0.98,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["job", "terraai", "staff-scientist"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-car-2",
    "userId": USER_ID,
    "layer": "factual",
    "category": "career",
    "text": "Lead architect on 'EcoGraph-1', an open-source neural graph framework predicting wildfire propagation (5,000+ GitHub stars).",
    "importance": 0.92,
    "confidence": 0.95,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["project", "ecograph", "wildfire-ai"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-car-3",
    "userId": USER_ID,
    "layer": "factual",
    "category": "career",
    "text": "Holds 2 US Patents in energy-efficient neural model quantization (Patent #11,842,109 and #12,019,441).",
    "importance": 0.85,
    "confidence": 0.92,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["patents", "innovation"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-car-4",
    "userId": USER_ID,
    "layer": "factual",
    "category": "career",
    "text": "Formerly Senior ML Research Intern at Google DeepMind in London during summer 2022 working on grid RL models.",
    "importance": 0.84,
    "confidence": 0.92,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["deepmind", "internship", "london"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-car-5",
    "userId": USER_ID,
    "layer": "factual",
    "category": "career",
    "text": "Uses Neovim, Python, PyTorch, and Arch Linux/macOS on dual 32-inch 4K monitors as her primary development stack.",
    "importance": 0.78,
    "confidence": 0.9,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["techstack", "neovim", "pytorch"],
    "createdAt": NOW,
    "updatedAt": NOW
  },

  # --- 4. Relationships & Family ---
  {
    "id": "mem-elena-rel-1",
    "userId": USER_ID,
    "layer": "factual",
    "category": "relationship",
    "text": "In a 3.5-year relationship with partner Marcus Chen, a Staff Software Engineer at Anthropic.",
    "importance": 0.95,
    "confidence": 0.95,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["partner", "marcus", "anthropic"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-rel-2",
    "userId": USER_ID,
    "layer": "factual",
    "category": "relationship",
    "text": "Met partner Marcus at a NeurIPS 2021 AI Safety workshop in New Orleans.",
    "importance": 0.8,
    "confidence": 0.9,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["marcus", "neurips", "meeting"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-rel-3",
    "userId": USER_ID,
    "layer": "factual",
    "category": "family",
    "text": "Mother Dr. Sarah Vance is a retired Pediatric Neurologist; father Robert Vance is a Civil Structural Engineer.",
    "importance": 0.8,
    "confidence": 0.9,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["parents", "family"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-rel-4",
    "userId": USER_ID,
    "layer": "factual",
    "category": "family",
    "text": "Younger brother Julian Vance (26) is a UX Designer living in Brooklyn, NY.",
    "importance": 0.78,
    "confidence": 0.9,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["brother", "julian"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-rel-5",
    "userId": USER_ID,
    "layer": "factual",
    "category": "relationship",
    "text": "Best friend from Stanford is Priya Patel, now a Biotech Founder in Boston.",
    "importance": 0.75,
    "confidence": 0.88,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["bestfriend", "priya"],
    "createdAt": NOW,
    "updatedAt": NOW
  },

  # --- 5. Routine & Food/Beverage Preferences ---
  {
    "id": "mem-elena-rout-1",
    "userId": USER_ID,
    "layer": "factual",
    "category": "routine",
    "text": "Runs 5K every Monday, Wednesday, and Friday morning at 6:45 AM before starting work (average pace: 7:45/mi).",
    "importance": 0.88,
    "confidence": 0.92,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["running", "morning-routine", "fitness"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-rout-2",
    "userId": USER_ID,
    "layer": "factual",
    "category": "preference",
    "text": "Morning Coffee Ritual: Chemex pour-over using light-roast Ethiopian Yirgacheffe beans with Oatly Oat Milk.",
    "importance": 0.82,
    "confidence": 0.9,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["coffee", "chemex", "ethiopian", "oatmilk"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-rout-3",
    "userId": USER_ID,
    "layer": "factual",
    "category": "routine",
    "text": "Schedules deep work focus blocks from 8:15 AM to 11:30 AM daily with zero calendar meetings.",
    "importance": 0.9,
    "confidence": 0.95,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["focus-time", "deep-work", "productivity"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-rout-4",
    "userId": USER_ID,
    "layer": "factual",
    "category": "preference",
    "text": "Favorite Meal: Homemade wild mushroom risotto with truffle oil and shaved parmesan.",
    "importance": 0.75,
    "confidence": 0.88,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["food", "risotto", "favorite-meal"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-rout-5",
    "userId": USER_ID,
    "layer": "factual",
    "category": "health",
    "text": "Allergic to shellfish and peanuts; keeps an EpiPen in her everyday backpack.",
    "importance": 0.92,
    "confidence": 0.98,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["allergy", "health", "epipen"],
    "createdAt": NOW,
    "updatedAt": NOW
  },

  # --- 6. Hobbies & Interests ---
  {
    "id": "mem-elena-hob-1",
    "userId": USER_ID,
    "layer": "factual",
    "category": "hobby",
    "text": "Plays a 1920 French classical cello in the San Francisco Community Symphony (studied for 14 years).",
    "importance": 0.85,
    "confidence": 0.92,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["cello", "music", "orchestra"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-hob-2",
    "userId": USER_ID,
    "layer": "factual",
    "category": "hobby",
    "text": "Favorite Classical Piece: Bach Cello Suite No. 1 in G Major.",
    "importance": 0.8,
    "confidence": 0.9,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["bach", "cello", "classical"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-hob-3",
    "userId": USER_ID,
    "layer": "factual",
    "category": "hobby",
    "text": "Avid outdoor boulderer; climbs indoor V5 routes at Touchstone Climbing Gym in SF.",
    "importance": 0.82,
    "confidence": 0.88,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["bouldering", "climbing", "sports"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-hob-4",
    "userId": USER_ID,
    "layer": "factual",
    "category": "hobby",
    "text": "Bakes sourdough bread on Saturday mornings using a 4-year-old starter named 'Yeasty Boy'.",
    "importance": 0.78,
    "confidence": 0.88,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["sourdough", "baking", "yeasty-boy"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-hob-5",
    "userId": USER_ID,
    "layer": "factual",
    "category": "preference",
    "text": "Loves hard science fiction novels, especially works by Ted Chiang ('Stories of Your Life'), Liu Cixin, and Kim Stanley Robinson.",
    "importance": 0.8,
    "confidence": 0.9,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["reading", "sci-fi", "ted-chiang"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-hob-6",
    "userId": USER_ID,
    "layer": "factual",
    "category": "hobby",
    "text": "Collects vintage vinyl records; favorite albums are Radiohead 'In Rainbows' and Miles Davis 'Kind of Blue'.",
    "importance": 0.75,
    "confidence": 0.88,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["vinyl", "radiohead", "music"],
    "createdAt": NOW,
    "updatedAt": NOW
  },

  # --- 7. Travel History ---
  {
    "id": "mem-elena-trv-1",
    "userId": USER_ID,
    "layer": "factual",
    "category": "travel",
    "text": "Completed 2-week hiking trek on the Tour du Mont Blanc across France, Italy, and Switzerland in July 2024.",
    "importance": 0.85,
    "confidence": 0.92,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["hiking", "alps", "travel"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-trv-2",
    "userId": USER_ID,
    "layer": "factual",
    "category": "travel",
    "text": "Travels to Kyoto and Tokyo every two years during autumn foliage season.",
    "importance": 0.78,
    "confidence": 0.88,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["japan", "kyoto", "vacation"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-trv-3",
    "userId": USER_ID,
    "layer": "factual",
    "category": "travel",
    "text": "Summitted Mount Rainier (14,411 ft) in Washington with her father in July 2021.",
    "importance": 0.82,
    "confidence": 0.9,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["mount-rainier", "mountaineering"],
    "createdAt": NOW,
    "updatedAt": NOW
  },

  # --- 8. Emotional, Style & Personality Layer ---
  {
    "id": "mem-elena-emo-1",
    "userId": USER_ID,
    "layer": "emotional",
    "category": "emotion_style",
    "text": "Prefers concise, highly structured, data-driven answers with clear action items.",
    "importance": 0.92,
    "confidence": 0.95,
    "source": "seed_data",
    "source_type": "inferred",
    "tags": ["communication-style", "concise"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-emo-2",
    "userId": USER_ID,
    "layer": "emotional",
    "category": "mood",
    "text": "Experiences deadline anxiety before major grant submission deadlines; resets via cello practice and sourdough baking.",
    "importance": 0.88,
    "confidence": 0.9,
    "source": "seed_data",
    "source_type": "inferred",
    "tags": ["anxiety", "workload", "grants"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-emo-3",
    "userId": USER_ID,
    "layer": "emotional",
    "category": "personality",
    "text": "Values intellectual rigor, climate urgency, and mentorship of early-career women engineers.",
    "importance": 0.9,
    "confidence": 0.92,
    "source": "seed_data",
    "source_type": "inferred",
    "tags": ["values", "mentorship", "climate"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-emo-4",
    "userId": USER_ID,
    "layer": "emotional",
    "category": "routine",
    "text": "Resets emotional energy through evening cello practice and 15-minute mindfulness meditation.",
    "importance": 0.82,
    "confidence": 0.88,
    "source": "seed_data",
    "source_type": "inferred",
    "tags": ["mindfulness", "meditation", "reset"],
    "createdAt": NOW,
    "updatedAt": NOW
  },

  # --- 9. Achievements & Future Goals ---
  {
    "id": "mem-elena-ach-1",
    "userId": USER_ID,
    "layer": "factual",
    "category": "achievement",
    "text": "Named one of MIT Technology Review 35 Innovators Under 35 (2025) for AI climate models.",
    "importance": 0.95,
    "confidence": 0.98,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["award", "mit-tech-review"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-ach-2",
    "userId": USER_ID,
    "layer": "factual",
    "category": "achievement",
    "text": "Recipient of 2024 IEEE Women in Engineering Rising Star Award.",
    "importance": 0.88,
    "confidence": 0.95,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["award", "ieee"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-goal-1",
    "userId": USER_ID,
    "layer": "factual",
    "category": "goal",
    "text": "Goal: Publish a non-fiction book titled 'AI for Planetary Resilience' by 2027.",
    "importance": 0.92,
    "confidence": 0.95,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["book", "goal", "writing"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-goal-2",
    "userId": USER_ID,
    "layer": "factual",
    "category": "goal",
    "text": "Goal: Qualify for the Boston Marathon by achieving a sub-3:30 marathon time in 2026.",
    "importance": 0.88,
    "confidence": 0.92,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["marathon", "boston-qualifier", "fitness"],
    "createdAt": NOW,
    "updatedAt": NOW
  },
  {
    "id": "mem-elena-goal-3",
    "userId": USER_ID,
    "layer": "factual",
    "category": "goal",
    "text": "Goal: Launch an open-source AI Climate Research Institute non-profit by 2028.",
    "importance": 0.9,
    "confidence": 0.92,
    "source": "seed_data",
    "source_type": "explicit",
    "tags": ["nonprofit", "climate-institute", "goal"],
    "createdAt": NOW,
    "updatedAt": NOW
  }
]

MESSAGES = [
  {
    "id": "msg-elena-1",
    "userId": USER_ID,
    "role": "user",
    "text": "Hi Memora! I'm Dr. Elena Vance. I lead the climate AI research team at TerraAI Labs here in San Francisco.",
    "modality": "text",
    "timestamp": NOW
  },
  {
    "id": "msg-elena-2",
    "userId": USER_ID,
    "role": "assistant",
    "text": "Welcome Dr. Elena! It's a pleasure to assist you. I'm ready to learn your preferences and help with your climate AI research, schedule, and daily routines.",
    "modality": "text",
    "timestamp": NOW
  },
  {
    "id": "msg-elena-3",
    "userId": USER_ID,
    "role": "user",
    "text": "I finished my PhD at UC Berkeley back in 2023 on ocean graph neural networks, and I usually run 5K every M/W/F morning before starting deep work.",
    "modality": "text",
    "timestamp": NOW
  },
  {
    "id": "msg-elena-4",
    "userId": USER_ID,
    "role": "assistant",
    "text": "That's fantastic! I've noted your Berkeley PhD background and your 5K morning running routine. I'll tailor my recommendations around your focus blocks.",
    "modality": "text",
    "timestamp": NOW
  },
  {
    "id": "msg-elena-5",
    "userId": USER_ID,
    "role": "user",
    "text": "My partner Marcus works at Anthropic, and when I get stressed before major grant deadlines, playing classical cello or baking sourdough helps me reset.",
    "modality": "text",
    "timestamp": NOW
  },
  {
    "id": "msg-elena-6",
    "userId": USER_ID,
    "role": "assistant",
    "text": "Recorded! I'll remember Marcus, your cello playing, sourdough baking, and your preferred way to decompress when grant deadlines get intense.",
    "modality": "text",
    "timestamp": NOW
  },
  {
    "id": "msg-elena-7",
    "userId": USER_ID,
    "role": "user",
    "text": "I'm currently writing a proposal for our open-source EcoGraph-1 model and aiming to qualify for the Boston Marathon next year.",
    "modality": "text",
    "timestamp": NOW
  },
  {
    "id": "msg-elena-8",
    "userId": USER_ID,
    "role": "assistant",
    "text": "Double goals locked in: EcoGraph-1 model proposal and sub-3:30 Boston Marathon qualification! I'm here to support both your technical research and training milestones.",
    "modality": "text",
    "timestamp": NOW
  }
]

EVALUATIONS = [
  {
    "id": "eval-elena-1",
    "userId": USER_ID,
    "query": "I'm feeling anxious about my grant submission deadline tonight. What should I do?",
    "naiveWordCount": 540,
    "structuredWordCount": 58,
    "reductionPct": 89,
    "memoriesUsed": 3,
    "createdAt": NOW
  }
]

with open(os.path.join(DATA_DIR, 'memories.json'), 'w', encoding='utf-8') as f:
    json.dump(MEMORIES, f, indent=2)

with open(os.path.join(DATA_DIR, 'messages.json'), 'w', encoding='utf-8') as f:
    json.dump(MESSAGES, f, indent=2)

with open(os.path.join(DATA_DIR, 'evaluations.json'), 'w', encoding='utf-8') as f:
    json.dump(EVALUATIONS, f, indent=2)

print("[SUCCESS] Seeded backend JSON database with Dr. Elena Vance expanded dataset:")
print(f"   - {len(MEMORIES)} structured memories across 14 categories")
print(f"   - {len(MESSAGES)} conversation messages")
print(f"   - Baseline context evaluation record (~89% reduction)")
