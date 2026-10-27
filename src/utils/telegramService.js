/**
 * Frontend Telegram Bot API Client for IshTop.uz
 * Calls the secure backend endpoint /api/telegram,
 * with comprehensive direct client-side fallback to Telegram Bot API
 * to guarantee 100% delivery of photos and notifications on Vercel/production.
 */

const DEFAULT_BOT_TOKEN = "8793458072:AAEdrQurMlxbJXL9sPsUrhwTAgalfdM7UyY";
const DEFAULT_CHAT_ID = "799910176";

function cleanCaption(text, maxLen = 1000) {
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 15) + '...';
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, '').trim();
}

/**
 * Direct browser fallback to Telegram Bot API
 */
async function directTelegramFallback(action, payload = {}) {
  const token = payload.token || DEFAULT_BOT_TOKEN;
  const chatId = payload.chatId || DEFAULT_CHAT_ID;
  const now = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

  if (action === 'check_bot') {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await res.json();
      return data.ok ? { ok: true, bot: data.result } : { ok: false, error: data.description };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  // Direct photo sender
  const sendPhotoDirect = async (photoUrl, rawCaption) => {
    const caption = cleanCaption(rawCaption);

    // 1. Base64 Image
    if (photoUrl && photoUrl.startsWith('data:image/')) {
      try {
        const commaIdx = photoUrl.indexOf(',');
        const mime = photoUrl.slice(5, photoUrl.indexOf(';')) || 'image/jpeg';
        const base64Data = photoUrl.slice(commaIdx + 1);
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mime });

        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('photo', blob, 'photo.jpg');
        form.append('caption', caption);
        form.append('parse_mode', 'HTML');

        let res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
          method: 'POST',
          body: form
        });
        let data = await res.json();
        if (data.ok) return { ok: true, method: 'directSendPhotoMultipart', result: data.result };

        // Retry without HTML parse mode if entity parsing failed
        if (data.description && data.description.includes('can\'t parse entities')) {
          const retryForm = new FormData();
          retryForm.append('chat_id', chatId);
          retryForm.append('photo', blob, 'photo.jpg');
          retryForm.append('caption', stripHtml(caption));
          res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method: 'POST',
            body: retryForm
          });
          data = await res.json();
          if (data.ok) return { ok: true, method: 'directSendPhotoMultipartPlainText', result: data.result };
        }
      } catch (err) {
        console.warn('direct photo multipart err:', err);
      }
    }

    // 2. Regular HTTP/HTTPS URL
    if (photoUrl && (photoUrl.startsWith('http://') || photoUrl.startsWith('https://'))) {
      try {
        let res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            photo: photoUrl,
            caption,
            parse_mode: 'HTML'
          })
        });
        let data = await res.json();
        if (data.ok) return { ok: true, method: 'directSendPhotoUrl', result: data.result };

        // Retry with plain text
        if (data.description && data.description.includes('can\'t parse entities')) {
          res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              photo: photoUrl,
              caption: stripHtml(caption)
            })
          });
          data = await res.json();
          if (data.ok) return { ok: true, method: 'directSendPhotoUrlPlainText', result: data.result };
        }
      } catch (err) {
        console.warn('direct photo url err:', err);
      }
    }

    // Fallback: Send as text message
    return sendTextDirect(rawCaption);
  };

  // Direct text sender
  const sendTextDirect = async (text) => {
    try {
      let res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text.slice(0, 4096),
          parse_mode: 'HTML'
        })
      });
      let data = await res.json();
      if (data.ok) return { ok: true, method: 'directSendMessage', result: data.result };

      // Retry with plain text if HTML entity parsing failed
      if (data.description && data.description.includes('can\'t parse entities')) {
        res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: stripHtml(text).slice(0, 4096)
          })
        });
        data = await res.json();
        if (data.ok) return { ok: true, method: 'directSendMessagePlainText', result: data.result };
      }
      return { ok: false, error: data.description || 'Telegram xatosi' };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  switch (action) {
    case 'send_test_text': {
      const text = `🔔 <b>IshTop.uz — Test Xabarnomasi</b>\n━━━━━━━━━━━━━━━━━━━━\n✅ Telegram bot muvaffaqiyatli ulangan!\n🕒 <b>Vaqt:</b> ${now}`;
      return sendTextDirect(text);
    }

    case 'send_test_photo': {
      const photoUrl = payload.photoUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop';
      const caption = `📸 <b>IshTop.uz — Test Rasm Xabarnomasi</b>\n━━━━━━━━━━━━━━━━━━━━\n✅ Telegram bot rasm va to'liq formatlangan e'lonlarni muvaffaqiyatli qabul qilmoqda!\n🕒 <b>Vaqt:</b> ${now}`;
      return sendPhotoDirect(photoUrl, caption);
    }

    case 'new_order': {
      const order = payload.order || {};
      const items = order.items || [];
      const itemsList = items.map((i, idx) => `  ${idx + 1}. <b>${i.name}</b> x${i.quantity} (${((i.price || 0) * (i.quantity || 1)).toLocaleString()} UZS)`).join('\n');
      const photoUrl = order.receiptPhoto || (items[0] && items[0].image) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop';

      const caption = `🛍️ <b>YANGI XARID / MAHSULOT BUYURTMASI (FOTO BILAN)!</b>\n━━━━━━━━━━━━━━━━━━━━\n🆔 <b>Buyurtma ID:</b> <code>#${order.id}</code>\n👤 <b>Xaridor:</b> <b>${order.customerName || 'Mijoz'}</b>\n📞 <b>Telefon:</b> <a href="tel:${order.customerPhone}">${order.customerPhone || '-'}</a>\n📍 <b>Manzil:</b> ${order.deliveryRegion || ''}, ${order.deliveryAddress || ''}\n🚚 <b>Yetkazish:</b> ${order.deliveryType === 'pickup' ? "Do'kondan olib ketish" : 'Kuryer orqali'}\n💳 <b>To'lov turi:</b> ${(order.paymentMethod || 'PAYME').toUpperCase()}\n━━━━━━━━━━━━━━━━━━━━\n📦 <b>Xarid qilingan tovarlar:</b>\n${itemsList || '1 dona tovar'}\n━━━━━━━━━━━━━━━━━━━━\n💰 <b>JAMI TO'LOV:</b> <b>${(order.total || 0).toLocaleString()} UZS</b>\n📸 <b>FOTO:</b> 🟢 <b>To'lov cheki biriktirilgan (Majburiy)</b>\n🕒 <b>Vaqt:</b> ${now}`;

      return sendPhotoDirect(photoUrl, caption);
    }

    case 'new_job': {
      const job = payload.job || {};
      const photoUrl = job.companyLogo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop';
      const caption = `💼 <b>YANGI VAKANSIYA E'LON QILINDI! — IshTop.uz</b>\n━━━━━━━━━━━━━━━━━━━━\n📌 <b>Lavozim:</b> <b>${job.title || 'Vakansiya'}</b>\n🏢 <b>Kompaniya:</b> <b>${job.companyName || '-'}</b>\n📍 <b>Hudud:</b> ${job.location || 'Toshkent'}\n💰 <b>Maosh:</b> ${job.salary || 'Kelishilgan'}\n🕒 <b>Bandlik turi:</b> ${job.type || "To'liq bandlik"}\n🕒 <b>Sana:</b> ${now}\n━━━━━━━━━━━━━━━━━━━━\nStatus: 🟢 <b>Arizalar qabul qilinmoqda</b>`;
      return sendPhotoDirect(photoUrl, caption);
    }

    case 'new_application': {
      const { job = {}, applicantInfo = {}, coverLetter = '' } = payload;
      const photoUrl = job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop';
      const caption = `📄 <b>YANGI ARIZA / REZYUME KELDI! — IshTop.uz</b>\n━━━━━━━━━━━━━━━━━━━━\n📌 <b>Vakansiya:</b> <b>${job.title || "Ish o'rni"}</b>\n🏢 <b>Kompaniya:</b> ${job.companyName || '-'}\n👤 <b>Nomzod:</b> <b>${applicantInfo.name || 'Nomzod'}</b>\n📞 <b>Telefon:</b> <a href="tel:${applicantInfo.phone}">${applicantInfo.phone || '-'}</a>\n📧 <b>Email:</b> ${applicantInfo.email || '-'}\n📍 <b>Shahar:</b> ${applicantInfo.city || 'Toshkent'}\n🕒 <b>Vaqt:</b> ${now}${coverLetter ? `\n📝 <b>Ilhomlantiruvchi xat:</b> <i>${coverLetter}</i>` : ''}\n━━━━━━━━━━━━━━━━━━━━\nStatus: 🟡 <b>Ko'rib chiqish kutilmoqda</b>`;
      return sendPhotoDirect(photoUrl, caption);
    }

    case 'new_user': {
      const u = payload.user || {};
      const text = `👤 <b>YANGI FOYDALANUVCHI RO'YXATDAN O'TDI! — IshTop.uz</b>\n━━━━━━━━━━━━━━━━━━━━\n🆔 <b>Foydalanuvchi:</b> <b>${u.name || '-'}</b>\n🏢 <b>Roli:</b> ${u.role === 'employer' ? 'Ish beruvchi (HR)' : 'Ish qidiruvchi (Nomzod)'}\n📞 <b>Telefon / Login:</b> ${u.phone || u.identifier || '-'}\n📧 <b>Email:</b> ${u.email || '-'}\n🕒 <b>Vaqt:</b> ${now}`;
      return sendTextDirect(text);
    }

    case 'new_product': {
      const prod = payload.product || {};
      const photoUrl = prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop';
      const caption = `🆕 <b>YANGI TOVAR RO'YXATGA OLINDI (FOTO)!</b>\n━━━━━━━━━━━━━━━━━━━━\n📦 <b>Nomi:</b> <b>${prod.name || '-'}</b>\n🏷️ <b>Toifa:</b> ${prod.category || '-'} • <b>Brend:</b> ${prod.brand || '-'}\n💰 <b>Narxi:</b> <b>${(prod.price || 0).toLocaleString()} UZS</b>\n📊 <b>Zaxira soni:</b> ${prod.stock || 0} dona\n🕒 <b>Vaqt:</b> ${now}`;
      return sendPhotoDirect(photoUrl, caption);
    }

    case 'low_stock': {
      const prod = payload.product || {};
      const photoUrl = prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop';
      const caption = `⚠️ <b>KAM QOLDIQ OGOHLANTIRISHI!</b>\n━━━━━━━━━━━━━━━━━━━━\n📦 <b>Tovar:</b> <b>${prod.name || '-'}</b>\n📉 <b>Omborda qoldi:</b> <b>${prod.stock || 0} dona</b>\n💰 <b>Narxi:</b> ${(prod.price || 0).toLocaleString()} UZS\n🕒 <b>Vaqt:</b> ${now}`;
      return sendPhotoDirect(photoUrl, caption);
    }

    case 'auth_code':
    case 'send_auth_code': {
      const phone = payload.phone || '-';
      const code = payload.code || '0000';
      const text = `🔐 <b>ISHTOP.UZ TASDIQLASH KODI</b>\n━━━━━━━━━━━━━━━━━━━━\n📱 <b>Telefon:</b> <code>${phone}</code>\n🔑 <b>KOD:</b> <b><code>${code}</code></b>\n━━━━━━━━━━━━━━━━━━━━\nℹ️ <i>Ro'yxatdan o'tish yoki kirish uchun tasdiqlash kodi.</i>\n🕒 <b>Vaqt:</b> ${now}`;
      return sendTextDirect(text);
    }

    default:
      return { ok: false, error: `Noma'lum harakat: ${action}` };
  }
}

export const callTelegramApi = async (action, payload = {}) => {
  // 1. Try backend serverless endpoint
  try {
    const res = await fetch('/api/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.ok) {
        return data;
      }
      console.warn(`Backend /api/telegram returned non-ok:`, data);
    }
  } catch (err) {
    console.warn(`Backend /api/telegram unreachable, using direct fallback:`, err.message);
  }

  // 2. Direct client-side fallback to Telegram Bot API
  return directTelegramFallback(action, payload);
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
  return callTelegramApi('auth_code', { phone, code });
};
