// A 12-turn scripted student-persona conversation used by "Load demo conversation".
// Each entry is a user turn; the pipeline generates the assistant reply live.
export const scriptedTurns = [
  "Hey, I'm Riya, I'm a second-year computer science student.",
  "I live in a small apartment near campus with my roommate Dev.",
  "I study best late at night with lo-fi music playing in the background.",
  "Lately I've been really anxious about my data structures exam next week.",
  "My favorite thing to do when I'm stressed is go for a walk around the lake near my building.",
  "I have a big presentation on Friday and I'm honestly kind of dreading it.",
  "I really love oat milk lattes, they help me focus when I'm cramming.",
  "My mom calls me every Sunday and it always makes me feel calmer.",
  "I get overwhelmed easily when I have more than two deadlines in the same week.",
  "Dev and I are planning to cook dinner together tonight to take a break.",
  "I've been feeling a bit lonely since most of my friends are in different majors this semester.",
  "Music genuinely helps me reset when everything feels like too much.",
];

// Mock enrichment payloads (no real OAuth — per PRD non-goals).
export const mockMusicProfile = {
  topGenres: ['lo-fi', 'indie folk', 'ambient study beats'],
  topArtists: ['Kiasmos', 'Bon Iver', 'Nujabes'],
  recentMood: 'calm, focused, late-night listening patterns',
  listeningContext: 'Plays lo-fi and ambient tracks almost every night between 10pm and 2am, consistent with focused study sessions.',
};

export const mockSocialPosts = [
  "finally finished my data structures assignment at 1am, brain is fried 😩",
  "walk around the lake > any energy drink, change my mind",
  "oat milk latte number 3 today, we are so back",
  "missing my friends from freshman year, everyone's scattered across majors now",
];
