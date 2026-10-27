import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Users, 
  Globe, 
  Star, 
  CheckCircle2, 
  Briefcase, 
  ArrowLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useJobStore } from '../store/useJobStore';
import JobCard from '../components/common/JobCard';
import JobApplyModal from '../components/jobs/JobApplyModal';
import { MOCK_REVIEWS } from '../constants/mockData';
import { translations } from '../constants/translations';

export default function CompanyDetailsPage() {
  const { slug } = useParams();
  const { language } = useThemeStore();
  const { companies, jobs } = useJobStore();
  const t = translations[language] || translations.uz;

  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'about' | 'reviews'
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  const company = companies.find((c) => c.slug === slug || c.id === slug);

  if (!company) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {language === 'ru' ? 'Компания не найдена' : language === 'en' ? 'Company not found' : 'Kompaniya topilmadi'}
        </h2>
        <Link
          to="/companies"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-md"
        >
          {language === 'ru' ? 'Вернуться в каталог компаний' : language === 'en' ? 'Return to companies catalog' : 'Kompaniyalar katalogiga qaytish'}
        </Link>
      </div>
    );
  }

  const companyJobs = jobs.filter((j) => j.companyId === company.id);
  const companyReviews = MOCK_REVIEWS.filter((r) => r.companyId === company.id);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Back link */}
      <div>
        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'ru' ? 'Все компании' : language === 'en' ? 'All companies' : 'Barcha kompaniyalar'}</span>
        </Link>
      </div>

      {/* Hero Cover & Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        
        {/* Cover Photo */}
        <div className="h-44 sm:h-60 w-full relative bg-gradient-to-r from-blue-700 to-indigo-800 overflow-hidden">
          {company.coverImage && (
            <img
              src={company.coverImage}
              alt={company.name}
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            
            {/* Logo & Name */}
            <div className="flex items-end gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white dark:bg-slate-900 p-2.5 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden shrink-0 flex items-center justify-center">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="w-full h-full object-contain rounded-2xl" />
                ) : (
                  <div className={`w-full h-full rounded-2xl ${company.avatarBg || 'bg-blue-600'} text-white font-bold flex items-center justify-center text-3xl`}>
                    {company.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="space-y-1 mb-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {company.name}
                  </h1>
                  {company.verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" title="Tasdiqlangan kompaniya" />
                  )}
                </div>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {language === 'ru' ? (company.industryRu || company.industry) : language === 'en' ? (company.industryEn || company.industry) : (company.industryUz || company.industry)}
                </p>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold border border-amber-200 dark:border-amber-900/60">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{company.rating}</span>
                <span className="text-[11px] text-amber-600/70 font-normal">
                  ({company.reviewsCount} {language === 'ru' ? 'отзывов' : language === 'en' ? 'reviews' : 'fikr'})
                </span>
              </div>

              <div className="px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-900/60">
                {language === 'ru' ? `${companyJobs.length} открытых вакансий` : language === 'en' ? `${companyJobs.length} open jobs` : `${companyJobs.length} ta ochiq vakansiya`}
              </div>
            </div>

          </div>

          {/* Meta Details (Location, Employees, Website) */}
          <div className="flex flex-wrap items-center gap-4 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{company.location}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{company.employees} {language === 'ru' ? 'сотрудников' : language === 'en' ? 'employees' : 'xodim'}</span>
            </span>
            {company.website && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    {company.website.replace('https://', '')}
                  </a>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 sm:px-10 border-t border-slate-100 dark:border-slate-800 flex gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-3.5 border-b-2 transition-colors ${
              activeTab === 'jobs'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.jobs || (language === 'ru' ? 'Вакансии' : language === 'en' ? 'Vacancies' : 'Vakansiyalar')} ({companyJobs.length})
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-3.5 border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'ru' ? 'О компании' : language === 'en' ? 'About company' : 'Kompaniya haqida'}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'ru' ? 'Отзывы сотрудников' : language === 'en' ? 'Employee reviews' : 'Xodimlar fikrlari'} ({companyReviews.length > 0 ? companyReviews.length : 2})
          </button>
        </div>

      </div>

      {/* Tab 1: Vacancies List */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {language === 'ru' ? `Все открытые вакансии в ${company.name}` : language === 'en' ? `All open vacancies at ${company.name}` : `${company.name}dagi barcha ochiq vakansiyalar`}
          </h2>

          {companyJobs.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500">{language === 'ru' ? 'В настоящее время в этой компании нет открытых вакансий.' : language === 'en' ? 'Currently there are no open vacancies in this company.' : 'Hozirda bu kompaniyada yangi vakansiyalar mavjud emas.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {companyJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApplyClick={(j) => setSelectedJobForApply(j)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: About Company & Perks */}
      {activeTab === 'about' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'ru' ? 'Подробнее о компании' : language === 'en' ? 'About company' : 'Kompaniya haqida batafsil'}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {language === 'ru' ? company.descriptionRu : company.descriptionUz}
            </p>

            {company.perks && company.perks.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'ru' ? 'Льготы и преимущества компании:' : language === 'en' ? 'Perks offered by company:' : 'Kompaniya taklif etadigan imtiyozlar:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {company.perks.map((perk, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {language === 'ru' ? 'Информация о работодателе' : language === 'en' ? 'Employer information' : "Ish beruvchi ma'lumotlari"}
            </h4>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <span className="text-slate-400 block mb-0.5">{language === 'ru' ? 'Юридический статус:' : language === 'en' ? 'Legal status:' : 'Yuridik maqom:'}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{language === 'ru' ? 'Проверенный корпоративный налогоплательщик' : language === 'en' ? 'Verified corporate taxpayer' : "Tasdiqlangan korporativ soliq to'lovchi"}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">{language === 'ru' ? 'Головной офис:' : language === 'en' ? 'Headquarters:' : 'Bosh ofis:'}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{company.location}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">{language === 'ru' ? 'Рейтинг доверия:' : language === 'en' ? 'Trust score:' : 'Ishonchlilik reytingi:'}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{language === 'ru' ? '99.2% Положительно' : language === 'en' ? '99.2% Positive' : '99.2% Ijobiy'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Reviews */}
      {activeTab === 'reviews' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'ru' ? 'Отзывы сотрудников и специалистов' : language === 'en' ? 'Reviews from employees & specialists' : 'Xodimlar va sobiq mutaxassislar fikrlari'}
          </h3>

          <div className="space-y-4">
            {(companyReviews.length > 0 ? companyReviews : [
              { id: '1', author: 'Alisher Q.', role: 'Senior Developer', rating: 5, date: '2026-10-10', text: 'Juda do\'stona jamoa va rivojlanish uchun ajoyib muhit. Barcha va\'dalar bajariladi.' },
              { id: '2', author: 'Ziyoda S.', role: 'HR Menejer', rating: 4.8, date: '2026-09-24', text: 'Ofis qulay, ovqat va tibbiy sug\'urta ta\'minlanadi. Rahbariyat bilan ochiq muloqot.' }
            ]).map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">{rev.author}</h5>
                    <p className="text-xs text-slate-500">{rev.role}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rev.rating}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Apply Modal */}
      <JobApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
      />

    </div>
  );
}
