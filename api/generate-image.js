import { generateProductImage } from '../server/telegramBackend.js';

export default async function handler(req, res) {
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
    const { name, category, brand, description } = req.body || {};
    const result = await generateProductImage({ name, category, brand, description });
    return res.status(200).json(result);
  } catch (error) {
    console.error('API /api/generate-image error:', error);
    return res.status(500).json({ ok: false, error: error.message || 'Image generation failed' });
  }
}
