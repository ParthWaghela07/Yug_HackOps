import crypto from 'crypto';

function readableId(prefix) {
  const stamp = Date.now().toString(36);
  const rand = crypto.randomBytes(4).toString('hex');
  return `${prefix}_${stamp}${rand}`;
}

export const newMemoryId = () => readableId('mem');
export const newMessageId = () => readableId('msg');
export const newEvaluationId = () => readableId('eval');
export const newId = (prefix = 'id') => readableId(prefix);
