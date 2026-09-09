import { Router } from 'express';
import config from '../config.js';
import * as memoryService from '../services/memoryService.js';

const router = Router();

// GET /api/memories?layer=&category=&source=
router.get('/memories', (req, res) => {
  const { layer, category, source } = req.query;
  const memories = memoryService.listByUser(config.demoUserId, { layer, category, source });
  res.json({ memories });
});

router.get('/memories/:id', (req, res) => {
  const memory = memoryService.getById(req.params.id);
  if (!memory) return res.status(404).json({ error: 'Memory not found' });
  res.json({ memory });
});

router.delete('/memories/:id', (req, res) => {
  const ok = memoryService.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Memory not found' });
  res.json({ deleted: true, id: req.params.id });
});

export default router;
