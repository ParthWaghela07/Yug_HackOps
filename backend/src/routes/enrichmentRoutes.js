import { Router } from 'express';
import config from '../config.js';
import * as enrichmentService from '../services/enrichmentService.js';

const router = Router();

router.post('/enrichment/music', (req, res) => {
  const created = enrichmentService.loadMusicProfile(config.demoUserId);
  res.json({ created });
});

router.post('/enrichment/social', (req, res) => {
  const { posts } = req.body || {};
  const created = enrichmentService.loadSocialContext(config.demoUserId, posts);
  res.json({ created });
});

export default router;
