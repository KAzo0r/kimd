import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleTelegramAction } from './server/telegramBackend.js';

// Helper to parse JSON body from incoming HTTP request in Vite dev middleware
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function backendApiPlugin() {
  return {
    name: 'backend-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url === '/api/telegram' && req.method === 'POST') {
          try {
            const body = await parseJsonBody(req);
            const { action, payload } = body;
            const result = await handleTelegramAction(action, payload);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = result.ok ? 200 : 400;
            res.end(JSON.stringify(result));
          } catch (err) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: err.message }));
          }
          return;
        }


        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env so backend functions have access to TELEGRAM_BOT_TOKEN
  process.env.TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '';
  process.env.TELEGRAM_ADMIN_CHAT_ID = env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID || '';

  return {
    plugins: [react(), backendApiPlugin()],
  };
});
