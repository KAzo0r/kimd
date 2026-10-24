import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Heart, 
  CheckCircle2, 
  Flame, 
  Sparkles,
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useJobStore } from '../../store/useJobStore';
import { formatSalary, formatTimeAgo, getExperienceLabel, getFormatLabel } from '../../utils/helpers';
import { translations } from '../../constants/translations';

export default function JobCard({ job, onApplyClick, isCompact = false }) {
  const { language } = useThemeStore();
  const { favorites, toggleFavorite, companies, applications } = useJobStore();
  const t = translations[language] || translations.uz;

  const isFavorite = favorites.includes(job.id);
  const company = companies.find(c => c.id === job.companyId) || {
    name: job.companyName,
    avatarBg: "bg-blue-600",
    verified: true
  };

  const hasApplied = applications.some(a => a.jobId === job.id);

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between">
      
      <div>
        {/* Top Badges & Favorite */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {job.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                <Sparkles className="w-3 h-3 text-amber-500" />
                {t.hot}
              </span>
            )}
            {job.urgent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                <Flame className="w-3 h-3 text-rose-500" />
                {t.urgent}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Clock className="w-3 h-3 text-slate-400" />
              {formatTimeAgo(job.createdAt, language)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(job.id);
            }}
            className={`p-2 rounded-xl transition-all ${
              isFavorite
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isFavorite ? t.saved : t.saveJob}
            aria-label="Save job"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Company Info & Job Title */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center p-1.5 shadow-sm">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className={`w-full h-full rounded-lg ${company.avatarBg || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-sm`}>
                {company.name?.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <Link
              to={`/jobs/${job.id}`}
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 flex items-center gap-1"
            >
              <span>{job.title}</span>
              <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all shrink-0 text-blue-600" />
            </Link>

            <div className="flex items-center gap-2 mt-0.5">
              <Link
                to={`/companies/${company.slug || company.id}`}
                className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 truncate"
              >
                {job.companyName}
              </Link>
              {company.verified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" title="Tasdiqlangan kompaniya" />
              )}
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="mb-3.5">
          <div className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryNegotiable, language)}
          </div>
        </div>

        {/* Location & Tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <MapPin className="w-3 h-3 text-slate-400" />
            {job.city}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Briefcase className="w-3 h-3 text-slate-400" />
            {getFormatLabel(job.format, language)}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {getExperienceLabel(job.experience, language)}
          </span>
        </div>

        {/* Short description preview if not compact */}
        {!isCompact && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
            {language === 'ru' ? job.descriptionRu : job.descriptionUz}
          </p>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {job.views || 0}
          </span>
          <span>•</span>
          <span>{job.applicantsCount || 0} {t.applicants}</span>
        </div>

        <div className="flex items-center gap-2">
          {hasApplied ? (
            <span className="px-3.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-xl flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.alreadyApplied}
            </span>
          ) : (
            <button
              onClick={() => onApplyClick ? onApplyClick(job) : null}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-600/20 hover:scale-[1.02]"
            >
              {t.applyNow}
            </button>
          )}

          <Link
            to={`/jobs/${job.id}`}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {t.readMore}
          </Link>
        </div>
      </div>

    </div>
  );
}
