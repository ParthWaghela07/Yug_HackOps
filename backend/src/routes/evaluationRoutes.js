import { Router } from 'express';
import config from '../config.js';
import * as evaluationService from '../services/evaluationService.js';

const router = Router();

router.get('/evaluation/latest', (req, res) => {
  res.json({ evaluation: evaluationService.getLatest(config.demoUserId) });
});

router.get('/evaluation', (req, res) => {
  const { query } = req.query;
  res.json({ evaluations: evaluationService.queryEvaluations(config.demoUserId, query) });
});

export default router;
