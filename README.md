# 💼 IshTop.uz — O'zbekistondagi Milliy Ish Qidirish va Ishga Joylashish Portali

> **IshTop.uz** — O'zbekiston mehnat bozoridagi eng ilg'or, zamonaviy va to'liq funksional ish qidirish platformasi (HeadHunter / Uzum Jobs / OLX Ish analogi). Loyiha **React, Vite, Tailwind CSS, React Router, Zustand, Canvas Confetti** hamda rasmiy **Telegram Bot** (`@apexishqidirish_bot`) integratsiyasi bilan ta'minlangan.

---

## 🌟 Asosiy Imkoniyatlar (Key Features)

### 1. 🔍 Ish Qidiruvchilar Uchun (For Job Seekers)
- **Vakansiyalar Katalogi & Fasetli Qidiruv:** 
  - Kasb sohasi (IT, Moliya, Savdo, Marketing, Qurilish va b.), shahar (Toshkent, Samarqand, Buxoro va b.), ish tajribasi (Tajribasiz, 1-3 yil, 3-6 yil), ish tartibi (To'liq, Masofaviy, Gibrid) va maosh oralig'i bo'yicha saralash.
  - Saralash: Eng yangi, Maoshi yuqori, Ommabop.
- **Tezkor Ariza Topshirish (1-Click Apply):**
  - Sayt orqali rezyume va qisqa xat (Cover letter) bilan bir zumda ariza yuborish.
  - Har bir yuborilgan ariza avtomatik ravishda **Telegram Bot** orqali ish beruvchi / adminning shaxsiy Telegramiga boradi.
- **Interaktiv Rezyume Konstruktori:**
  - Shaxsiy ma'lumotlar, ta'lim, ish tajribasi, tillar va ko'nikmalarni kiritish.
  - Real-vaqt rejimida zamonaviy A4 formatli rezyume ko'rinishi va uni darhol chop etish/saqlash.
- **Sevimlilar:** Qiziqqan vakansiyalarni saqlab qo'yish va keyinroq ko'rib chiqish.

### 2. 🏢 Ish Beruvchilar Uchun (For Employers & HR)
- **Kompaniya Profili:** Uzum, Payme, Click, EPAM, TBC Bank kabi yetakchi tashkilotlar profili, xodimlar soni, faoliyat sohasi va joylashuvi.
- **Yangi Vakansiya Joylashtirish:**
  - Lavozim, maosh (yoki kelishilgan), talablar, qulayliklar va ish sharoitlarini kiritish.
  - Yangi vakansiya e'lon qilinishi bilan **Telegram Bot**ga yangi ish o'rni to'g'risida to'liq xabarnoma jo'natiladi.
- **Nomzodlar Ro'yxati (HR Kanban):**
  - Arizalarni ko'rish, holatlarini o'zgartirish (*Yangi*, *Ko'rib chiqilmoqda*, *Suhbatga chaqirildi*, *Qabul qilindi*, *Rad etildi*).

### 3. 🛡️ Super Admin Paneli
- **Mehnat bozori statistikasi va grafik tahlil:**
  - Jami faol vakansiyalar, kompaniyalar soni, topshirilgan arizalar soni.
- **Vakansiyalar va Kompaniyalar boshqaruvi:** 
  - Vakansiyalarni tahrirlash, o'chirish yoki "Top Vakansiya" sifatida belgilash.
- **🤖 Telegram Bot Boshqaruv Markazi:**
  - `@apexishqidirish_bot` holatini tekshirish (`getMe`).
  - Sinov matnli va suratli xabarlar yuborish.
  - Avtomatlashtirilgan bildirishnomalar holatini nazorat qilish.

### 4. 🌐 Ko'p tilli & Dizayn
- **3 ta Til:** O'zbekcha (UZ), Ruscha (RU), Inglizcha (EN).
- **Dark / Light Mode:** Tungi va kunduzgi rejim (tanlov saqlanadi).
- **Moslashuvchan (Responsive):** Smartfon, planshet va kompyuter ekranlariga to'liq moslashgan.

---

## 🤖 Telegram Bot Integratsiyasi (@apexishqidirish_bot)

Loyiha O'zbekistondagi real Telegram boti bilan to'liq bog'langan:

- **Bot Username:** [@apexishqidirish_bot](https://t.me/apexishqidirish_bot)
- **Token:** `.env` faylida xavfsiz tarzda saqlanadi (`TELEGRAM_BOT_TOKEN`).
- **Admin Chat ID:** `TELEGRAM_ADMIN_CHAT_ID="799910176"`.

> 💡 **Muhim Eslatma:** Telegram Bot API qoidalariga ko'ra, bot foydalanuvchiga birinchi bo'lib xabar yozishi uchun foydalanuvchi Telegramda [@apexishqidirish_bot](https://t.me/apexishqidirish_bot) ga kirib **`/start`** tugmasini bosgan bo'lishi kerak.

### Qachon Xabarlar Yuboriladi?
1. **Nomzod ishga ariza topshirganda:** Nomzod ismi, telefoni, emaili, shahri, vakansiya nomi va rezyume ma'lumotlari darhol Telegramga yetib boradi.
2. **Yangi vakansiya yaratilganda:** Ish beruvchi e'lon joylaganda kompaniya, maosh va lavozim tafsilotlari Telegramga tushadi.
3. **Admin paneldan sinov xabarlari:** Ulanish holatini istalgan payt tekshirish imkoniyati.

---

## 🔑 Demo Kirish Hisoblari (Test Accounts)

Kirish sahifasida (`/auth`) quyidagi rollar bilan tizimga kirish mumkin:

| Rol | Ism / Kompaniya | Email | Parol | Ruxsatlar |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Alisher Yusupov | `admin@ishtop.uz` | `admin123` | To'liq boshqaruv, Telegram Bot paneli |
| **Ish Beruvchi (HR)** | Sarvar Rustamov (Uzum) | `hr@uzum.uz` | `uzum123` | Vakansiya qo'shish, nomzodlar bilan ishlash |
| **Ish Qidiruvchi** | Javohir Karimov | `javohir@ishtop.uz` | `user123` | Ish qidirish, rezyume to'ldirish, ariza topshirish |

---

## 🚀 Loyihani Ishga Tushirish (Development Setup)

### 1. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 2. Muhit o'zgaruvchilari (.env)
Loyihada `.env` fayli yaratilgan:
```env
TELEGRAM_BOT_TOKEN="8793458072:AAEdrQurMlxbJXL9sPsUrhwTAgalfdM7UyY"
TELEGRAM_ADMIN_CHAT_ID="799910176"
```

### 3. Serverni ishga tushirish
```bash
npm run dev
```
Brauzeringizda oching: [http://localhost:5173/](http://localhost:5173/)

### 4. Loyihani yig'ish (Production Build)
```bash
npm run build
```

---

## 📁 Loyiha Strukturasi

```text
├── api/
│   └── telegram.js           # Vercel Serverless Function (Telegram Bot)
├── server/
│   └── telegramBackend.js    # Backend Telegram so'rovlarini qayta ishlash moduli
├── src/
│   ├── components/
│   │   ├── common/           # Navbar, Footer, JobCard, CompanyCard
│   │   ├── home/             # Hero, CategoryGrid, FeaturedJobs, TopCompanies
│   │   ├── jobs/             # JobFilterSidebar, JobApplyModal
│   │   └── resume/           # ResumeForm, ResumePreview
│   ├── constants/
│   │   ├── mockData.js       # O'zbekistonning haqiqiy kompaniyalari va vakansiyalari
│   │   └── translations.js   # UZ, RU, EN tillari lug'ati
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── JobsPage.jsx
│   │   ├── JobDetailsPage.jsx
│   │   ├── CompaniesPage.jsx
│   │   ├── CompanyDetailsPage.jsx
│   │   ├── SeekerDashboardPage.jsx
│   │   ├── EmployerDashboardPage.jsx
│   │   ├── AdminPage.jsx     # Telegram Bot boshqaruvi bilan
│   │   └── AuthPage.jsx
│   ├── store/
│   │   ├── useAuthStore.js   # Foydalanuvchi sessiyasi
│   │   ├── useJobStore.js    # Vakansiyalar, arizalar, rezyume
│   │   └── useThemeStore.js  # Til va tungi rejim
│   └── utils/
│       ├── telegramService.js# Telegram frontend mijozi
│       └── helpers.js        # Valyuta, vaqt va formatlash funksiyalari
├── .env                      # Telegram bot token va chat ID
├── tailwind.config.js
└── vite.config.js            # Vite va mahalliy Telegram API middleware
```

IshTop.uz — O'zbekiston mehnat bozorini raqamlashtirish sari yangi qadam!
