import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { translations } from '../../constants/translations';

export default function CtaBanners() {
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: For Seekers */}
          <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">
                {t.ctaSeekerTitle}
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                {t.ctaSeekerSubtitle}
              </p>
              <div className="flex flex-col gap-2 pt-2 text-xs text-blue-100">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>{language === 'ru' ? 'Удобное скачивание резюме в формате PDF' : language === 'en' ? 'Convenient PDF resume export' : 'Qulay PDF rezyume yuklab olish formati'}</span>
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>{language === 'ru' ? 'Прозрачное онлайн-отслеживание откликов' : language === 'en' ? 'Live online application status tracking' : 'Arizalar holatini onlayn kuzatish'}</span>
                </span>
              </div>
            </div>

            <div>
              <Link
                to="/dashboard?tab=resume"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition-all hover:scale-[1.02]"
              >
                <span>{t.createResumeNow}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: For Employers */}
          <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-800 text-white shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">
                {t.ctaEmployerTitle}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t.ctaEmployerSubtitle}
              </p>
              <div className="flex flex-col gap-2 pt-2 text-xs text-slate-300">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ru' ? 'Публикация вакансии за считанные минуты' : language === 'en' ? 'Job published and active in minutes' : 'Vakansiyangiz 15 daqiqa ichida faollashadi'}</span>
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ru' ? 'Статус проверенного работодателя' : language === 'en' ? 'Verified company & employer status' : 'Tasdiqlangan ish beruvchi unvoni'}</span>
                </span>
              </div>
            </div>

            <div>
              <Link
                to="/employer?action=new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                <span>{t.postJobNow}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
