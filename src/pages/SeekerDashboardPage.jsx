import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  FileText, 
  Briefcase, 
  Heart, 
  Bell, 
  Settings, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  ArrowRight,
  Sparkles,
  Printer,
  ChevronRight
} from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useJobStore } from '../store/useJobStore';
import ResumePreview from '../components/resume/ResumePreview';
import ResumeForm from '../components/resume/ResumeForm';
import JobCard from '../components/common/JobCard';
import { getStatusBadge, formatTimeAgo } from '../utils/helpers';
import { translations } from '../constants/translations';

export default function SeekerDashboardPage() {
  const { language } = useThemeStore();
  const { user, updateUser } = useAuthStore();
  const { 
    resume, 
    applications, 
    favorites, 
    jobs, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    deleteNotification 
  } = useJobStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const t = translations[language] || translations.uz;

  const initialTab = searchParams.get('tab') || 'resume';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [resumeMode, setResumeMode] = useState('preview'); // 'preview' | 'edit'

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['resume', 'applications', 'saved', 'notifications', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Saved jobs list
  const savedJobsList = jobs.filter((j) => favorites.includes(j.id));

  // User applications
  const userApplications = applications;

  // Settings form local state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [profileCity, setProfileCity] = useState(user?.city || "");
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUser({
      name: profileName,
      phone: profilePhone,
      city: profileCity
    });
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Top Welcome Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt={user?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {user?.name || "Javohir Karimov"}
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                {t.roleSeeker}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
              {resume?.profession || "Frontend Developer"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.email} • {user?.phone || "+998 90 123 45 67"}
            </p>
          </div>
        </div>

        {/* Quick metrics */}
        <div className="grid grid-cols-3 gap-3 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6 text-center">
          <div className="px-2">
            <div className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {userApplications.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Arizalar</div>
          </div>
          <div className="px-2">
            <div className="text-xl sm:text-2xl font-extrabold text-rose-500">
              {favorites.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Saqlangan</div>
          </div>
          <div className="px-2">
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-500">
              {notifications.filter(n => n.unread).length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Yangi xabar</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 pb-px scrollbar-none">
        
        <button
          onClick={() => handleTabChange('resume')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'resume'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.tabResume}</span>
        </button>

        <button
          onClick={() => handleTabChange('applications')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'applications'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{t.tabApplications}</span>
          <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] flex items-center justify-center font-bold">
            {userApplications.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('saved')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'saved'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{t.tabSaved}</span>
          {favorites.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 text-[10px] flex items-center justify-center font-bold">
              {favorites.length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('notifications')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>{t.tabNotifications}</span>
          {notifications.filter(n => n.unread).length > 0 && (
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-[10px] flex items-center justify-center font-bold">
              {notifications.filter(n => n.unread).length}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('settings')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t.tabSettings}</span>
        </button>

      </div>

      {/* Tab 1: Resume Builder / Preview */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setResumeMode('preview')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  resumeMode === 'preview'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Ko'rib chiqish (PDF ko'rinish)
              </button>
              <button
                onClick={() => setResumeMode('edit')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  resumeMode === 'edit'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Tahrirlash (Konstruktor)
              </button>
            </div>
          </div>

          {resumeMode === 'preview' ? (
            <ResumePreview
              resume={resume}
              onEditClick={() => setResumeMode('edit')}
            />
          ) : (
            <ResumeForm
              onSaved={() => setResumeMode('preview')}
            />
          )}
        </div>
      )}

      {/* Tab 2: Applications Tracker */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Yuborilgan barcha arizalar tarixi
            </h3>
            <span className="text-xs text-slate-500">
              Jami {userApplications.length} ta ariza
            </span>
          </div>

          {userApplications.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Siz hali biron bir vakansiyaga ariza yubormadingiz
              </p>
              <Link
                to="/jobs"
                className="inline-block px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl"
              >
                Vakansiyalarni ko'rish
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userApplications.map((app) => {
                const statusInfo = getStatusBadge(app.status, language);

                return (
                  <div
                    key={app.id}
                    className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block mb-0.5">
                          {app.companyName}
                        </span>
                        <Link
                          to={`/jobs/${app.jobId}`}
                          className="text-base sm:text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors"
                        >
                          {app.jobTitle}
                        </Link>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${statusInfo.color}`}>
                          {statusInfo[language] || statusInfo.uz}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatTimeAgo(app.appliedAt, language)}
                        </span>
                      </div>
                    </div>

                    {app.coverLetter && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Kuzatuv xati: </span>
                        {app.coverLetter}
                      </p>
                    )}

                    {app.notes && (
                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 text-xs text-purple-800 dark:text-purple-300 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 text-purple-600 mt-0.5" />
                        <div>
                          <span className="font-bold">Ish beruvchi xabari: </span>
                          <span>{app.notes}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Vacancies */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.savedJobs} ({savedJobsList.length})
            </h3>
          </div>

          {savedJobsList.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Saqlangan vakansiyalar mavjud emas
              </p>
              <Link
                to="/jobs"
                className="inline-block px-5 py-2.5 bg-blue-600 text-white font-semibold text-xs rounded-xl"
              >
                Vakansiyalarni ko'rish
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedJobsList.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.notifications}
            </h3>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Barchasini o'qilgan deb belgilash
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`py-4 flex items-start justify-between gap-4 transition-colors ${
                  notif.unread ? 'bg-blue-50/40 dark:bg-blue-950/20 px-3 rounded-2xl' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {notif.title}
                    </span>
                    {notif.unread && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    {formatTimeAgo(notif.date, language)}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-xl mx-auto space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Profil sozlamalari
          </h3>

          {profileSavedMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold">
              Profil ma'lumotlari muvaffaqiyatli yangilandi!
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ism va familiya
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telefon raqam
              </label>
              <input
                type="text"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shahar
              </label>
              <input
                type="text"
                value={profileCity}
                onChange={(e) => setProfileCity(e.target.value)}
                className="w-full py-2.5 px-3.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors"
            >
              O'zgarishlarni saqlash
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
