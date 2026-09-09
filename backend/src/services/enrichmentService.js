import * as memoryService from './memoryService.js';
import { mockMusicProfile, mockSocialPosts } from '../db/demoData.js';

export function loadMusicProfile(userId) {
  const candidates = [
    {
      layer: 'factual',
      category: 'preference',
      text: `Top genres: ${mockMusicProfile.topGenres.join(', ')}`,
      importance: 0.6,
      confidence: 0.9,
      source_type: 'explicit',
    },
    {
      layer: 'factual',
      category: 'preference',
      text: `Favorite artists include ${mockMusicProfile.topArtists.join(', ')}`,
      importance: 0.5,
      confidence: 0.9,
      source_type: 'explicit',
    },
    {
      layer: 'emotional',
      category: 'routine',
      text: mockMusicProfile.listeningContext,
      importance: 0.55,
      confidence: 0.7,
      source_type: 'inferred',
    },
  ];
  return memoryService.upsertMany(userId, candidates, 'music_demo');
}

export function loadSocialContext(userId, posts = mockSocialPosts) {
  const candidates = posts.slice(0, 4).map((post) => ({
    layer: /😩|tired|missing|lonely/i.test(post) ? 'emotional' : 'factual',
    category: 'social',
    text: `Recently posted: "${post}"`,
    importance: 0.45,
    confidence: 0.6,
    source_type: 'inferred',
  }));
  return memoryService.upsertMany(userId, candidates, 'social_demo');
}

export default { loadMusicProfile, loadSocialContext };
