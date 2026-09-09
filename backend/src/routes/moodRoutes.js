import { Router } from 'express';
import * as spotifyService from '../services/spotifyService.js';

const router = Router();

// POST /api/mood-music { mood: "focused" | "calm" | "happy" | ... }
router.post('/mood-music', async (req, res, next) => {
  try {
    const { mood } = req.body || {};
    if (!mood || typeof mood !== 'string' || !mood.trim()) {
      return res.status(400).json({ error: 'mood is required (string)' });
    }

    const result = await spotifyService.getTracksByMood(mood.trim());
    res.json(result);
  } catch (err) {
    console.error('[moodRoutes] Error fetching mood music:', err);
    res.status(500).json({ error: 'Failed to fetch Spotify mood recommendations' });
  }
});

export default router;
