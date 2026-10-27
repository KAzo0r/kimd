/**
 * Frontend Telegram Bot API Client for IshTop.uz
 * Calls the secure backend endpoint /api/telegram.
 */

export const callTelegramApi = async (action, payload = {}) => {
  try {
    const res = await fetch('/api/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Telegram API client error on action '${action}':`, err);
    return { ok: false, error: err.message || 'Tarmoq xatosi' };
  }
};

export const checkBotConnection = async (credentials = {}) => {
  return callTelegramApi('check_bot', credentials);
};

export const sendTestTextMessage = async (credentials = {}) => {
  return callTelegramApi('send_test_text', credentials);
};

export const sendTestPhotoMessage = async (photoUrl, credentials = {}) => {
  return callTelegramApi('send_test_photo', { photoUrl, ...credentials });
};

export const notifyNewVacancy = async (job, credentials = {}) => {
  return callTelegramApi('new_job', { job, ...credentials });
};

export const notifyNewApplication = async ({ job, applicantInfo, coverLetter }, credentials = {}) => {
  return callTelegramApi('new_application', { job, applicantInfo, coverLetter, ...credentials });
};

export const notifyNewUser = async (user, credentials = {}) => {
  return callTelegramApi('new_user', { user, ...credentials });
};

export const notifyNewOrder = async (order, credentials = {}) => {
  return callTelegramApi('new_order', { order, ...credentials });
};

export const notifyNewProduct = async (product, credentials = {}) => {
  return callTelegramApi('new_product', { product, ...credentials });
};

export const notifyProductUpdate = async (product, credentials = {}) => {
  return callTelegramApi('product_update', { product, ...credentials });
};

export const notifyLowStock = async (product, credentials = {}) => {
  return callTelegramApi('low_stock', { product, ...credentials });
};

export const notifyCustomerRegister = async (customer, credentials = {}) => {
  return callTelegramApi('customer_register', { customer, ...credentials });
};

export const sendTelegramAuthCode = async (phone, code) => {
  // First attempt via backend
  const apiRes = await callTelegramApi('auth_code', { phone, code });
  if (apiRes && apiRes.ok) return apiRes;

  // Direct bot fallback for reliable delivery
  try {
    const BOT_TOKEN = "8793458072:AAEdrQurMlxbJXL9sPsUrhwTAgalfdM7UyY";
    const CHAT_ID = "799910176";
    const text = `🔐 <b>ISHTOP.UZ TASDIQLASH KODI</b>\n━━━━━━━━━━━━━━━━━━━━\n📱 <b>Telefon:</b> <code>${phone}</code>\n🔑 <b>KOD:</b> <b><code>${code}</code></b>\n━━━━━━━━━━━━━━━━━━━━\nℹ️ <i>Ro'yxatdan o'tish yoki kirish uchun tasdiqlash kodi.</i>`;

    const directRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML'
      })
    });
    const data = await directRes.json();
    return data;
  } catch (err) {
    console.warn('Direct telegram fallback err:', err);
    return { ok: false, error: err.message };
  }
};

