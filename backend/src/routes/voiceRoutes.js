import { Router } from 'express';
import multer from 'multer';
import config from '../config.js';
import * as sttService from '../services/sttService.js';
import * as ttsService from '../services/ttsService.js';
import * as chatService from '../services/chatService.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

const router = Router();

// POST /api/voice/message  (multipart, field "audio")
// Primary voice channel: transcribe -> run the full chat pipeline -> synthesize the reply.
router.post('/voice/message', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'audio file (field "audio") is required' });

    const transcript = await sttService.transcribe(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname || 'recording.webm'
    );

    if (!transcript) {
      return res.status(422).json({ error: "Couldn't hear anything in that recording — try again?" });
    }

    const result = await chatService.handleTurn({
      userId: config.demoUserId,
      text: transcript,
      modality: 'voice',
    });

    res.json({ transcript, ...result });
  } catch (err) {
    next(err);
  }
});

// POST /api/voice/transcribe (multipart, field "audio") — STT only, no chat turn.
router.post('/voice/transcribe', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'audio file (field "audio") is required' });
    const text = await sttService.transcribe(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname || 'recording.webm'
    );
    res.json({ text });
  } catch (err) {
    next(err);
  }
});

// POST /api/voice/tts { text } — synthesize arbitrary text (e.g. replay a past message).
router.post('/voice/tts', async (req, res, next) => {
  try {
    const { text } = req.body || {};
    if (!text || !text.trim()) return res.status(400).json({ error: 'text is required' });
    const { buffer, mime } = await ttsService.synthesize(text);
    res.json({ audioBase64: buffer.toString('base64'), mime });
  } catch (err) {
    next(err);
  }
});

// GET /api/voice/status — lets the frontend know which voice features are live.
router.get('/voice/status', (req, res) => {
  res.json({
    sttAvailable: sttService.isConfigured(),
    ttsAvailable: ttsService.isConfigured(),
  });
});

export default router;
