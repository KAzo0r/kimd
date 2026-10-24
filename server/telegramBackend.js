/**
 * Server-side Telegram Bot Controller for IshTop.uz
 * Bot username: @apexishqidirish_bot
 * Bot tokens and credentials are kept strictly secure on backend.
 */

function getEnvConfig(body = {}) {
  const token = body.token || process.env.TELEGRAM_BOT_TOKEN || '';
  const chatId = body.chatId || process.env.TELEGRAM_ADMIN_CHAT_ID || '';
  return { token: token.trim(), chatId: chatId.trim() };
}

// Check bot status via getMe
export async function checkBotStatus(tokenOverride) {
  const token = tokenOverride || process.env.TELEGRAM_BOT_TOKEN || '';
  if (!token) {
    return { ok: false, error: 'TELEGRAM_BOT_TOKEN environment variable not set' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    if (data.ok) {
      return { ok: true, bot: data.result };
    }
    return { ok: false, error: data.description || 'Failed to authenticate bot' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// Send photo with caption, fallback to text if photo fails
export async function sendTelegramPhoto({ token, chatId, photoUrl, caption, parseMode = 'HTML' }) {
  if (!token || !chatId) {
    return { ok: false, error: 'Telegram credentials missing (token or chatId)' };
  }

  if (photoUrl && (photoUrl.startsWith('http://') || photoUrl.startsWith('https://'))) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: photoUrl,
          caption: caption.slice(0, 1024),
          parse_mode: parseMode
        })
      });

      const data = await res.json();
      if (data.ok) {
        return { ok: true, method: 'sendPhoto', result: data.result };
      }

      console.warn('sendPhoto failed, falling back to sendMessage:', data.description);
    } catch (err) {
      console.warn('sendPhoto network error, falling back to sendMessage:', err.message);
    }
  }

  return sendTelegramText({ token, chatId, text: caption, parseMode });
}

// Send text message
export async function sendTelegramText({ token, chatId, text, parseMode = 'HTML' }) {
  if (!token || !chatId) {
    return { ok: false, error: 'Telegram credentials missing (token or chatId)' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text.slice(0, 4096),
        parse_mode: parseMode
      })
    });

    const data = await res.json();
    if (data.ok) {
      return { ok: true, method: 'sendMessage', result: data.result };
    }
    return { ok: false, error: data.description || 'Telegram API error' };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// Main Telegram API Handler for IshTop.uz
export async function handleTelegramAction(action, payload = {}) {
  const { token, chatId } = getEnvConfig(payload);

  if (action === 'check_bot') {
    return checkBotStatus(token);
  }

  if (!token) {
    return { ok: false, error: 'TELEGRAM_BOT_TOKEN not configured in environment' };
  }

  if (!chatId) {
    return { ok: false, error: 'TELEGRAM_ADMIN_CHAT_ID not configured in environment' };
  }

  const now = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

  switch (action) {
    case 'send_test_text': {
      const text = `
🔔 <b>IshTop.uz — Test Matnli Xabarnoma</b>
━━━━━━━━━━━━━━━━━━━━
✅ Telegram bot (@apexishqidirish_bot) ulanishi muvaffaqiyatli!
🕒 <b>Vaqt:</b> ${now}
🌐 <b>Platforma:</b> IshTop.uz Ish va xodimlar qidirish portali
━━━━━━━━━━━━━━━━━━━━
<i>Barcha yangi vakansiyalar va arizalar ushbu chatga keladi.</i>
`.trim();
      return sendTelegramText({ token, chatId, text });
    }

    case 'send_test_photo': {
      const photoUrl = payload.photoUrl || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop';
      const caption = `
📸 <b>IshTop.uz — Test Rasm Xabarnomasi</b>
━━━━━━━━━━━━━━━━━━━━
✅ Telegram bot rasm va to'liq formatlangan e'lonlarni muvaffaqiyatli qabul qilmoqda!
🕒 <b>Vaqt:</b> ${now}
━━━━━━━━━━━━━━━━━━━━
<i>Vakansiya va kompaniyalar logotiplari ushbu formatda yetkaziladi.</i>
`.trim();
      return sendTelegramPhoto({ token, chatId, photoUrl, caption });
    }

    case 'new_job': {
      const job = payload.job || {};
      const photoUrl = job.companyLogo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop';
      const caption = `
💼 <b>YANGI VAKANSIYA E'LON QILINDI! — IshTop.uz</b>
━━━━━━━━━━━━━━━━━━━━
📌 <b>Lavozim:</b> <b>${job.title || 'Vakansiya'}</b>
🏢 <b>Kompaniya:</b> <b>${job.companyName || '-'}</b>
📍 <b>Hudud:</b> ${job.location || 'Toshkent'}
💰 <b>Maosh:</b> ${job.salary || (job.salaryMin ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax ? job.salaryMax.toLocaleString() : ''} ${job.salaryCurrency || 'UZS'}` : 'Kelishilgan')}
🕒 <b>Bandlik turi:</b> ${job.type || 'To\'liq bandlik'}
👨‍💻 <b>Tajriba:</b> ${job.experience || '1-3 yil'}
🕒 <b>Sana:</b> ${now}
━━━━━━━━━━━━━━━━━━━━
Status: 🟢 <b>Arizalar qabul qilinmoqda</b>
`.trim();
      return sendTelegramPhoto({ token, chatId, photoUrl, caption });
    }

    case 'new_application': {
      const { job = {}, applicantInfo = {}, coverLetter = '' } = payload;
      const photoUrl = job.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop';
      const caption = `
📄 <b>YANGI ARIZA / REZYUME KELDI! — IshTop.uz</b>
━━━━━━━━━━━━━━━━━━━━
📌 <b>Vakansiya:</b> <b>${job.title || 'Ish o\'rni'}</b>
🏢 <b>Kompaniya:</b> ${job.companyName || '-'}
👤 <b>Nomzod:</b> <b>${applicantInfo.name || 'Nomzod'}</b>
📞 <b>Telefon:</b> <a href="tel:${applicantInfo.phone}">${applicantInfo.phone || '-'}</a>
📧 <b>Email:</b> ${applicantInfo.email || '-'}
📍 <b>Shahar:</b> ${applicantInfo.city || 'Toshkent'}
🕒 <b>Vaqt:</b> ${now}
${coverLetter ? `\n📝 <b>Ilhomlantiruvchi xat:</b> <i>${coverLetter}</i>` : ''}
━━━━━━━━━━━━━━━━━━━━
Status: 🟡 <b>Ko'rib chiqish kutilmoqda</b>
`.trim();
      return sendTelegramPhoto({ token, chatId, photoUrl, caption });
    }

    case 'new_user': {
      const u = payload.user || {};
      const text = `
👤 <b>YANGI FOYDALANUVCHI RO'YXATDAN O'TDI! — IshTop.uz</b>
━━━━━━━━━━━━━━━━━━━━
🆔 <b>Foydalanuvchi:</b> <b>${u.name || '-'}</b>
🏢 <b>Roli:</b> ${u.role === 'employer' ? 'Ish beruvchi (HR)' : 'Ish qidiruvchi (Nomzod)'}
📞 <b>Telefon / Login:</b> ${u.phone || u.identifier || '-'}
📧 <b>Email:</b> ${u.email || '-'}
🕒 <b>Vaqt:</b> ${now}
━━━━━━━━━━━━━━━━━━━━
<i>Parol va maxfiy ma'lumotlar xavfsizlik maqsadida yuborilmaydi.</i>
`.trim();
      return sendTelegramText({ token, chatId, text });
    }

    default:
      return { ok: false, error: `Unknown action: ${action}` };
  }
}
