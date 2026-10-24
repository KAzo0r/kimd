import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useJobStore } from '../../store/useJobStore';

export default function CompanyCard({ company }) {
  const { language } = useThemeStore();
  const { jobs } = useJobStore();

  const openJobsCount = jobs.filter(j => j.companyId === company.id).length;

  const desc = language === 'ru' 
    ? company.descriptionRu 
    : language === 'en' 
    ? company.descriptionEn 
    : company.descriptionUz;

  const industry = language === 'ru' 
    ? company.industryRu 
    : language === 'en' 
    ? company.industry 
    : company.industryUz;

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Header with Logo & Rating */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <div className={`w-full h-full rounded-xl ${company.avatarBg || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-lg`}>
                {company.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold border border-amber-200/70 dark:border-amber-900/60">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{company.rating}</span>
            <span className="text-[10px] text-amber-600/70 font-normal">({company.reviewsCount})</span>
          </div>
        </div>

        {/* Company Title & Industry */}
        <div className="mb-2.5">
          <Link
            to={`/companies/${company.slug || company.id}`}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1.5"
          >
            <span className="truncate">{company.name}</span>
            {company.verified && (
              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
            )}
          </Link>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
            {industry}
          </p>
        </div>

        {/* Location & Team Size */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {company.location}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            {company.employees} xodim
          </span>
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {desc}
        </p>
      </div>

      {/* Footer with Open Jobs and Link */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
          {openJobsCount} ochiq vakansiya
        </span>

        <Link
          to={`/companies/${company.slug || company.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 group/link"
        >
          <span>Profil</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
