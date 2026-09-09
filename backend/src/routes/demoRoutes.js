import { Router } from 'express';
import config from '../config.js';
import * as demoService from '../services/demoService.js';

const router = Router();

router.post('/demo/load', async (req, res, next) => {
  try {
    const turns = await demoService.loadDemoConversation(config.demoUserId);
    res.json({ turns });
  } catch (err) {
    next(err);
  }
});

router.post('/demo/reset', (req, res) => {
  demoService.resetAll(config.demoUserId);
  res.json({ reset: true });
});

export default router;
