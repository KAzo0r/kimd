import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Eye, 
  Users, 
  Building2, 
  Sparkles, 
  Flame, 
  ChevronRight, 
  Globe, 
  DollarSign, 
  Check, 
  ArrowLeft
} from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useJobStore } from '../store/useJobStore';
import JobApplyModal from '../components/jobs/JobApplyModal';
import JobCard from '../components/common/JobCard';
import { formatSalary, formatTimeAgo, getExperienceLabel, getFormatLabel } from '../utils/helpers';
import { translations } from '../constants/translations';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useThemeStore();
  const { jobs, companies, favorites, toggleFavorite, incrementJobViews, applications } = useJobStore();
  const t = translations[language] || translations.uz;

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const job = jobs.find((j) => j.id === id);

  useEffect(() => {
    if (job?.id) {
      incrementJobViews(job.id);
    }
  }, [id]);

  if (!job) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Vakansiya topilmadi
        </h2>
        <p className="text-sm text-slate-500">
          Ushbu vakansiya yopilgan yoki o'chirilgan bo'lishi mumkin.
        </p>
        <Link
          to="/jobs"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-md"
        >
          Barcha vakansiyalarga qaytish
        </Link>
      </div>
    );
  }

  const company = companies.find((c) => c.id === job.companyId) || {
    name: job.companyName,
    avatarBg: "bg-blue-600",
    verified: true,
    location: job.city,
    employees: "100+",
    rating: 4.8
  };

  const isFavorite = favorites.includes(job.id);
  const hasApplied = applications.some((a) => a.jobId === job.id);

  // Similar jobs
  const similarJobs = jobs
    .filter((j) => j.category === job.category && j.id !== job.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Breadcrumbs & Back */}
      <div className="flex items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600">Bosh sahifa</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/jobs" className="hover:text-blue-600">Vakansiyalar</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-xs">{job.title}</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 hover:text-blue-600 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Orqaga</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Job Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 overflow-hidden shrink-0 shadow-sm">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <div className={`w-full h-full rounded-xl ${company.avatarBg || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-xl`}>
                      {company.name?.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/companies/${company.slug || company.id}`}
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5"
                    >
                      <span>{company.name}</span>
                      {company.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                    </Link>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {job.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.city}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatTimeAgo(job.createdAt, language)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      {job.views || 0} {t.views}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(job.id)}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    isFavorite
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  title={isFavorite ? t.saved : t.saveJob}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  title={t.share}
                >
                  {copiedLink ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Salary Banner */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Taklif etilayotgan oylik maosh:
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryNegotiable, language)}
                </span>
              </div>

              <div>
                {hasApplied ? (
                  <div className="px-6 py-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.alreadyApplied}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setApplyModalOpen(true)}
                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <span>{t.applyNow}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/60 dark:border-blue-900/40">
                {getFormatLabel(job.format, language)}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                Tajriba: {getExperienceLabel(job.experience, language)}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                Shahar: {job.city}
              </span>
              {job.featured && (
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200">
                  {t.hot}
                </span>
              )}
            </div>

          </div>

          {/* Description Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {/* About Job */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>{t.jobDescription}</span>
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {language === 'ru' ? job.descriptionRu : job.descriptionUz}
              </p>
            </div>

            {/* Requirements */}
            {((language === 'ru' ? job.requirementsRu : job.requirementsUz) || []).length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.requirements}
                </h3>
                <ul className="space-y-2">
                  {(language === 'ru' ? job.requirementsRu : job.requirementsUz).map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {((language === 'ru' ? job.benefitsRu : job.benefitsUz) || []).length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.weOffer}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(language === 'ru' ? job.benefitsRu : job.benefitsUz).map((ben, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{ben}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Apply Bar */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">Qiziqdingizmi?</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">O'z rezyumengizni ish beruvchiga yuboring</p>
              </div>

              {!hasApplied ? (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
                >
                  {t.applyNow}
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 rounded-xl">
                  {t.alreadyApplied}
                </span>
              )}
            </div>

          </div>

          {/* Similar Jobs */}
          {similarJobs.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.similarJobs}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {similarJobs.map((simJob) => (
                  <JobCard key={simJob.id} job={simJob} isCompact />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Company Info Card & Stats */}
        <div className="space-y-6 sticky top-24">
          
          {/* Company Mini Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.aboutCompany}
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 overflow-hidden shrink-0 flex items-center justify-center">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <div className={`w-full h-full rounded-xl ${company.avatarBg || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-lg`}>
                    {company.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{company.name}</span>
                  {company.verified && <CheckCircle2 className="w-4 h-4 text-blue-500" />}
                </h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {company.industryUz || company.industry}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'ru' ? company.descriptionRu : company.descriptionUz}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Joylashuv:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{company.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Xodimlar:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{company.employees}</span>
              </div>
              {company.website && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sayt:</span>
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    {company.website.replace('https://', '')}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Link
                to={`/companies/${company.slug || company.id}`}
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <span>Kompaniya sahifasi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Safety & Guarantee Box */}
          <div className="p-5 rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 text-xs space-y-2 text-slate-700 dark:text-slate-300">
            <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>IshTop.uz kafolati</span>
            </div>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              IshTop.uz platformasidagi barcha vakansiyalar xavfsizlik filtrlari orqali tekshiriladi. Nomzodlardan ariza uchun hech qachon pul talab qilinmaydi.
            </p>
          </div>

        </div>

      </div>

      {/* Apply Modal */}
      <JobApplyModal
        job={job}
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />

    </div>
  );
}
