import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Send, Phone, Mail, MapPin, Heart, Shield, Award } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { translations, CITIES } from '../../constants/translations';

export default function Footer() {
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                IshTop<span className="text-blue-600 dark:text-blue-400">.uz</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              {t.slogan}. {language === 'ru' ? 'Современная технологическая экосистема, объединяющая достойную работу и талантливых специалистов.' : language === 'en' ? 'A modern ecosystem connecting top opportunities and talent across Uzbekistan.' : "O'zbekistonning barcha viloyatlarida munosib ish va iqtidorli kadrlarni birlashtiruvchi zamonaviy texnologik ekotizim."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>{language === 'ru' ? '100% проверенные вакансии' : language === 'en' ? '100% Verified Vacancies' : '100% Tasdiqlangan vakansiyalar'}</span>
              </div>
            </div>
          </div>

          {/* For Seekers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.forSeekers}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.jobs}
                </Link>
              </li>
              <li>
                <Link to="/jobs?format=formatRemote" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.formatRemote}
                </Link>
              </li>
              <li>
                <Link to="/companies" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.companies}
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=resume" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.myResume}
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.forEmployers}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/employer?action=new" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.postJob}
                </Link>
              </li>
              <li>
                <Link to="/employer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.employerCabinet}
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=register&role=employer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Kompaniyani ro'yxatdan o'tkazish
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.adminPanel}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {t.support}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Toshkent, IT Park, 4-bino</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+998 (71) 200-00-55</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>info@ishtop.uz</span>
              </li>
              <li className="pt-1">
                <a 
                  href="https://t.me" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-xs font-medium hover:bg-sky-100 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram kanal @ishtop_uz</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Popular Cities in Uzbekistan */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-2">
              {t.citiesInUzbekistan}:
            </span>
            {CITIES.map((city) => (
              <Link
                key={city}
                to={`/jobs?city=${encodeURIComponent(city)}`}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} IshTop.uz. {t.rightsReserved}</p>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">{t.privacyPolicy}</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">{t.termsOfUse}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
