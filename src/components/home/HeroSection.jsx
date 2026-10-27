import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Building2, 
  Users, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useJobStore } from '../../store/useJobStore';
import { translations, CITIES } from '../../constants/translations';

export default function HeroSection() {
  const { language } = useThemeStore();
  const { setFilters, jobs, companies } = useJobStore();
  const t = translations[language] || translations.uz;
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ query: keyword, city });
    navigate(`/jobs?query=${encodeURIComponent(keyword)}&city=${encodeURIComponent(city)}`);
  };

  const handlePillClick = (term, filterKey = 'query') => {
    setFilters({ [filterKey]: term });
    navigate(`/jobs?${filterKey}=${encodeURIComponent(term)}`);
  };

  const popularPills = [
    { labelUz: "React / Frontend", labelRu: "React / Frontend", labelEn: "React / Frontend", query: "React" },
    { labelUz: "Python & AI", labelRu: "Python & AI", labelEn: "Python & AI", query: "Python" },
    { labelUz: "Buxgalteriya", labelRu: "Бухгалтерия", labelEn: "Accounting", query: "Buxgalter" },
    { labelUz: "SMM & Marketing", labelRu: "SMM & Маркетинг", labelEn: "SMM & Marketing", query: "SMM" },
    { labelUz: "Masofaviy (Remote)", labelRu: "Удаленная работа", labelEn: "Remote", query: "formatRemote", isFormat: true },
    { labelUz: "Sotuvchi-maslahatchi", labelRu: "Продавец-консультант", labelEn: "Sales Consultant", query: "sotuvchi" }
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 dark:from-slate-900/40 dark:via-slate-950 dark:to-slate-950">
      
      {/* Background Glow Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <div className="absolute -top-12 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute -top-8 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Top Mini Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 text-xs font-semibold animate-fade-in shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{language === 'ru' ? 'Ведущий современный портал поиска работы в Узбекистане' : language === 'en' ? "#1 Modern Job Portal in Uzbekistan" : "O'zbekistonning #1 zamonaviy ish qidirish portali"}</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans text-balance">
            {t.heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed text-balance">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Big Search Bar Card */}
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="p-2 sm:p-2.5 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2"
          >
            {/* Keyword Input */}
            <div className="relative flex-1 w-full flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base rounded-2xl bg-transparent text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
              />
            </div>

            {/* City Selector */}
            <div className="relative w-full sm:w-60 flex items-center border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pl-0 sm:pl-2">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-11 pr-8 py-3.5 text-sm rounded-2xl bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="">{t.cityPlaceholder}</option>
                {CITIES.map((c) => (
                  <option key={c} value={c} className="dark:bg-slate-800">{c}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{t.searchBtn}</span>
            </button>
          </form>

          {/* Popular Search Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {t.popularSearches}
            </span>
            {popularPills.map((pill, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => pill.isFormat ? handlePillClick(pill.query, 'format') : handlePillClick(pill.query, 'query')}
                className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shadow-sm"
              >
                {language === 'ru' ? pill.labelRu : language === 'en' ? pill.labelEn : pill.labelUz}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="pt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {jobs.length}+
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t.statsJobs}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {companies.length}+
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t.statsCompanies}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              1 200+
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t.statsResumes}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">
              18.5 mln
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {t.statsAvgSalary} (UZS)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
