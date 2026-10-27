import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Sparkles, 
  Eye, 
  BarChart3, 
  Search,
  Filter,
  Bot,
  Send,
  Image as ImageIcon,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  ShoppingBag,
  Camera,
  CheckCircle,
  Clock,
  Package,
  Database,
  Key
} from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useJobStore } from '../store/useJobStore';
import { useOrderStore } from '../store/useOrderStore';
import { formatSalary } from '../utils/helpers';
import { translations } from '../constants/translations';
import { checkBotConnection, sendTestTextMessage, sendTestPhotoMessage, notifyNewOrder } from '../utils/telegramService';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';

export default function AdminPage() {
  const { language } = useThemeStore();
  const { jobs, companies, applications, deleteJob, toggleJobFeatured } = useJobStore();
  const { orders, updateOrderStatus } = useOrderStore();
  const t = translations[language] || translations.uz;

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'jobs' | 'companies' | 'users' | 'orders' | 'telegram' | 'supabase'
  const [jobSearch, setJobSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [resendingOrderId, setResendingOrderId] = useState(null);

  // Telegram bot state
  const [botCheckLoading, setBotCheckLoading] = useState(false);
  const [botCheckResult, setBotCheckResult] = useState(null);
  const [testSendLoading, setTestSendLoading] = useState(false);
  const [testSendResult, setTestSendResult] = useState(null);
  const [testPhotoLoading, setTestPhotoLoading] = useState(false);
  const [testPhotoResult, setTestPhotoResult] = useState(null);

  // Demo users list for Admin view
  const [userList, setUserList] = useState([
    { id: "u-1", name: "Javohir Karimov", email: "javohir@ishtop.uz", role: "seeker", status: "active", registered: "2026-10-15" },
    { id: "u-2", name: "Sarvar Rustamov", email: "hr@uzum.uz", role: "employer", company: "Uzum Group", status: "active", registered: "2026-09-20" },
    { id: "u-3", name: "Alisher Yusupov", email: "admin@ishtop.uz", role: "admin", status: "active", registered: "2026-08-01" },
    { id: "u-4", name: "Nodira Rahimova", email: "nodira@payme.uz", role: "employer", company: "Payme", status: "active", registered: "2026-10-02" },
    { id: "u-5", name: "Dilshod Saidov", email: "dilshod.s@mail.uz", role: "seeker", status: "active", registered: "2026-10-18" },
    { id: "u-6", name: "Malika Karimova", email: "malika@tbcbank.uz", role: "employer", company: "TBC Bank", status: "active", registered: "2026-09-12" }
  ]);

  const toggleUserStatus = (userId) => {
    setUserList(prev => prev.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
    ));
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(jobSearch.toLowerCase()) || 
    j.companyName.toLowerCase().includes(jobSearch.toLowerCase())
  );

  // Industry chart statistics
  const industryStats = [
    { name: "IT va Dasturlash", count: 24, percent: "46%", color: "bg-blue-600" },
    { name: "Moliya va Bank", count: 18, percent: "35%", color: "bg-emerald-500" },
    { name: "Chakana savdo", count: 20, percent: "38%", color: "bg-amber-500" },
    { name: "Marketing va SMM", count: 14, percent: "27%", color: "bg-purple-600" },
    { name: "Qurilish va Develompent", count: 10, percent: "19%", color: "bg-rose-500" },
  ];

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t.adminDashboard}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
              Super Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            IshTop.uz milliy mehnat bozorining markaziy boshqaruv va tahlil tizimi
          </p>
        </div>

        {/* System Health */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Server holati: 100% Barqaror</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 pb-px scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistika va Tahlil</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'jobs'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Vakansiyalar ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'companies'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Kompaniyalar ({companies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'users'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Foydalanuvchilar ({userList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-300" />
          <span>Xaridlar & Buyurtmalar ({orders.length})</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300">
            Foto bilan
          </span>
        </button>

        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'telegram'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Telegram Bot (@apexishqidirish_bot)</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'supabase'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Supabase Baza</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </button>
      </div>

      {/* TAB 1: Overview & Charts */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          
          {/* Key Counter Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{jobs.length}</div>
              <p className="text-xs text-slate-500 font-medium">Faol e'lon qilingan vakansiyalar</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{companies.length}</div>
              <p className="text-xs text-slate-500 font-medium">Ro'yxatdan o'tgan kompaniyalar</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">1,480+</div>
              <p className="text-xs text-slate-500 font-medium">Jami ro'yxatdan o'tgan nomzodlar</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{applications.length + 120}</div>
              <p className="text-xs text-slate-500 font-medium">Muvaffaqiyatli topshirilgan arizalar</p>
            </div>

          </div>

          {/* Graphical Analytics Component */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Visual Bar Graph: Jobs by Category */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  O'zbekistonda sohalar bo'yicha talab tahlili
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Eng ko'p vakansiyalar e'lon qilinayotgan asosiy yo'nalishlar
                </p>
              </div>

              <div className="space-y-4">
                {industryStats.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{item.name}</span>
                      <span>{item.count} ta ({item.percent})</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: item.percent }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Activity Feed */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Platformadagi so'nggi harakatlar
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white">Uzum Group yangi vakansiya joylashtirdi</p>
                    <p className="text-slate-500">"Senior React Developer" • 35 000 000 UZS</p>
                  </div>
                  <span className="text-[10px] text-slate-400">5 daqiqa oldin</span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white">Yangi nomzod ariza topshirdi</p>
                    <p className="text-slate-500">Javohir K. → CLICK Uzbekistan</p>
                  </div>
                  <span className="text-[10px] text-slate-400">12 daqiqa oldin</span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white">TBC Bank nomzodni suhbatga chaqirdi</p>
                    <p className="text-slate-500">QA Automation vakansiyasi bo'yicha</p>
                  </div>
                  <span className="text-[10px] text-slate-400">1 soat oldin</span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900 dark:text-white">Yangi kompaniya verifikatsiyadan o'tdi</p>
                    <p className="text-slate-500">Yandex Uzbekistan • Toshkent</p>
                  </div>
                  <span className="text-[10px] text-slate-400">3 soat oldin</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: Vacancies Moderation */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                placeholder="Vakansiya yoki kompaniyani qidirish..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>

            <span className="text-xs text-slate-500 font-semibold">
              {filteredJobs.length} ta vakansiya ko'rsatilmoqda
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Vakansiya nomi</th>
                    <th className="py-3.5 px-4 font-bold">Kompaniya</th>
                    <th className="py-3.5 px-4 font-bold">Shahar</th>
                    <th className="py-3.5 px-4 font-bold">Maosh</th>
                    <th className="py-3.5 px-4 font-bold">Holat</th>
                    <th className="py-3.5 px-4 font-bold text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <Link to={`/jobs/${job.id}`} className="hover:text-blue-600">
                          {job.title}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">{job.companyName}</td>
                      <td className="py-3.5 px-4">{job.city}</td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-600">
                        {formatSalary(job.salaryMin, job.salaryMax, job.salaryNegotiable, language)}
                      </td>
                      <td className="py-3.5 px-4">
                        {job.featured ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">VIP</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">Standart</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => toggleJobFeatured(job.id)}
                          className="text-xs text-amber-600 hover:underline font-semibold"
                        >
                          {job.featured ? "VIPdan olish" : "VIP qilish"}
                        </button>
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="text-xs text-rose-600 hover:underline font-semibold"
                        >
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Companies Management */}
      {activeTab === 'companies' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Kompaniya</th>
                  <th className="py-3.5 px-4 font-bold">Yo'nalish</th>
                  <th className="py-3.5 px-4 font-bold">Shahar</th>
                  <th className="py-3.5 px-4 font-bold">Xodimlar</th>
                  <th className="py-3.5 px-4 font-bold">Reyting</th>
                  <th className="py-3.5 px-4 font-bold">Verifikatsiya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {companies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Link to={`/companies/${c.slug || c.id}`} className="hover:text-blue-600">
                        {c.name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">{c.industryUz || c.industry}</td>
                    <td className="py-3.5 px-4">{c.location}</td>
                    <td className="py-3.5 px-4">{c.employees}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-500">★ {c.rating}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tasdiqlangan</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Foydalanuvchi</th>
                  <th className="py-3.5 px-4 font-bold">Email</th>
                  <th className="py-3.5 px-4 font-bold">Rol</th>
                  <th className="py-3.5 px-4 font-bold">Ro'yxatdan o'tgan</th>
                  <th className="py-3.5 px-4 font-bold">Holat</th>
                  <th className="py-3.5 px-4 font-bold text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {userList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="py-3.5 px-4">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">{u.registered}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {u.status === 'active' ? 'Faol' : 'Bloklangan'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`text-xs font-semibold ${
                          u.status === 'active' ? 'text-rose-600 hover:underline' : 'text-emerald-600 hover:underline'
                        }`}
                      >
                        {u.status === 'active' ? 'Bloklash' : 'Faollashtirish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4.5: Orders & Product Purchases with Photos */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Top Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Xaridor ismi, telefon yoki ID bo'yicha..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <Camera className="w-3.5 h-3.5" />
                <span>Barcha xaridlar fotosurat bilan saqlanadi</span>
              </span>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">Buyurtma ID</th>
                    <th className="py-3.5 px-4 font-bold">Xaridor</th>
                    <th className="py-3.5 px-4 font-bold">Xarid qilingan tovarlar</th>
                    <th className="py-3.5 px-4 font-bold">To'lov cheki fotosurati (Majburiy)</th>
                    <th className="py-3.5 px-4 font-bold">Jami summa</th>
                    <th className="py-3.5 px-4 font-bold">Holat</th>
                    <th className="py-3.5 px-4 font-bold text-right">Telegram</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {orders
                    .filter(o => 
                      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                      o.customerPhone.includes(orderSearch)
                    )
                    .map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                          #{o.id}
                          <div className="text-[10px] font-normal text-slate-400">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{o.customerName}</div>
                          <a href={`tel:${o.customerPhone}`} className="text-[11px] text-blue-600 hover:underline">
                            {o.customerPhone}
                          </a>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          {o.items?.map((it, idx) => (
                            <div key={idx} className="text-xs truncate">
                              • <b>{it.name}</b> x{it.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="py-3.5 px-4">
                          {o.receiptPhoto ? (
                            <button
                              type="button"
                              onClick={() => setPreviewPhoto(o.receiptPhoto)}
                              className="group relative flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 transition-all text-left"
                              title="To'lov cheki fotosuratini to'liq ko'rish"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-300 dark:border-slate-600">
                                <img
                                  src={o.receiptPhoto}
                                  alt="To'lov cheki"
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                              </div>
                              <div className="text-[10px]">
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <Camera className="w-3 h-3" />
                                  <span>Foto biriktirilgan</span>
                                </span>
                                <span className="text-slate-400 group-hover:underline">Kattalashtirish</span>
                              </div>
                            </button>
                          ) : (
                            <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Foto mavjud emas</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">
                          {(o.total || 0).toLocaleString()} UZS
                          <div className="text-[10px] font-normal uppercase text-slate-400">
                            {o.paymentMethod || 'Payme'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
                          >
                            <option value="pending">🟡 Kutilmoqda</option>
                            <option value="processing">🔵 Jarayonda</option>
                            <option value="shipped">🚚 Yetkazilmoqda</option>
                            <option value="delivered">🟢 Yetkazildi</option>
                            <option value="cancelled">🔴 Bekor qilindi</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            disabled={resendingOrderId === o.id}
                            onClick={async () => {
                              setResendingOrderId(o.id);
                              try {
                                const res = await notifyNewOrder(o);
                                if (res.ok) {
                                  alert(`Buyurtma #${o.id} va to'lov fotosurati @apexishqidirish_bot ga muvaffaqiyatli yuborildi!`);
                                } else {
                                  alert(`Xatolik: ${res.error || "Telegramda @apexishqidirish_bot ga kirib /start bosing."}`);
                                }
                              } catch (err) {
                                alert(`Xatolik: ${err.message}`);
                              } finally {
                                setResendingOrderId(null);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-[11px] transition-all shadow-sm active:scale-95 disabled:opacity-50"
                          >
                            <Send className="w-3 h-3" />
                            <span>{resendingOrderId === o.id ? 'Yuborilmoqda...' : 'Botga yuborish'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lightbox Modal for Photo Preview */}
          {previewPhoto && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
              onClick={() => setPreviewPhoto(null)}
            >
              <div 
                className="relative max-w-2xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-white">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>To'lov cheki fotosurati (Haqiqiy tasdiqnoma)</span>
                  </div>
                  <button
                    onClick={() => setPreviewPhoto(null)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                  >
                    Yopish ✕
                  </button>
                </div>
                <div className="max-h-[70vh] flex items-center justify-center bg-black/50 rounded-2xl overflow-hidden">
                  <img src={previewPhoto} alt="Chek to'liq hajmi" className="max-h-[65vh] w-auto object-contain" />
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 5: Telegram Bot Integration */}
      {activeTab === 'telegram' && (
        <div className="space-y-6">
          {/* Bot Overview Card */}
          <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-sky-800/40 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
                  <Bot className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black">@apexishqidirish_bot</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      Uланган (Active)
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-sky-200/80 mt-1">
                    IshTop.uz vakansiyalari va arizalarini real-vaqt rejimida qabul qiluvchi rasmiy Telegram boti
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Admin Chat ID: <span className="font-mono text-white bg-slate-800/80 px-2 py-0.5 rounded">799910176</span> • Token: <span className="font-mono text-sky-300">879345...UyY</span> (maxfiy saqlanmoqda)
                  </p>
                </div>
              </div>

              <a
                href="https://t.me/apexishqidirish_bot"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-sky-500/30 shrink-0"
              >
                <span>Telegramda ochish</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Diagnostic & Testing Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tool 1: Check Bot Connection */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 flex items-center justify-center">
                  <RefreshCw className={`w-5 h-5 ${botCheckLoading ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Bot Ulanishini Tekshirish</h3>
                  <p className="text-xs text-slate-500">getMe API so'rovi</p>
                </div>
              </div>

              <button
                onClick={async () => {
                  setBotCheckLoading(true);
                  setBotCheckResult(null);
                  try {
                    const res = await checkBotConnection();
                    setBotCheckResult(res);
                  } catch (e) {
                    setBotCheckResult({ ok: false, error: e.message });
                  } finally {
                    setBotCheckLoading(false);
                  }
                }}
                disabled={botCheckLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                {botCheckLoading ? 'Tekshirilmoqda...' : 'Ulanishni tekshirish'}
              </button>

              {botCheckResult && (
                <div className={`p-3 rounded-xl text-xs ${botCheckResult.ok ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'}`}>
                  {botCheckResult.ok ? (
                    <div>
                      <p className="font-bold">✓ Bot muvaffaqiyatli aniqlandi!</p>
                      <p className="mt-1">Nomi: {botCheckResult.bot?.first_name}</p>
                      <p>Username: @{botCheckResult.bot?.username}</p>
                    </div>
                  ) : (
                    <p>Xatolik: {botCheckResult.error}</p>
                  )}
                </div>
              )}
            </div>

            {/* Tool 2: Send Test Message */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Test Xabar Yuborish</h3>
                  <p className="text-xs text-slate-500">Admin chatiga matnli bildirishnoma</p>
                </div>
              </div>

              <button
                onClick={async () => {
                  setTestSendLoading(true);
                  setTestSendResult(null);
                  try {
                    const res = await sendTestTextMessage();
                    setTestSendResult(res);
                  } catch (e) {
                    setTestSendResult({ ok: false, error: e.message });
                  } finally {
                    setTestSendLoading(false);
                  }
                }}
                disabled={testSendLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
              >
                {testSendLoading ? 'Yuborilmoqda...' : 'Matnli xabar yuborish'}
              </button>

              {testSendResult && (
                <div className={`p-3 rounded-xl text-xs ${testSendResult.ok ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800'}`}>
                  {testSendResult.ok ? (
                    <p className="font-bold">✓ Test xabari Telegramingizga yuborildi!</p>
                  ) : (
                    <div>
                      <p className="font-bold">Eslatma:</p>
                      <p className="mt-1">{testSendResult.error || "Telegramda @apexishqidirish_bot ga kirib /start tugmasini bosing."}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tool 3: Send Photo Alert */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Suratli Test Yuborish</h3>
                  <p className="text-xs text-slate-500">IshTop.uz brendi surati bilan</p>
                </div>
              </div>

              <button
                onClick={async () => {
                  setTestPhotoLoading(true);
                  setTestPhotoResult(null);
                  try {
                    const res = await sendTestPhotoMessage('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&auto=format&fit=crop&q=80');
                    setTestPhotoResult(res);
                  } catch (e) {
                    setTestPhotoResult({ ok: false, error: e.message });
                  } finally {
                    setTestPhotoLoading(false);
                  }
                }}
                disabled={testPhotoLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-600/20"
              >
                {testPhotoLoading ? 'Yuborilmoqda...' : 'Suratli xabar yuborish'}
              </button>

              {testPhotoResult && (
                <div className={`p-3 rounded-xl text-xs ${testPhotoResult.ok ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800'}`}>
                  {testPhotoResult.ok ? (
                    <p className="font-bold">✓ Suratli xabar Telegramingizga yuborildi!</p>
                  ) : (
                    <div>
                      <p className="font-bold">Eslatma:</p>
                      <p className="mt-1">{testPhotoResult.error || "Telegramda @apexishqidirish_bot ga kirib /start tugmasini bosing."}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Automated Telegram Events Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Avtomatlashtirilgan Telegram Hodisalari (Live Events)
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">📩 Yangi Nomzod Arizasi (Job Application)</span>
                  <p className="text-[11px] text-slate-500">Nomzod ishga ariza topshirganda: Ismi, telefoni, rezyume ma'lumotlari va qiziqqan vakansiyasi admin botga yuboriladi.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  Faol
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">📢 Yangi Vakansiya E'lon Qilindi (New Vacancy)</span>
                  <p className="text-[11px] text-slate-500">Ish beruvchi yangi vakansiya kiritganda uning barcha tafsilotlari va taklif etilayotgan maoshi bilan botga yuboriladi.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  Faol
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">👤 Yangi Ro'yxatdan O'tish (New User Registration)</span>
                  <p className="text-[11px] text-slate-500">Yangi ish qidiruvchi yoki ish beruvchi ro'yxatdan o'tganda xavfsizlik va nazorat uchun bildirishnoma uzatiladi.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  Faol
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Supabase Cloud Database Integration */}
      {activeTab === 'supabase' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Supabase Status Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/50 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span>Supabase PostgreSQL Integration</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Kalitlar kiritildi
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Bulutli ma'lumotlar bazasi, buyurtmalar va vakansiyalar arxivini boshqarish
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isSupabaseConfigured() ? 'Ulangan (Online)' : 'URL kutilmoqda'}</span>
              </div>
            </div>
          </div>

          {/* Keys Overview Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Key className="w-4 h-4 text-emerald-500" />
                <span>Publishable API Key (Client)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 font-mono text-xs text-slate-800 dark:text-slate-200 break-all border border-slate-200 dark:border-slate-700">
                {import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? "sb_publishable_•••••••• (Faol ulangan)" : "O'rnatilgan (.env)"}
              </div>
              <p className="text-[11px] text-slate-500">
                Frontend (brauzer) orqali xavfsiz so'rovlar yuborish uchun ochiq kalit.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Key className="w-4 h-4 text-amber-500" />
                <span>Secret API Key (Backend)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 font-mono text-xs text-slate-800 dark:text-slate-200 break-all border border-slate-200 dark:border-slate-700">
                sb_secret_••••••••••••••••••••••••••••••••
              </div>
              <p className="text-[11px] text-slate-500">
                Maxfiy ma'muriy kalit. Server va Vercel Environment Variables orqali himoyalangan.
              </p>
            </div>
          </div>

          {/* Quick SQL Tables Setup */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Supabase Jadvallar Strukturasi (SQL Schema)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ushbu SQL kodini Supabase boshqaruv panelidagi <b>SQL Editor</b> bo'limiga kiritib <b>Run</b> tugmasini bosing:
                </p>
              </div>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-72">
{`-- 1. Buyurtmalar jadvali (Orders)
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_region TEXT,
  delivery_address TEXT,
  delivery_type TEXT,
  payment_method TEXT,
  receipt_photo TEXT,
  total_amount NUMERIC,
  items JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ish arizalari jadvali (Applications)
CREATE TABLE IF NOT EXISTS applications (
  id BIGSERIAL PRIMARY KEY,
  job_id TEXT,
  job_title TEXT,
  company_name TEXT,
  applicant_name TEXT,
  applicant_email TEXT,
  applicant_phone TEXT,
  applicant_city TEXT,
  cover_letter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>
          </div>

        </div>
      )}

    </div>
  );
}

