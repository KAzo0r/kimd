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

