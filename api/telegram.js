import { handleTelegramAction } from '../server/telegramBackend.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { action, payload } = req.body || {};
    if (!action) {
      return res.status(400).json({ ok: false, error: 'Action parameter is required' });
    }

    const result = await handleTelegramAction(action, payload);
    return res.status(result.ok ? 200 : 400).json(result);
  } catch (error) {
    console.error('API /api/telegram error:', error);
    return res.status(500).json({ ok: false, error: error.message || 'Internal server error' });
  }
}
