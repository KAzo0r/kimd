import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  Heart, 
  Bell, 
  Sun, 
  Moon, 
  Globe, 
  User, 
  PlusCircle, 
  Menu, 
  X, 
  Check, 
  ShieldCheck, 
  Building2, 
  FileText,
  LogOut,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useJobStore } from '../../store/useJobStore';
import { useCartStore } from '../../store/useCartStore';
import { translations } from '../../constants/translations';

export default function Navbar() {
  const { theme, toggleTheme, language, setLanguage } = useThemeStore();
  const { user, isAuthenticated, logout, quickDemoLogin } = useAuthStore();
  const { favorites, notifications, markNotificationRead, markAllNotificationsRead } = useJobStore();
  const { items: cartItems } = useCartStore();
  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const t = translations[language] || translations.uz;
  const navigate = useNavigate();
  const location = useLocation();

  const unreadNotifsCount = notifications.filter(n => n.unread).length;

  const isActive = (path) => location.pathname === path;

  const languages = [
    { code: 'uz', label: "O'zbekcha", flag: "🇺🇿" },
    { code: 'ru', label: "Русский", flag: "🇷🇺" },
    { code: 'en', label: "English", flag: "🇬🇧" }
  ];

  const handleRoleSwitch = (role) => {
    quickDemoLogin(role);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    if (role === 'seeker') navigate('/dashboard');
    else if (role === 'employer') navigate('/employer');
    else if (role === 'admin') navigate('/admin');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
                    IshTop<span className="text-blue-600 dark:text-blue-400">.uz</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-md">
                    UZ
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline -mt-0.5">
                  {language === 'ru' ? 'Портал вакансий и электроники' : language === 'en' ? 'Jobs & Electronics Portal' : 'Ish va xodimlar portali'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                to="/jobs" 
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/jobs')
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {t.jobs}
              </Link>
              <Link 
                to="/companies" 
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/companies')
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {t.companies}
              </Link>
              <Link 
                to="/shop" 
                className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                  isActive('/shop')
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-emerald-500" />
                <span>{t.navShop || t.shop || "Do'kon"}</span>
              </Link>
              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                    isActive('/admin')
                      ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  {t.adminPanel}
                </Link>
              )}
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors"
                title="Tilni tanlash / Выбор языка"
              >
                <span>{languages.find(l => l.code === language)?.flag}</span>
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 animate-fade-in"
                  onClick={() => setLangDropdownOpen(false)}
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                        language === l.code ? 'text-blue-600 font-semibold dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? t.lightTheme : t.darkTheme}
              aria-label={t.toggleTheme}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Shopping Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center"
              title="Xarid savati / Корзина"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Favorites Icon */}
            <Link
              to="/dashboard?tab=saved"
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex"
              title={t.savedJobs}
            >
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={t.notifications}
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-fade-in">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {t.notifications}
                    </span>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-blue-600 hover:underline dark:text-blue-400 font-medium"
                      >
                        {language === 'ru' ? 'Отметить все прочитанными' : language === 'en' ? 'Mark all as read' : "Barchasini o'qilgan deb belgilash"}
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        {language === 'ru' ? 'Новых уведомлений пока нет' : language === 'en' ? 'No new notifications yet' : "Hozircha yangi bildirishnomalar yo'q"}
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            markNotificationRead(item.id);
                            setNotifDropdownOpen(false);
                            if (item.link) navigate(item.link);
                          }}
                          className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                            item.unread ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                              {item.title}
                            </span>
                            {item.unread && (
                              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                            {item.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                    <Link
                      to="/dashboard?tab=notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Barcha bildirishnomalarni ko'rish
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Post Job button for Employers */}
            <Link
              to="/employer?action=new"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all shadow-emerald-600/20 hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.postJob}</span>
            </Link>

            {/* User Profile or Login */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-white dark:border-slate-900"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate hidden md:inline">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{language === 'ru' ? 'Текущий профиль:' : language === 'en' ? 'Signed in as:' : 'Kirilgan profil:'}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                          {user.role === 'seeker' ? t.roleSeeker : user.role === 'employer' ? t.roleEmployer : t.roleAdmin}
                        </span>
                        {user.companyName && (
                          <span className="text-xs text-slate-500 truncate">
                            {user.companyName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      {user.role === 'seeker' && (
                        <>
                          <Link
                            to="/dashboard?tab=resume"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <FileText className="w-4 h-4 text-blue-500" />
                            {t.myResume}
                          </Link>
                          <Link
                            to="/dashboard?tab=applications"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <Briefcase className="w-4 h-4 text-emerald-500" />
                            {t.myApplications}
                          </Link>
                          <Link
                            to="/dashboard?tab=saved"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <Heart className="w-4 h-4 text-rose-500" />
                            {t.savedJobs}
                          </Link>
                        </>
                      )}

                      {user.role === 'employer' && (
                        <>
                          <Link
                            to="/employer"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <Building2 className="w-4 h-4 text-blue-500" />
                            {t.employerCabinet}
                          </Link>
                          <Link
                            to="/employer?action=new"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <PlusCircle className="w-4 h-4 text-emerald-500" />
                            {t.postJob}
                          </Link>
                        </>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <ShieldCheck className="w-4 h-4 text-indigo-500" />
                          {t.adminDashboard}
                        </Link>
                      )}
                    </div>

                    {/* Role switcher inside dropdown for pair programming convenience */}
                    <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                        {t.quickDemoLogin}
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => handleRoleSwitch('seeker')}
                          className={`px-2 py-1 text-[11px] font-medium rounded ${
                            user.role === 'seeker'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {t.demoSeekerBtn || (language === 'ru' ? 'Соискатель' : 'Izlovchi')}
                        </button>
                        <button
                          onClick={() => handleRoleSwitch('employer')}
                          className={`px-2 py-1 text-[11px] font-medium rounded ${
                            user.role === 'employer'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {t.demoEmployerBtn || (language === 'ru' ? 'Работодатель' : 'Ish beruvchi')}
                        </button>
                        <button
                          onClick={() => handleRoleSwitch('admin')}
                          className={`px-2 py-1 text-[11px] font-medium rounded ${
                            user.role === 'admin'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {t.demoAdminBtn || 'Admin'}
                        </button>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/auth');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth?mode=login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t.login}
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  {t.register}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <div className="grid grid-cols-3 gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>{t.jobs}</span>
            </Link>
            <Link
              to="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>{t.companies}</span>
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-500" />
              <span>{t.navShop || t.shop || "Do'kon"}</span>
            </Link>
          </div>

          {/* Quick Cabinets */}
          <div className="space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                {t.seekerCabinet}
              </span>
              <span className="text-xs text-slate-400">{language === 'ru' ? 'Резюме и Отклики' : language === 'en' ? 'CV & Applications' : 'Rezyume & Arizalar'}</span>
            </Link>
            <Link
              to="/employer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-500" />
                {t.employerCabinet}
              </span>
              <span className="text-xs text-slate-400">{language === 'ru' ? 'Кандидаты' : language === 'en' ? 'Candidates' : 'Nomzodlar'}</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                {t.adminPanel}
              </span>
              <span className="text-xs text-slate-400">{language === 'ru' ? 'Управление' : language === 'en' ? 'Management' : 'Boshqaruv'}</span>
            </Link>
          </div>

          {/* Post Job button for mobile */}
          <Link
            to="/employer?action=new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            {t.postJob}
          </Link>
        </div>
      )}
    </header>
  );
}
