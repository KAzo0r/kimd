import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  PlusCircle, 
  Briefcase, 
  Users, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Sparkles, 
  FileText, 
  X, 
  ExternalLink,
  DollarSign,
  TrendingUp,
  MapPin,
  Save,
  MessageSquare
} from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useJobStore } from '../store/useJobStore';
import ResumePreview from '../components/resume/ResumePreview';
import { formatSalary, formatTimeAgo, getStatusBadge } from '../utils/helpers';
import { translations, CITIES, CATEGORIES } from '../constants/translations';

export default function EmployerDashboardPage() {
  const { language } = useThemeStore();
  const { user } = useAuthStore();
  const { jobs, addJob, deleteJob, toggleJobFeatured, applications, updateApplicationStatus, companies } = useJobStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const t = translations[language] || translations.uz;

  const initialAction = searchParams.get('action') === 'new' ? 'new_job' : 'candidates';
  const [activeTab, setActiveTab] = useState(initialAction); // 'candidates' | 'my_jobs' | 'new_job' | 'company'
  const [selectedCandidateResume, setSelectedCandidateResume] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // New Job Form State
  const [jobTitle, setJobTitle] = useState("");
  const [jobCategory, setJobCategory] = useState("it");
  const [jobCity, setJobCity] = useState("Toshkent");
  const [salaryMin, setSalaryMin] = useState(15000000);
  const [salaryMax, setSalaryMax] = useState(25000000);
  const [salaryNegotiable, setSalaryNegotiable] = useState(false);
  const [experience, setExperience] = useState("exp1to3");
  const [format, setFormat] = useState("formatFull");
  const [descriptionUz, setDescriptionUz] = useState("");
  const [requirementsInput, setRequirementsInput] = useState("React bo'yicha 2+ yil tajriba\nTypeScript bilimi\nGit bilan ishlash");
  const [benefitsInput, setBenefitsInput] = useState("Tibbiy sug'urta\nMacBook taqdim etiladi\nBepul tushlik");
  const [jobCreatedSuccess, setJobCreatedSuccess] = useState(false);

  // Get current company (default to Uzum or user's company)
  const currentCompany = companies.find(c => c.id === user?.companyId) || companies[0];

  // Applications for this company or all demo apps for employer view
  const companyApplications = applications.filter(a => {
    if (user?.companyId && user.companyId !== 'custom-co') {
      return a.companyId === user.companyId || a.companyId === currentCompany.id;
    }
    return true; // show all for demo employer test
  });

  const filteredApplications = companyApplications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  // Jobs for this company
  const companyJobs = jobs.filter(j => j.companyId === currentCompany.id || j.companyName === currentCompany.name);

  // Total stats
  const totalViews = companyJobs.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalApplicants = companyApplications.length;

  const handleCreateJob = (e) => {
    e.preventDefault();

    const requirements = requirementsInput.split('\n').filter(r => r.trim().length > 0);
    const benefits = benefitsInput.split('\n').filter(b => b.trim().length > 0);

    const newJob = addJob({
      title: jobTitle,
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      category: jobCategory,
      city: jobCity,
      salaryMin: salaryNegotiable ? 0 : Number(salaryMin),
      salaryMax: salaryNegotiable ? 0 : Number(salaryMax),
      salaryNegotiable,
      experience,
      format,
      descriptionUz,
      descriptionRu: descriptionUz,
      requirementsUz: requirements,
      requirementsRu: requirements,
      benefitsUz: benefits,
      benefitsRu: benefits
    });

    // Send Telegram notification to @apexishqidirish_bot
    try {
      import('../utils/telegramService').then(({ notifyNewVacancy }) => {
        notifyNewVacancy(newJob);
      });
    } catch (err) {
      console.warn('Telegram new vacancy notification deferred:', err);
    }

    setJobCreatedSuccess(true);
    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}

    setTimeout(() => {
      setJobCreatedSuccess(false);
      setActiveTab('my_jobs');
    }, 1500);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Top Banner with Employer Brand Info */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 shrink-0 flex items-center justify-center shadow-lg">
            {currentCompany.logo ? (
              <img src={currentCompany.logo} alt={currentCompany.name} className="w-full h-full object-contain rounded-xl" />
            ) : (
              <Building2 className="w-8 h-8 text-blue-600" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                {currentCompany.name}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                HR Panel
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {user?.name || "Sarvar Rustamov"} ({user?.title || "HR Director"})
            </p>
            <p className="text-xs text-slate-400">
              {currentCompany.industryUz || currentCompany.industry} • {currentCompany.location}
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-3 gap-4 border-t sm:border-t-0 sm:border-l border-slate-700 pt-4 sm:pt-0 sm:pl-8 text-center">
          <div>
            <div className="text-2xl font-black text-blue-400">{companyJobs.length}</div>
            <div className="text-xs text-slate-400">Faol vakansiyalar</div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">{totalApplicants}</div>
            <div className="text-xs text-slate-400">Nomzodlar</div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400">{totalViews}</div>
            <div className="text-xs text-slate-400">Ko'rishlar</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 pb-px scrollbar-none">
        
        <button
          onClick={() => setActiveTab('candidates')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'candidates'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Nomzodlar va arizalar</span>
          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] flex items-center justify-center font-bold">
            {companyApplications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('new_job')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'new_job'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Yangi vakansiya</span>
        </button>

        <button
          onClick={() => setActiveTab('my_jobs')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'my_jobs'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Mening vakansiyalarim ({companyJobs.length})</span>
        </button>

      </div>

      {/* TAB 1: Candidates Management Pipeline */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Kelib tushgan rezyumelar va arizalar
              </h2>
              <p className="text-xs text-slate-500">
                Nomzodlar bilan muloqot qiling, rezyumesini ko'ring va arizalar holatini yangilang.
              </p>
            </div>

            {/* Filter by status */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Holat:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="all">Barchasi ({companyApplications.length})</option>
                <option value="applied">Yangi (Topshirilgan)</option>
                <option value="reviewed">Ko'rib chiqilgan</option>
                <option value="interview">Suhbatga chaqirilgan</option>
                <option value="accepted">Qabul qilingan</option>
                <option value="rejected">Rad etilgan</option>
              </select>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Ushbu filtr bo'yicha nomzodlar topilmadi
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApplications.map((app) => {
                const statusInfo = getStatusBadge(app.status, language);

                return (
                  <div
                    key={app.id}
                    className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            {app.applicantName}
                          </h4>
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${statusInfo.color}`}>
                            {statusInfo[language] || statusInfo.uz}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                          Vakansiya: {app.jobTitle}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                          <span>{app.applicantPhone}</span>
                          <span>•</span>
                          <span>{app.applicantEmail}</span>
                          <span>•</span>
                          <span>{app.applicantCity || "Toshkent"}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(app.appliedAt, language)}</span>
                        </div>
                      </div>

                      {/* View Resume Button */}
                      <button
                        onClick={() => setSelectedCandidateResume(app.resumeSnapshot || { fullName: app.applicantName, profession: app.jobTitle, phone: app.applicantPhone, email: app.applicantEmail })}
                        className="px-4 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Rezyumeni ko'rish</span>
                      </button>
                    </div>

                    {/* Cover Letter */}
                    {app.coverLetter && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Nomzod maktubi: </span>
                        {app.coverLetter}
                      </p>
                    )}

                    {/* Change Status Action Toolbar */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-slate-400 font-medium">Holatni o'zgartirish:</span>
                      
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'reviewed', "HR arizani ko'rib chiqdi")}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                            app.status === 'reviewed'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          Ko'rib chiqildi
                        </button>

                        <button
                          onClick={() => updateApplicationStatus(app.id, 'interview', "Suhbat belgilandi: Dushanba 14:00")}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                            app.status === 'interview'
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          Suhbatga chaqirish 🎯
                        </button>

                        <button
                          onClick={() => updateApplicationStatus(app.id, 'accepted', "Tabriklaymiz, jamoamizga xush kelibsiz!")}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                            app.status === 'accepted'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          Qabul qilish 🎉
                        </button>

                        <button
                          onClick={() => updateApplicationStatus(app.id, 'rejected', "Afsuski, bu lavozim bo'yicha boshqa nomzod tanlandi")}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                            app.status === 'rejected'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          Rad etish
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Post New Job Form */}
      {activeTab === 'new_job' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
          <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.createJobTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Vakansiyangizni to'ldiring va O'zbekiston bo'ylab minglab nomzodlarni qabul qiling.
            </p>
          </div>

          {jobCreatedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Vakansiya muvaffaqiyatli e'lon qilindi!</span>
            </div>
          )}

          <form onSubmit={handleCreateJob} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {t.jobTitle} *
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Masalan: Senior React Frontend Developer yoki Bosh Buxgalter"
                className="w-full py-3 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.selectCategory}
                </label>
                <select
                  value={jobCategory}
                  onChange={(e) => setJobCategory(e.target.value)}
                  className="w-full py-3 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameUz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.selectCity}
                </label>
                <select
                  value={jobCity}
                  onChange={(e) => setJobCity(e.target.value)}
                  className="w-full py-3 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Oylik maosh (UZS)
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={salaryNegotiable}
                    onChange={(e) => setSalaryNegotiable(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Kelishilgan holda</span>
                </label>
              </div>

              {!salaryNegotiable && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Minimal maosh (UZS)</label>
                    <input
                      type="number"
                      step="500000"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Maksimal maosh (UZS)</label>
                    <input
                      type="number"
                      step="500000"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Experience & Format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Talab etiladigan tajriba
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full py-3 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="expNo">Tajribasiz (Junior / Boshlang'ich)</option>
                  <option value="exp1to3">1 yildan 3 yilgacha</option>
                  <option value="exp3to6">3 yildan 6 yilgacha</option>
                  <option value="expMore6">6 yildan ortiq</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Ish shakli
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full py-3 px-4 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="formatFull">To'liq kun (Ofis)</option>
                  <option value="formatRemote">Masofaviy (Remote)</option>
                  <option value="formatHybrid">Gibrid (Ofis + Uy)</option>
                  <option value="formatPartTime">Qisman bandlik</option>
                  <option value="formatInternship">Amaliyot (Stajirovka)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Vakansiya haqida batafsil ma'lumot
              </label>
              <textarea
                rows={4}
                required
                value={descriptionUz}
                onChange={(e) => setDescriptionUz(e.target.value)}
                placeholder="Vakansiya bo'yicha asosiy vazifalar, loyihalar va kompaniya takliflari haqida yozing..."
                className="w-full p-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Requirements & Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Talablar (har biri alohida qatorda)
                </label>
                <textarea
                  rows={4}
                  value={requirementsInput}
                  onChange={(e) => setRequirementsInput(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Imtiyozlar va bonuslar (har biri alohida qatorda)
                </label>
                <textarea
                  rows={4}
                  value={benefitsInput}
                  onChange={(e) => setBenefitsInput(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.publishJob}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 3: My Posted Vacancies */}
      {activeTab === 'my_jobs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {currentCompany.name} tomonidan joylashtirilgan vakansiyalar
            </h2>
            <button
              onClick={() => setActiveTab('new_job')}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Yangi vakansiya</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-2 sm:p-4">
            {companyJobs.map((job) => (
              <div
                key={job.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-2xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                    {job.featured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                        VIP
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {formatSalary(job.salaryMin, job.salaryMax, job.salaryNegotiable, language)}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{job.city}</span>
                    <span>•</span>
                    <span>{job.views || 0} {t.views}</span>
                    <span>•</span>
                    <span>{job.applicantsCount || 0} {t.applicants}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleJobFeatured(job.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      job.featured
                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {job.featured ? "VIP faol" : "VIP ga ko'tarish"}
                  </button>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                    title="Ko'rish"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => deleteJob(job.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Resume View Modal */}
      {selectedCandidateResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <button
              onClick={() => setSelectedCandidateResume(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            <ResumePreview resume={selectedCandidateResume} showPrintBtn={true} />
          </div>
        </div>
      )}

    </div>
  );
}
