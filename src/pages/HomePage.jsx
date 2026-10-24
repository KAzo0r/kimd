import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedJobs from '../components/home/FeaturedJobs';
import TopCompanies from '../components/home/TopCompanies';
import CtaBanners from '../components/home/CtaBanners';
import { ShieldCheck, Zap, Users, TrendingUp } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { translations } from '../constants/translations';

export default function HomePage() {
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;

  const features = [
    {
      icon: ShieldCheck,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
      titleUz: "Faqat tasdiqlangan ish beruvchilar",
      titleRu: "Только проверенные работодатели",
      titleEn: "100% Verified Employers",
      descUz: "Har bir kompaniya O'zbekiston soliq va yuridik ma'lumotlar bazasi orqali tekshiriladi.",
      descRu: "Каждая компания проходит юридическую верификацию и модерацию перед публикацией.",
      descEn: "Every company is vetted against official registry to guarantee safety and legitimacy."
    },
    {
      icon: Zap,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/50",
      titleUz: "Tezkor aloqa va ochiq maoshlar",
      titleRu: "Быстрый отклик и прозрачные зарплаты",
      titleEn: "Instant Apply & Clear Salaries",
      descUz: "Vakansiyalarda aniq so'mda (UZS) ko'rsatilgan maoshlar va HR bilan to'g'ridan-to'g'ri aloqa.",
      descRu: "Зарплаты указаны в национальной валюте (сум) без скрытых условий и комиссий.",
      descEn: "Upfront salary ranges in UZS and direct channels to hiring managers."
    },
    {
      icon: Users,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50",
      titleUz: "Qulay rezyume konstruktori",
      titleRu: "Удобный онлайн-конструктор резюме",
      titleEn: "Modern Resume Builder",
      descUz: "5 daqiqada xalqaro standartdagi professional rezyume yarating va PDF formatda yuklab oling.",
      descRu: "Создайте резюме по мировым стандартам за 5 минут и экспортируйте в PDF.",
      descEn: "Build high-impact professional CVs in minutes and export to clean PDFs."
    },
    {
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50",
      titleUz: "Arizalar holatini onlayn kuzatish",
      titleRu: "Прозрачное отслеживание откликов",
      titleEn: "Live Application Tracking",
      descUz: "Arizangiz ko'rib chiqilgani, suhbatga chaqiruv yoki qabul natijalari haqida bir zumda xabar oling.",
      descRu: "Получайте моментальные уведомления о просмотре резюме и приглашениях на собеседование.",
      descEn: "Real-time notifications when recruiters view your application or invite you to interview."
    }
  ];

  return (
    <div className="space-y-4">
      {/* 1. Hero Search */}
      <HeroSection />

      {/* 2. Top Categories */}
      <CategoryGrid />

      {/* 3. Featured Vacancies */}
      <FeaturedJobs />

      {/* 4. Top Companies */}
      <TopCompanies />

      {/* 5. Why Choose IshTop.uz */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {t.brandName} afzalliklari
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.whyUsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const title = language === 'ru' ? feat.titleRu : language === 'en' ? feat.titleEn : feat.titleUz;
            const desc = language === 'ru' ? feat.descRu : language === 'en' ? feat.descEn : feat.descUz;

            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Call to Action Banners */}
      <CtaBanners />
    </div>
  );
}
