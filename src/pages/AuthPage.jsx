import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Briefcase, 
  User, 
  Building2, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Eye, 
  EyeOff,
  Phone,
  Send,
  Key,
  Shield,
  RotateCcw,
  CheckCircle
} from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { translations } from '../constants/translations';
import { sendTelegramAuthCode } from '../utils/telegramService';

export default function AuthPage() {
  const { language } = useThemeStore();
  const { login, register, loginWithPhone, quickDemoLogin } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const t = translations[language] || translations.uz;

  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'seeker';

  // Auth method: 'phone' | 'email' | 'admin'
  const [authMethod, setAuthMethod] = useState('phone');
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [role, setRole] = useState(initialRole); // 'seeker' | 'employer'
  const [showPassword, setShowPassword] = useState(false);

  // Phone auth state
  const [phone, setPhone] = useState('+998 ');
  const [phoneStep, setPhoneStep] = useState('input'); // 'input' | 'verify'
  const [phoneCode, setPhoneCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Admin dedicated fields
  const [adminEmail, setAdminEmail] = useState('admin@gmail.com');
  const [adminPassword, setAdminPassword] = useState('admin');

  // Timer countdown effect for resending code
  useEffect(() => {
    let timer;
    if (codeCountdown > 0) {
      timer = setTimeout(() => setCodeCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [codeCountdown]);

  // Request code via Telegram
  const handleRequestTelegramCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanPhone = phone.trim();
    if (cleanPhone.length < 10) {
      setError(language === 'ru' 
        ? 'Пожалуйста, введите корректный номер телефона (например, +998 90 123 45 67)' 
        : "Iltimos, to'liq telefon raqamingizni kiriting (+998 90 123 45 67)");
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError(language === 'ru' ? 'Введите ваше имя' : "Iltimos, ismingizni kiriting");
      return;
    }

    if (mode === 'register' && role === 'employer' && !companyName.trim()) {
      setError(language === 'ru' ? 'Введите название компании' : "Iltimos, kompaniya nomini kiriting");
      return;
    }

    setIsSendingCode(true);

    // Generate random 4-digit code
    const generated = Math.floor(1000 + Math.random() * 9000).toString();
    setSentCode(generated);

    try {
      await sendTelegramAuthCode(cleanPhone, generated);
      setPhoneStep('verify');
      setCodeCountdown(60);
      setSuccessMsg(language === 'ru'
        ? `Код подтверждения отправлен в Telegram бот @apexishqidirish_bot`
        : `Tasdiqlash kodi Telegram (@apexishqidirish_bot) orqali yuborildi!`);
    } catch (err) {
      console.warn('Telegram send code error:', err);
      // Still proceed to verify step so user is never blocked
      setPhoneStep('verify');
      setCodeCountdown(60);
    } finally {
      setIsSendingCode(false);
    }
  };

  // Verify phone code and log in
  const handleVerifyPhoneCode = (e) => {
    e.preventDefault();
    setError('');

    if (phoneCode.trim() !== sentCode.trim()) {
      setError(language === 'ru' 
        ? 'Неверный код подтверждения. Попробуйте еще раз.' 
        : "Noto'g'ri tasdiqlash kodi kiritildi. Qaytadan urinib ko'ring.");
      return;
    }

    // Successfully verified!
    const res = loginWithPhone({
      phone,
      name: name.trim() || 'Foydalanuvchi',
      role,
      companyName: companyName.trim()
    });

    if (res.role === 'admin') {
      navigate('/admin');
    } else if (res.role === 'employer') {
      navigate('/employer');
    } else {
      navigate('/dashboard');
    }
  };

  // Email form submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(language === 'ru' ? 'Заполните обязательные поля' : "Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    if (mode === 'register') {
      if (!name) {
        setError(language === 'ru' ? 'Введите ваше имя' : "Iltimos, ismingizni kiriting.");
        return;
      }
      if (role === 'employer' && !companyName) {
        setError(language === 'ru' ? 'Введите название компании' : "Iltimos, kompaniya nomini kiriting.");
        return;
      }
      if (password !== passwordConfirm) {
        setError(language === 'ru' ? 'Пароли не совпадают' : "Parollar bir-biriga mos kelmadi.");
        return;
      }
      if (password.length < 5) {
        setError(language === 'ru' ? 'Пароль слишком короткий' : "Parol kamida 5 ta belgidan iborat bo'lishi kerak.");
        return;
      }

      await register({ name, email, password, role, companyName });
    } else {
      const res = await login({ email, password, role, name, companyName });
      if (res.role === 'admin') {
        navigate('/admin');
        return;
      }
    }

    if (role === 'employer') {
      navigate('/employer');
    } else {
      navigate('/dashboard');
    }
  };

  // Dedicated Admin login
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await login({
      email: adminEmail.trim(),
      password: adminPassword.trim(),
      role: 'admin'
    });

    if (res.success && res.role === 'admin') {
      navigate('/admin');
    } else {
      setError(language === 'ru' ? 'Неверные данные администратора' : "Administrator ma'lumotlari noto'g'ri");
    }
  };

  const handleDemoClick = (demoRole) => {
    quickDemoLogin(demoRole);
    if (demoRole === 'seeker') navigate('/dashboard');
    else if (demoRole === 'employer') navigate('/employer');
    else if (demoRole === 'admin') navigate('/admin');
  };

  return (
    <div className="py-12 sm:py-16 max-w-lg mx-auto px-4 sm:px-6 animate-fade-in">
      
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 mx-auto">
          <Briefcase className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {authMethod === 'admin' 
            ? (language === 'ru' ? 'Вход администратора' : 'Admin paneli kirishi')
            : mode === 'login' ? t.loginTitle : t.registerTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {authMethod === 'admin'
            ? 'Supabase & Platform Super Admin maxsus hisobi'
            : mode === 'login' ? t.loginSubtitle : t.registerSubtitle}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Method Switcher Tabs: Phone (Telegram) | Email | Admin */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMethod('phone'); setError(''); setSuccessMsg(''); }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'phone'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="truncate">Telegram</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('email'); setError(''); setSuccessMsg(''); }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'email'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">Email</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('admin'); setError(''); setSuccessMsg(''); }}
            className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'admin'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="truncate">Admin</span>
          </button>
        </div>

        {/* Login / Register Toggle (for phone & email) */}
        {authMethod !== 'admin' && (
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setPhoneStep('input'); setError(''); }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.login}
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setPhoneStep('input'); setError(''); }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.register}
            </button>
          </div>
        )}

        {/* Role Switcher (Seeker vs Employer) */}
        {authMethod !== 'admin' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              {language === 'ru' ? 'Тип аккаунта:' : 'Hisob turi:'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('seeker')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  role === 'seeker'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <User className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold">{t.roleSeeker}</p>
                  <p className="text-[10px] text-slate-500">
                    {language === 'ru' ? 'Ищу работу' : 'Ish qidirayapman'}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('employer')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  role === 'employer'
                    ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold">{t.roleEmployer}</p>
                  <p className="text-[10px] text-slate-500">
                    {language === 'ru' ? 'Ищу сотрудников' : 'Xodim qidirayapman'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Error and Success alerts */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 text-xs font-semibold">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* OPTION 1: PHONE + TELEGRAM CODE AUTHENTICATION           */}
        {/* ======================================================== */}
        {authMethod === 'phone' && (
          phoneStep === 'input' ? (
            <form onSubmit={handleRequestTelegramCode} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fullName} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'ru' ? 'Азиз Рахимов' : 'Aziz Rahimov'}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {mode === 'register' && role === 'employer' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.companyName} *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={language === 'ru' ? 'ООО "Компания"' : 'Kompaniya nomi MCHJ'}
                      className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'ru' ? 'Номер телефона' : 'Telefon raqami'} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {language === 'ru' 
                    ? 'Код подтверждения придёт в Telegram бот @apexishqidirish_bot'
                    : "Bir martalik tasdiqlash kodi Telegram botimizga yuboriladi"}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSendingCode}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSendingCode 
                      ? (language === 'ru' ? 'Отправка кода...' : 'Kod yuborilmoqda...') 
                      : (language === 'ru' ? 'Получить код в Telegram' : 'Telegram orqali kod olish')}
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* Verify Step */
            <form onSubmit={handleVerifyPhoneCode} className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-900 dark:text-sky-200">
                    {phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setPhoneStep('input'); setPhoneCode(''); }}
                    className="text-[11px] font-bold text-sky-600 hover:underline"
                  >
                    {language === 'ru' ? 'Изменить' : "O'zgartirish"}
                  </button>
                </div>
                <p className="text-[11px] text-sky-700 dark:text-sky-300">
                  {language === 'ru' 
                    ? 'Введите 4-значный код из Telegram (@apexishqidirish_bot)' 
                    : 'Telegram botimiz orqali yuborilgan 4 xonali kodni kiriting'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 text-center">
                  {language === 'ru' ? 'Код подтверждения' : 'Tasdiqlash kodi'}
                </label>
                <input
                  type="text"
                  required
                  maxLength={4}
                  autoFocus
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • •"
                  className="w-full text-center tracking-[0.5em] py-3 text-xl font-black rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Sample test code helper */}
              {sentCode && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {language === 'ru' ? 'Тестовый код:' : 'Yuborilgan kod:'} <b className="text-blue-600 font-mono text-sm">{sentCode}</b>
                  </span>
                  <button
                    type="button"
                    onClick={() => setPhoneCode(sentCode)}
                    className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                  >
                    {language === 'ru' ? 'Вставить' : 'Kiritish'}
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  disabled={codeCountdown > 0}
                  onClick={handleRequestTelegramCode}
                  className="text-slate-500 hover:text-blue-600 disabled:opacity-40 font-semibold"
                >
                  {codeCountdown > 0 
                    ? `${language === 'ru' ? 'Повтор через' : 'Qayta yuborish'}: ${codeCountdown}s` 
                    : (language === 'ru' ? 'Отправить код повторно' : 'Qayta yuborish')}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'ru' ? 'Подтвердить и войти' : 'Tasdiqlash va kirish'}</span>
              </button>
            </form>
          )
        )}

        {/* ======================================================== */}
        {/* OPTION 2: EMAIL & PASSWORD AUTHENTICATION                */}
        {/* ======================================================== */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.fullName}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aziz Rahimov"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && role === 'employer' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.companyName}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Kompaniya nomi MCHJ"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.email}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="foydalanuvchi@mail.uz"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.password}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.passwordConfirm}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>{mode === 'login' ? t.login : t.register}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* OPTION 3: SPECIAL SUPER ADMIN LOGIN (admin@gmail.com)    */}
        {/* ======================================================== */}
        {authMethod === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>{language === 'ru' ? 'Специальный аккаунт администратора' : 'Maxsus Admin Akkaunti'}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'ru'
                  ? 'Supabase & Платформа Super Admin: доступ ко всем вакансиям, товарам, чекам и базе данных.'
                  : "Platforma va Supabase ma'lumotlar bazasini to'liq boshqarish huquqiga ega super admin profili."}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Admin Parol
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Shield className="w-4 h-4" />
                <span>{language === 'ru' ? 'Войти как Super Admin' : 'Super Admin sifatida kirish'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Quick 1-Click Demo Logins for Fast Access */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.quickDemoLogin}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('seeker')}
              className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 transition-colors text-center"
            >
              {t.demoSeekerBtn}
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('employer')}
              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors text-center"
            >
              {t.demoEmployerBtn}
            </button>

            <button
              type="button"
              onClick={() => handleDemoClick('admin')}
              className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-colors text-center"
            >
              👑 {language === 'ru' ? 'admin@gmail.com' : 'admin@gmail.com'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
