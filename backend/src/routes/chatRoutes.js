import { Router } from 'express';
import config from '../config.js';
import * as chatService from '../services/chatService.js';
import * as messageService from '../services/messageService.js';

const router = Router();

// POST /api/messages { text } — typed (secondary) chat channel
router.post('/messages', async (req, res, next) => {
  try {
    const { text } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'text is required' });
    }
    const result = await chatService.handleTurn({
      userId: config.demoUserId,
      text,
      modality: 'text',
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/messages — full message history
router.get('/messages', (req, res) => {
  res.json({ messages: messageService.listByUser(config.demoUserId) });
});

export default router;
