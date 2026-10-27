export function formatSalary(min, max, isNegotiable = false, lang = 'uz') {
  if (isNegotiable || (!min && !max)) {
    if (lang === 'uz') return "Kelishilgan holda";
    if (lang === 'ru') return "По договоренности";
    return "Negotiable";
  }

  const formatNum = (num) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const curr = lang === 'en' ? 'UZS' : lang === 'ru' ? 'сум' : "so'm";

  if (min && max) {
    return `${formatNum(min)} – ${formatNum(max)} ${curr}`;
  } else if (min) {
    const from = lang === 'uz' ? 'dan' : lang === 'ru' ? 'от' : 'from';
    return `${from} ${formatNum(min)} ${curr}`;
  } else if (max) {
    const to = lang === 'uz' ? 'gacha' : lang === 'ru' ? 'до' : 'up to';
    return `${to} ${formatNum(max)} ${curr}`;
  }
  return "Kelishilgan holda";
}

export function formatTimeAgo(dateString, lang = 'uz') {
  if (!dateString) return "";
  const now = new Date();
  const past = new Date(dateString);
  const diffInHours = Math.floor((now - past) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    if (lang === 'uz') return "Hozirgina";
    if (lang === 'ru') return "Только что";
    return "Just now";
  }
  if (diffInHours < 24) {
    if (lang === 'uz') return `${diffInHours} soat oldin`;
    if (lang === 'ru') return `${diffInHours} ч. назад`;
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    if (lang === 'uz') return "Kecha";
    if (lang === 'ru') return "Вчера";
    return "Yesterday";
  }
  if (diffInDays < 30) {
    if (lang === 'uz') return `${diffInDays} kun oldin`;
    if (lang === 'ru') return `${diffInDays} дн. назад`;
    return `${diffInDays}d ago`;
  }

  return past.toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US');
}

export function getExperienceLabel(expKey, lang = 'uz') {
  const map = {
    expNo: { uz: "Tajribasiz (Junior)", ru: "Без опыта", en: "No experience" },
    exp1to3: { uz: "1-3 yil", ru: "1–3 года", en: "1–3 years" },
    exp3to6: { uz: "3-6 yil", ru: "3–6 лет", en: "3–6 years" },
    expMore6: { uz: "6+ yil", ru: "Более 6 лет", en: "6+ years" },
  };
  return map[expKey]?.[lang] || expKey;
}

export function getFormatLabel(formatKey, lang = 'uz') {
  const map = {
    formatFull: { uz: "To'liq kun", ru: "Полный день", en: "Full-time" },
    formatRemote: { uz: "Masofaviy", ru: "Удаленка", en: "Remote" },
    formatHybrid: { uz: "Gibrid", ru: "Гибрид", en: "Hybrid" },
    formatPartTime: { uz: "Qisman bandlik", ru: "Частичная", en: "Part-time" },
    formatInternship: { uz: "Amaliyot", ru: "Стажировка", en: "Internship" },
  };
  return map[formatKey]?.[lang] || formatKey;
}

export function getStatusBadge(status, lang = 'uz') {
  const labels = {
    applied: { uz: "Topshirildi", ru: "Отправлено", en: "Submitted", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
    reviewed: { uz: "Ko'rib chiqilmoqda", ru: "На рассмотрении", en: "Reviewed", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
    interview: { uz: "Suhbatga chaqiruv", ru: "Интервью", en: "Interview", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" },
    accepted: { uz: "Qabul qilindi / Taklif", ru: "Оффер / Принят", en: "Accepted", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
    rejected: { uz: "Rad etildi", ru: "Отказ", en: "Rejected", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
  };
  return labels[status] || { uz: status, ru: status, en: status, color: "bg-slate-100 text-slate-700" };
}
