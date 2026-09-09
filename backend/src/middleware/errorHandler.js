export function notFoundHandler(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error('[error]', err);

  if (err?.name === 'LLMNotConfiguredError' || err?.name === 'STTNotConfiguredError' || err?.name === 'TTSNotConfiguredError') {
    return res.status(503).json({ error: err.message, code: err.name });
  }

  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Audio file too large (max 15MB)' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
}
