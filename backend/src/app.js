import express from 'express';
import cors from 'cors';
import config from './config.js';
import chatRoutes from './routes/chatRoutes.js';
import memoryRoutes from './routes/memoryRoutes.js';
import enrichmentRoutes from './routes/enrichmentRoutes.js';
import demoRoutes from './routes/demoRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import voiceRoutes from './routes/voiceRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }));
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (req, res) => res.json({ ok: true }));

  app.use('/api', chatRoutes);
  app.use('/api', memoryRoutes);
  app.use('/api', enrichmentRoutes);
  app.use('/api', demoRoutes);
  app.use('/api', evaluationRoutes);
  app.use('/api', voiceRoutes);
  app.use('/api', moodRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
