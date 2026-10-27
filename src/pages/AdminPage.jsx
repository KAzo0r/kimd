import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Briefcase, 
  Building2, 
  Users, 
  ShoppingBag, 
  Bot, 
  Database, 
  Settings, 
  Radio, 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  ExternalLink, 
  Send, 
  Camera, 
  Download, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Shield, 
  Filter, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  Lock, 
  LogOut, 
  Sun, 
  Moon, 
  Globe,
  Upload,
  Clock,
  Package,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useJobStore } from '../store/useJobStore';
import { useOrderStore } from '../store/useOrderStore';
import { useProductStore } from '../store/useProductStore';
import { useAuthStore } from '../store/useAuthStore';
import { useTelegramStore } from '../store/useTelegramStore';
import { formatSalary } from '../utils/helpers';
import { translations } from '../constants/translations';
import { 
  checkBotConnection, 
  sendTestTextMessage, 
  sendTestPhotoMessage, 
  notifyNewOrder,
  notifyNewVacancy,
  notifyNewProduct,
  callTelegramApi
} from '../utils/telegramService';
import { isSupabaseConfigured, supabase, saveOrderToSupabase, saveApplicationToSupabase } from '../utils/supabaseClient';

export default function AdminPage() {
  const navigate = useNavigate();
  const { language, theme, setTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { jobs, companies, applications, addJob, deleteJob, toggleJobFeatured, updateApplicationStatus } = useJobStore();
  const { orders, updateOrderStatus, deleteOrder } = useOrderStore();
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { clearLogs, notificationsLog } = useTelegramStore();
  const t = translations[language] || translations.uz;

  // Navigation & Layout State
  // 'overview' | 'jobs' | 'companies' | 'applications' | 'products' | 'orders' | 'users' | 'telegram' | 'broadcast' | 'supabase' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Search & Filter States
  const [globalSearch, setGlobalSearch] = useState('');
  const [jobSearch, setJobSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modals & Action States
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [resendingOrderId, setResendingOrderId] = useState(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Telegram Diagnostic States
  const [botCheckLoading, setBotCheckLoading] = useState(false);
  const [botCheckResult, setBotCheckResult] = useState(null);
  const [testSendLoading, setTestSendLoading] = useState(false);
  const [testSendResult, setTestSendResult] = useState(null);
  const [testPhotoLoading, setTestPhotoLoading] = useState(false);
  const [testPhotoResult, setTestPhotoResult] = useState(null);

  // Broadcast Message State
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    photoUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
  });
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);

  // Supabase Sync State
  const [supabaseSyncing, setSupabaseSyncing] = useState(false);
  const [supabaseSyncMsg, setSupabaseSyncMsg] = useState('');

  // System Settings State
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'IshTop.uz & ApexStore',
    supportPhone: '+998 90 777 00 77',
    supportTelegram: '@apexishqidirish_bot',
    currency: 'UZS',
    deliveryFee: 25000,
    minOrderAmount: 50000,
    maintenanceMode: false
  });

  // User Management State
  const [userList, setUserList] = useState([
    { id: "u-admin-1", name: "Alisher Yusupov (Super Admin)", email: "admin@gmail.com", role: "admin", status: "active", phone: "+998 90 777 00 77", registered: "2026-08-01" },
    { id: "u-1", name: "Javohir Karimov", email: "javohir@ishtop.uz", role: "seeker", status: "active", phone: "+998 90 123 45 67", registered: "2026-10-15" },
    { id: "u-2", name: "Sarvar Rustamov", email: "hr@uzum.uz", role: "employer", company: "Uzum Group", status: "active", phone: "+998 91 234 56 78", registered: "2026-09-20" },
    { id: "u-3", name: "Nodira Rahimova", email: "nodira@payme.uz", role: "employer", company: "Payme", status: "active", phone: "+998 93 345 67 89", registered: "2026-10-02" },
    { id: "u-4", name: "Dilshod Saidov", email: "dilshod.s@mail.uz", role: "seeker", status: "active", phone: "+998 94 456 78 90", registered: "2026-10-18" },
    { id: "u-5", name: "Malika Karimova", email: "malika@tbcbank.uz", role: "employer", company: "TBC Bank", status: "active", phone: "+998 97 567 89 01", registered: "2026-09-12" },
    { id: "u-6", name: "Akmal Norov", email: "akmal@gmail.com", role: "seeker", status: "blocked", phone: "+998 99 678 90 12", registered: "2026-10-10" }
  ]);

  // Form states for adding items
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'smartphones',
    brand: '',
    price: '',
    oldPrice: '',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop'
  });

  const [newJobForm, setNewJobForm] = useState({
    title: '',
    companyName: 'IshTop Hamkori',
    category: 'it',
    location: 'Toshkent',
    type: "To'liq bandlik",
    experience: '1-3 yil',
    salary: "10 000 000 - 15 000 000 UZS",
    salaryMin: 10000000,
    salaryMax: 15000000,
    salaryCurrency: 'UZS',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'
  });

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '+998 ',
    role: 'seeker'
  });

  // Calculate Key Performance Indicators (KPIs)
  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
  }, [orders]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  }, [orders]);

  // Handle User Status toggle
  const toggleUserStatus = (userId) => {
    setUserList(prev => prev.map(u => 
      u.id === userId ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
    ));
  };

  // Change User Role
  const changeUserRole = (userId, newRole) => {
    setUserList(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
  };

  // Create Product handler
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) return;

    const created = addProduct({
      name: newProductForm.name,
      category: newProductForm.category,
      brand: newProductForm.brand || 'IshTop Store',
      price: Number(newProductForm.price),
      oldPrice: newProductForm.oldPrice ? Number(newProductForm.oldPrice) : null,
      stock: Number(newProductForm.stock) || 1,
      image: newProductForm.image,
      images: [newProductForm.image]
    });

    // Optionally notify Telegram bot
    try {
      notifyNewProduct(created);
    } catch (err) {
      console.warn('Telegram notify error:', err);
    }

    setIsAddProductModalOpen(false);
    setNewProductForm({
      name: '',
      category: 'smartphones',
      brand: '',
      price: '',
      oldPrice: '',
      stock: 10,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop'
    });
    alert(language === 'ru' ? 'Товар успешно добавлен и опубликован!' : "Mahsulot muvaffaqiyatli qo'shildi!");
  };

  // Create Job handler
  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newJobForm.title || !newJobForm.companyName) return;

    const created = addJob({
      title: newJobForm.title,
      companyName: newJobForm.companyName,
      category: newJobForm.category,
      location: newJobForm.location,
      type: newJobForm.type,
      experience: newJobForm.experience,
      salary: newJobForm.salary,
      salaryMin: Number(newJobForm.salaryMin) || 0,
      salaryMax: Number(newJobForm.salaryMax) || 0,
      salaryCurrency: newJobForm.salaryCurrency || 'UZS',
      companyLogo: newJobForm.companyLogo,
      featured: true
    });

    // Notify Telegram bot
    try {
      notifyNewVacancy(created);
    } catch (err) {
      console.warn('Telegram notify error:', err);
    }

    setIsAddJobModalOpen(false);
    setNewJobForm({
      title: '',
      companyName: 'IshTop Hamkori',
      category: 'it',
      location: 'Toshkent',
      type: "To'liq bandlik",
      experience: '1-3 yil',
      salary: "10 000 000 - 15 000 000 UZS",
      salaryMin: 10000000,
      salaryMax: 15000000,
      salaryCurrency: 'UZS',
      companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'
    });
    alert(language === 'ru' ? 'Вакансия успешно создана и отправлена в Telegram!' : "Vakansiya muvaffaqiyatli yaratildi va Telegramga yuborildi!");
  };

  // Create User handler
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    const newUser = {
      id: `u-${Date.now()}`,
      name: newUserForm.name,
      email: newUserForm.email,
      phone: newUserForm.phone,
      role: newUserForm.role,
      status: 'active',
      registered: new Date().toISOString().split('T')[0]
    };

    setUserList(prev => [newUser, ...prev]);
    setIsAddUserModalOpen(false);
    setNewUserForm({ name: '', email: '', phone: '+998 ', role: 'seeker' });
    alert(language === 'ru' ? 'Пользователь успешно добавлен!' : "Foydalanuvchi muvaffaqiyatli qo'shildi!");
  };

  // Send Broadcast via Telegram Bot
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;

    setBroadcastSending(true);
    setBroadcastResult(null);

    const caption = `📢 <b>${broadcastForm.title.toUpperCase()}</b>\n━━━━━━━━━━━━━━━━━━━━\n${broadcastForm.message}\n━━━━━━━━━━━━━━━━━━━━\n🕒 <b>IshTop.uz Rasmiy Bildirishnomasi</b>`;

    try {
      const res = await sendTestPhotoMessage(broadcastForm.photoUrl, { caption });
      setBroadcastResult(res);
      if (res.ok) {
        alert(language === 'ru' ? 'Рассылка успешно доставлена в Telegram бот!' : "Xabar Telegram botga muvaffaqiyatli yuborildi!");
        setIsBroadcastModalOpen(false);
      }
    } catch (err) {
      setBroadcastResult({ ok: false, error: err.message });
    } finally {
      setBroadcastSending(false);
    }
  };

  // Supabase full sync
  const handleSyncToSupabase = async () => {
    setSupabaseSyncing(true);
    setSupabaseSyncMsg('');

    try {
      let orderSuccessCount = 0;
      for (const o of orders) {
        await saveOrderToSupabase({
          order_id: o.id,
          customer_name: o.customerName,
          customer_phone: o.customerPhone,
          delivery_region: o.deliveryRegion,
          delivery_address: o.deliveryAddress,
          delivery_type: o.deliveryType,
          payment_method: o.paymentMethod,
          receipt_photo: o.receiptPhoto,
          total_amount: o.total,
          items: o.items,
          created_at: o.createdAt
        });
        orderSuccessCount++;
      }

      setSupabaseSyncMsg(language === 'ru' 
        ? `Синхронизировано ${orderSuccessCount} заказов в Supabase!` 
        : `${orderSuccessCount} ta buyurtma Supabase bazasiga muvaffaqiyatli sinxronlandi!`);
    } catch (err) {
      setSupabaseSyncMsg(`Xatolik: ${err.message}`);
    } finally {
      setSupabaseSyncing(false);
    }
  };

  // Export Users to CSV / JSON
  const handleExportUsers = (format = 'json') => {
    let dataStr = '';
    let fileName = '';

    if (format === 'csv') {
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Registered'];
      const rows = userList.map(u => [u.id, `"${u.name}"`, u.email, u.phone || '-', u.role, u.status, u.registered].join(','));
      dataStr = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
      fileName = `ishtop_users_${Date.now()}.csv`;
    } else {
      dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(userList, null, 2));
      fileName = `ishtop_users_${Date.now()}.json`;
    }

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Full System Backup Download
  const handleDownloadFullBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      platform: 'IshTop.uz Super Admin Backup',
      stats: {
        totalRevenue,
        ordersCount: orders.length,
        jobsCount: jobs.length,
        companiesCount: companies.length,
        productsCount: products.length,
        usersCount: userList.length
      },
      orders,
      jobs,
      companies,
      products,
      applications,
      users: userList,
      settings: platformSettings
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ishtop_full_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    alert(language === 'ru' ? 'Резервная копия всей системы успешно скачана!' : "Tizimning to'liq zaxira nusxasi yuklab olindi!");
  };

  // Navigation menu items definition
  const navSections = [
    {
      title: language === 'ru' ? 'Основное' : 'Boshqaruv',
      items: [
        { id: 'overview', label: language === 'ru' ? 'Аналитика' : 'Tahlil va Boshqaruv', icon: BarChart3 },
        { id: 'jobs', label: language === 'ru' ? 'Вакансии' : 'Vakansiyalar', icon: Briefcase, badge: jobs.length },
        { id: 'companies', label: language === 'ru' ? 'Компании' : 'Kompaniyalar', icon: Building2, badge: companies.length },
        { id: 'applications', label: language === 'ru' ? 'Отклики и Резюме' : 'Arizalar / Nomzodlar', icon: FileText, badge: applications.length }
      ]
    },
    {
      title: language === 'ru' ? 'ApexStore Магазин' : 'ApexStore Savdo',
      items: [
        { id: 'products', label: language === 'ru' ? 'Товары и Склад' : 'Tovarlar / Ombor', icon: Package, badge: products.length },
        { id: 'orders', label: language === 'ru' ? 'Заказы и Чеки' : 'Buyurtmalar va Cheklar', icon: ShoppingBag, badge: pendingOrdersCount, badgeColor: 'bg-amber-500' }
      ]
    },
    {
      title: language === 'ru' ? 'Система и Интеграции' : 'Tizim va Xizmatlar',
      items: [
        { id: 'users', label: language === 'ru' ? 'Пользователи' : 'Foydalanuvchilar', icon: Users, badge: userList.length },
        { id: 'telegram', label: 'Telegram Bot', icon: Bot, badge: 'Online', badgeColor: 'bg-sky-500' },
        { id: 'broadcast', label: language === 'ru' ? 'Рассылка Telegram' : 'E\'lonlar Tarqatish', icon: Radio },
        { id: 'supabase', label: 'Supabase Baza', icon: Database, badge: 'Cloud', badgeColor: 'bg-emerald-500' },
        { id: 'settings', label: language === 'ru' ? 'Настройки Tizim' : 'Tizim Sozlamalari', icon: Settings }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row antialiased">
      
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR MENU (Modern Fixed/Collapsible Navigation)                */}
      {/* ========================================================================= */}
      
      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        transition-all duration-300 ease-in-out flex flex-col justify-between shrink-0 shadow-lg md:shadow-none
        ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64 lg:w-72'}
        ${isMobileSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Sidebar Header: Brand & Collapse Toggle */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <div className="animate-fade-in truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">IshTop.uz</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      PRO
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Super Admin Control</p>
                </div>
              )}
            </div>

            {/* Desktop Collapse Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isSidebarCollapsed ? "Kengaytirish" : "Kichraytirish"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sections & Links */}
          <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-thin">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-1">
                {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                  <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {section.title}
                  </p>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileSidebarOpen(false);
                        }}
                        title={isSidebarCollapsed ? item.label : undefined}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-bold transition-all relative group
                          ${isActive 
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                          ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center px-0' : ''}
                        `}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
                        
                        {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                          <>
                            <span className="truncate flex-1 text-left">{item.label}</span>
                            {item.badge !== undefined && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                isActive 
                                  ? 'bg-white/20 text-white' 
                                  : item.badgeColor 
                                    ? `${item.badgeColor} text-white`
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer: Admin Profile & Logout */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className={`flex items-center gap-3 ${isSidebarCollapsed && !isMobileSidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              👑
            </div>
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <div className="truncate flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">admin@gmail.com</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Super Admin</span>
                </div>
              </div>
            )}
            {(!isSidebarCollapsed || isMobileSidebarOpen) && (
              <button
                onClick={() => { logout(); navigate('/auth'); }}
                title="Chiqish (Logout)"
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA WITH TOP NAV BAR                                     */}
      {/* ========================================================================= */}
      
      <main className="flex-1 min-w-0 flex flex-col">
        
        {/* Top Navbar Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
          
          {/* Left: Mobile hamburger & Active Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white capitalize flex items-center gap-2">
                <span>
                  {navSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label || 'Boshqaruv'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  ● 100% Barqaror
                </span>
              </h2>
            </div>
          </div>

          {/* Right: Quick Action Buttons & Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick action: Add Product / Add Vacancy shortcut */}
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'ru' ? '+ Товар' : '+ Tovar'}</span>
            </button>

            <button
              onClick={() => setIsAddJobModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'ru' ? '+ Вакансия' : '+ Vakansiya'}</span>
            </button>

            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all shadow-sm shadow-sky-500/20 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Telegram Broadcast</span>
            </button>

            {/* Platform Settings Shortcut */}
            <button
              onClick={() => setActiveTab('settings')}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Sozlamalar"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </header>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">

          {/* ========================================================================= */}
          {/* TAB 1: OVERVIEW & ANALYTICS                                               */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total Revenue */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {language === 'ru' ? 'Общий доход' : "Jami Tushum"}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {(totalRevenue).toLocaleString()} <span className="text-xs font-bold text-slate-400">UZS</span>
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+14.8% bu oyda</span>
                    </div>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {language === 'ru' ? 'Заказы' : "Buyurtmalar"}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {orders.length} ta
                    </h3>
                    <p className="text-[11px] font-semibold text-amber-500 mt-1">
                      {pendingOrdersCount} ta yangi / ko'rib chiqilmoqda
                    </p>
                  </div>
                </div>

                {/* Active Jobs */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {language === 'ru' ? 'Вакансии' : "Faol Vakansiyalar"}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {jobs.length} ta
                    </h3>
                    <p className="text-[11px] font-semibold text-blue-500 mt-1">
                      {companies.length} ta hamkor kompaniya
                    </p>
                  </div>
                </div>

                {/* Applications & Resumes */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {language === 'ru' ? 'Отклики' : "Kelgan Arizalar"}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {applications.length} ta
                    </h3>
                    <p className="text-[11px] font-semibold text-purple-500 mt-1">
                      {userList.length} ta ro'yxatdan o'tgan profil
                    </p>
                  </div>
                </div>

              </div>

              {/* Quick Actions Shortcuts */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <h3 className="text-lg sm:text-xl font-black">
                        {language === 'ru' ? 'Быстрые действия администратора' : 'Admin Tezkor Harakatlar Markazi'}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-indigo-200/80 mt-1 max-w-xl">
                      {language === 'ru'
                        ? 'Создавайте новые товары, публикуйте вакансии, запускайте рассылку в Telegram и управляйте базой в 1 клик.'
                        : "Yangi tovar qo'shish, vakansiya e'lon qilish yoki Telegram bot orqali rasmiy e'lon tarqatishni 1 bosishda bajaring."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5 shrink-0">
                    <button
                      onClick={() => setIsAddProductModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{language === 'ru' ? 'Добавить товар' : 'Tovar qo\'shish'}</span>
                    </button>

                    <button
                      onClick={() => setIsAddJobModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95 border border-indigo-400/30"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{language === 'ru' ? 'Создать вакансию' : 'Vakansiya yaratish'}</span>
                    </button>

                    <button
                      onClick={() => setIsBroadcastModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Radio className="w-4 h-4" />
                      <span>Telegram Broadcast</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-black text-slate-900 dark:text-white text-base">
                      {language === 'ru' ? 'Последние заказы магазина' : 'So\'nggi xarid buyurtmalari'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <span>{language === 'ru' ? 'Все заказы' : 'Barcha buyurtmalar'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">{language === 'ru' ? 'Клиент' : 'Mijoz'}</th>
                        <th className="py-3 px-3">{language === 'ru' ? 'Товары' : 'Mahsulotlar'}</th>
                        <th className="py-3 px-3">{language === 'ru' ? 'Сумма' : 'Jami'}</th>
                        <th className="py-3 px-3">{language === 'ru' ? 'Статус' : 'Holat'}</th>
                        <th className="py-3 px-3 text-right">{language === 'ru' ? 'Действие' : 'Amal'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {orders.slice(0, 4).map(o => (
                        <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            #{o.id}
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-slate-900 dark:text-white">{o.customerName}</p>
                            <p className="text-[11px] text-slate-400">{o.customerPhone}</p>
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                            {o.items?.map(i => i.name).join(', ') || '1 dona tovar'}
                          </td>
                          <td className="py-3 px-3 font-black text-slate-900 dark:text-white">
                            {(o.total || 0).toLocaleString()} UZS
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                              o.status === 'processing' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' :
                              o.status === 'shipped' ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' :
                              'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                notifyNewOrder(o);
                                alert(`Buyurtma #${o.id} Telegram botga qayta yuborildi!`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300 font-bold hover:bg-sky-100 transition-colors inline-flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Telegram</span>
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

          {/* ========================================================================= */}
          {/* TAB 2: PRODUCTS & INVENTORY (ApexStore)                                    */}
          {/* ========================================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {language === 'ru' ? 'Управление товарами магазина' : "Tovarlar va Ombordagi Qoldiq"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {products.length} ta faol mahsulot katalogda mavjud
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder={language === 'ru' ? 'Поиск товара...' : 'Tovar qidirish...'}
                      className="pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none w-48 sm:w-64"
                    />
                  </div>

                  <button
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'ru' ? 'Добавить товар' : 'Yangi tovar'}</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                        <th className="py-3 px-4">{language === 'ru' ? 'Товар' : 'Tovar'}</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Категория' : 'Toifa'}</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Цена (UZS)' : 'Narxi'}</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Остаток' : 'Omborda'}</th>
                        <th className="py-3 px-4 text-right">{language === 'ru' ? 'Действия' : 'Amallar'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {products
                        .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || (p.brand || '').toLowerCase().includes(productSearch.toLowerCase()))
                        .map(p => (
                          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700"
                                />
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
                                  <p className="text-[10px] text-slate-400">{p.brand || 'ApexStore'} • #{p.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300 capitalize">
                              {p.category}
                            </td>
                            <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                              {(p.price || 0).toLocaleString()} UZS
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateProduct(p.id, { stock: Math.max(0, (p.stock || 0) - 1) })}
                                  className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-black flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                                  p.stock <= 3 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                                }`}>
                                  {p.stock || 0}
                                </span>
                                <button
                                  onClick={() => updateProduct(p.id, { stock: (p.stock || 0) + 1 })}
                                  className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-black flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    notifyNewProduct(p);
                                    alert(`Mahsulot (${p.name}) fotosurati bilan Telegram botga e'lon qilindi!`);
                                  }}
                                  title="Telegramga e'lon yuborish"
                                  className="p-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-300 hover:bg-sky-100 transition-colors"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`${p.name} mahsulotini o'chirmoqchimisiz?`)) {
                                      deleteProduct(p.id);
                                    }
                                  }}
                                  title="O'chirish"
                                  className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ORDERS & RECEIPTS                                                  */}
          {/* ========================================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {language === 'ru' ? 'Заказы и чеки оплаты' : "Buyurtmalar va To'lov Cheklari"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Jami {orders.length} ta buyurtma, {pendingOrdersCount} ta faol ko'rib chiqilmoqda
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="text-xs font-bold px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none"
                  >
                    <option value="all">{language === 'ru' ? 'Все статусы' : 'Barcha holatlar'}</option>
                    <option value="pending">🟡 Kutilmoqda</option>
                    <option value="processing">🔵 Jarayonda</option>
                    <option value="shipped">🚚 Yetkazilmoqda</option>
                    <option value="delivered">🟢 Yetkazildi</option>
                  </select>

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder={language === 'ru' ? 'Поиск заказа...' : 'Buyurtma qidirish...'}
                      className="pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none w-48 sm:w-60"
                    />
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Покупатель' : 'Xaridor'}</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Фото чека' : 'To\'lov Cheki'}</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Сумма' : 'Jami'}</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Статус' : 'Holat'}</th>
                        <th className="py-3 px-4 text-right">{language === 'ru' ? 'Действия' : 'Amallar'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {orders
                        .filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter)
                        .filter(o => o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || o.id.toLowerCase().includes(orderSearch.toLowerCase()))
                        .map(o => (
                          <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                              #{o.id}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-900 dark:text-white">{o.customerName}</p>
                              <p className="text-[11px] text-slate-400">{o.customerPhone}</p>
                              <p className="text-[10px] text-slate-400">{o.deliveryRegion}, {o.deliveryAddress}</p>
                            </td>
                            <td className="py-3 px-4">
                              {o.receiptPhoto ? (
                                <button
                                  onClick={() => setPreviewPhoto(o.receiptPhoto)}
                                  className="group relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 flex items-center justify-center shrink-0"
                                >
                                  <img src={o.receiptPhoto} alt="Chek" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                    <Eye className="w-3.5 h-3.5" />
                                  </div>
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Chek yuklanmagan</span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-black text-slate-900 dark:text-white">
                              {(o.total || 0).toLocaleString()} UZS
                              <span className="block text-[10px] font-medium text-slate-400 uppercase">{o.paymentMethod}</span>
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={o.status}
                                onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
                              >
                                <option value="pending">🟡 Kutilmoqda</option>
                                <option value="processing">🔵 Jarayonda</option>
                                <option value="shipped">🚚 Yetkazilmoqda</option>
                                <option value="delivered">🟢 Yetkazildi</option>
                                <option value="cancelled">🔴 Bekor qilindi</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
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
                                        alert(`Xatolik: ${res.error || "Telegram bot bilan aloqa o'rnatilmadi"}`);
                                      }
                                    } catch (err) {
                                      alert(`Xatolik: ${err.message}`);
                                    } finally {
                                      setResendingOrderId(null);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-[11px] transition-all shadow-xs"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>{resendingOrderId === o.id ? '...' : 'Telegram'}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Buyurtma #${o.id} ni o'chirmoqchimisiz?`)) {
                                      deleteOrder(o.id);
                                    }
                                  }}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: VACANCIES (Jobs)                                                   */}
          {/* ========================================================================= */}
          {activeTab === 'jobs' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {language === 'ru' ? 'Управление вакансиями платформы' : "Vakansiyalar Boshqaruvi"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Jami {jobs.length} ta faol e'lon joylashtirilgan
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={jobSearch}
                      onChange={(e) => setJobSearch(e.target.value)}
                      placeholder={language === 'ru' ? 'Поиск вакансии...' : 'Vakansiya qidirish...'}
                      className="pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none w-48 sm:w-64"
                    />
                  </div>

                  <button
                    onClick={() => setIsAddJobModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'ru' ? 'Создать вакансию' : 'Yangi vakansiya'}</span>
                  </button>
                </div>
              </div>

              {/* Vacancies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs
                  .filter(j => j.title.toLowerCase().includes(jobSearch.toLowerCase()) || j.companyName.toLowerCase().includes(jobSearch.toLowerCase()))
                  .map(j => (
                    <div key={j.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={j.companyLogo || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100'}
                            alt={j.companyName}
                            className="w-12 h-12 rounded-2xl object-cover bg-slate-100 border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">{j.title}</h4>
                            <p className="text-xs font-semibold text-slate-500">{j.companyName} • {j.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleJobFeatured(j.id)}
                            title="VIP / Tanlangan"
                            className={`p-1.5 rounded-xl transition-colors ${
                              j.featured 
                                ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/50' 
                                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`'${j.title}' vakansiyasini o'chirishni xohlaysizmi?`)) {
                                deleteJob(j.id);
                              }
                            }}
                            title="O'chirish"
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">{j.salary || 'Kelishilgan'}</span>
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">{j.type}</span>
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">{j.experience}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          {j.applicantsCount || 0} ta ariza qabul qilingan
                        </span>
                        <button
                          onClick={() => {
                            notifyNewVacancy(j);
                            alert(`'${j.title}' vakansiyasi kompaniya logotipi bilan Telegram botga yuborildi!`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300 font-bold text-xs hover:bg-sky-100 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Telegramga yuborish</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: APPLICATIONS & RESUMES                                             */}
          {/* ========================================================================= */}
          {activeTab === 'applications' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {language === 'ru' ? 'Отклики и резюме соискателей' : "Kelgan Arizalar va Nomzodlar"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nomzodlarning vakansiyalarga qoldirgan rezyumelari va arizalari
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                        <th className="py-3 px-4">{language === 'ru' ? 'Кандидат' : 'Nomzod'}</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Вакансия' : 'Vakansiya'}</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Контакты' : 'Bog\'lanish'}</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Статус отклика' : 'Ariza Holati'}</th>
                        <th className="py-3 px-4 text-right">{language === 'ru' ? 'Действия' : 'Amal'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {applications.map(app => (
                        <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900 dark:text-white">{app.applicantName}</p>
                            <p className="text-[10px] text-slate-400">{app.applicantCity || 'Toshkent'}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{app.jobTitle}</p>
                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">{app.companyName}</p>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                            <p>{app.applicantPhone}</p>
                            <p className="text-[10px] text-slate-400">{app.applicantEmail}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={app.status}
                              onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                              className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                            >
                              <option value="applied">🟡 Yangi kelgan</option>
                              <option value="reviewed">🔵 Ko'rib chiqildi</option>
                              <option value="interview">🟣 Suhbatga chaqirildi</option>
                              <option value="accepted">🟢 Qabul qilindi</option>
                              <option value="rejected">🔴 Rad etildi</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                alert(`Nomzod xati:\n"${app.coverLetter || "Biriktirilgan ilova xati mavjud emas"}"`);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition-colors"
                            >
                              Xatni o'qish
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

          {/* ========================================================================= */}
          {/* TAB 6: USERS MANAGEMENT                                                   */}
          {/* ========================================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {language === 'ru' ? 'Управление пользователями' : "Foydalanuvchilar Boshqaruvi"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nomzodlar, Ish beruvchilar va Administrator profillari
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder={language === 'ru' ? 'Поиск...' : 'Qidirish...'}
                      className="pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none w-40 sm:w-56"
                    />
                  </div>

                  <button
                    onClick={() => handleExportUsers('csv')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
                    title="CSV yuklab olish"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsAddUserModalOpen(true)}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'ru' ? 'Добавить' : 'Foydalanuvchi'}</span>
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                        <th className="py-3 px-4">{language === 'ru' ? 'Пользователь' : 'Foydalanuvchi'}</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Роль' : 'Roli'}</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Телефон' : 'Telefon'}</th>
                        <th className="py-3 px-4">{language === 'ru' ? 'Статус' : 'Holat'}</th>
                        <th className="py-3 px-4 text-right">{language === 'ru' ? 'Действия' : 'Amal'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {userList
                        .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                        .map(u => (
                          <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                              <p className="text-[10px] text-slate-400">{u.email}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={u.role}
                                onChange={(e) => changeUserRole(u.id, e.target.value)}
                                className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                              >
                                <option value="seeker">Nomzod</option>
                                <option value="employer">Ish beruvchi</option>
                                <option value="admin">Super Admin</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                              {u.phone || '-'}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                u.status === 'active' 
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              }`}>
                                {u.status === 'active' ? 'Faol' : 'Bloklangan'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => toggleUserStatus(u.id)}
                                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                                  u.status === 'active'
                                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40'
                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40'
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: TELEGRAM BOT INTEGRATION & DIAGNOSTICS                             */}
          {/* ========================================================================= */}
          {activeTab === 'telegram' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-sky-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
                    <Bot className="w-9 h-9" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black">@apexishqidirish_bot</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Ulangan (Active)
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-sky-200/80 mt-1">
                      IshTop.uz va ApexStore buyurtmalari, fotosuratlari va arizalarini real-vaqtda qabul qiluvchi Telegram bot
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Admin Chat ID: <span className="font-mono text-white bg-slate-800 px-2 py-0.5 rounded">799910176</span> • Token: <span className="font-mono text-sky-300">879345...UyY</span>
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

              {/* 3 Diagnostic Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Check Connection */}
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
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-all"
                  >
                    {botCheckLoading ? 'Tekshirilmoqda...' : 'Ulanishni tekshirish'}
                  </button>

                  {botCheckResult && (
                    <div className={`p-3 rounded-xl text-xs ${botCheckResult.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                      {botCheckResult.ok ? `✓ Bot: @${botCheckResult.bot?.username} (${botCheckResult.bot?.first_name})` : `Xatolik: ${botCheckResult.error}`}
                    </div>
                  )}
                </div>

                {/* 2. Send Test Text */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">Test Matnli Xabar</h3>
                      <p className="text-xs text-slate-500">Admin chatiga bildirishnoma</p>
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
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20"
                  >
                    {testSendLoading ? 'Yuborilmoqda...' : 'Matnli xabar yuborish'}
                  </button>

                  {testSendResult && (
                    <div className={`p-3 rounded-xl text-xs ${testSendResult.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                      {testSendResult.ok ? '✓ Test xabari Telegramga yuborildi!' : `Xatolik: ${testSendResult.error}`}
                    </div>
                  )}
                </div>

                {/* 3. Send Photo Alert */}
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">Suratli Test Yuborish</h3>
                      <p className="text-xs text-slate-500">Haqiqiy fotosurat bilan</p>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      setTestPhotoLoading(true);
                      setTestPhotoResult(null);
                      try {
                        const res = await sendTestPhotoMessage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800');
                        setTestPhotoResult(res);
                      } catch (e) {
                        setTestPhotoResult({ ok: false, error: e.message });
                      } finally {
                        setTestPhotoLoading(false);
                      }
                    }}
                    disabled={testPhotoLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/20"
                  >
                    {testPhotoLoading ? 'Yuborilmoqda...' : 'Suratli xabar yuborish'}
                  </button>

                  {testPhotoResult && (
                    <div className={`p-3 rounded-xl text-xs ${testPhotoResult.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                      {testPhotoResult.ok ? '✓ Suratli xabar Telegramga yuborildi!' : `Xatolik: ${testPhotoResult.error}`}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: TELEGRAM BROADCASTER                                               */}
          {/* ========================================================================= */}
          {activeTab === 'broadcast' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {language === 'ru' ? 'Прямая рассылка в Telegram бот' : "Telegram E'lonlar Tarqatish"}
                </h3>
                <p className="text-xs text-slate-500">
                  @apexishqidirish_bot orqali fotosuratli muhim xabar va yangiliklar yuborish
                </p>
              </div>

              <form onSubmit={handleSendBroadcast} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'ru' ? 'Заголовок сообщения' : "E'lon sarlavhasi"}
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Masalan: Katta chegirmalar boshlandi!"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'ru' ? 'Текст сообщения' : "Xabar matni"}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Xabar to'liq matnini kiriting..."
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'ru' ? 'Ссылка на фото (URL)' : "Fotosurat havolasi (URL)"}
                  </label>
                  <input
                    type="url"
                    value={broadcastForm.photoUrl}
                    onChange={(e) => setBroadcastForm(prev => ({ ...prev, photoUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {broadcastForm.photoUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-36 bg-slate-900">
                    <img src={broadcastForm.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={broadcastSending}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{broadcastSending ? 'Yuborilmoqda...' : 'Telegram Botga Yuborish'}</span>
                </button>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: SUPABASE CLOUD DATABASE                                            */}
          {/* ========================================================================= */}
          {activeTab === 'supabase' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-emerald-500/30 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">Supabase PostgreSQL Baza</h3>
                      <p className="text-xs text-slate-400">admin@gmail.com maxsus hisobi va bulutli sinxronizatsiya</p>
                    </div>
                  </div>

                  <button
                    onClick={handleSyncToSupabase}
                    disabled={supabaseSyncing}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <RefreshCw className={`w-4 h-4 ${supabaseSyncing ? 'animate-spin' : ''}`} />
                    <span>{supabaseSyncing ? 'Sinxronlanmoqda...' : 'Barcha buyurtmalarni sinxronlash'}</span>
                  </button>
                </div>

                {supabaseSyncMsg && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
                    {supabaseSyncMsg}
                  </div>
                )}
              </div>

              {/* Supabase Schema Instructions */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  SQL Jadvallar Sxemasi (Supabase SQL Editor uchun)
                </h4>
                <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  delivery_region TEXT,
  delivery_address TEXT,
  total_amount NUMERIC,
  payment_method TEXT,
  receipt_photo TEXT,
  items JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
                </pre>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 10: SYSTEM SETTINGS & FULL BACKUP                                     */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {language === 'ru' ? 'Настройки системы и резервное копирование' : "Tizim Sozlamalari va Zaxira Nusxa"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Platforma parametrlarini sozlash va ma'lumotlar bazasini yuklab olish
                  </p>
                </div>

                <button
                  onClick={handleDownloadFullBackup}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'ru' ? 'Скачать Backup JSON' : 'To\'liq Backup JSON'}</span>
                </button>
              </div>

              {/* Settings Form Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Platforma nomi
                    </label>
                    <input
                      type="text"
                      value={platformSettings.platformName}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, platformName: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Qo'llab-quvvatlash telefoni
                    </label>
                    <input
                      type="text"
                      value={platformSettings.supportPhone}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Yetkazib berish narxi (UZS)
                    </label>
                    <input
                      type="number"
                      value={platformSettings.deliveryFee}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, deliveryFee: Number(e.target.value) }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Valyuta birligi
                    </label>
                    <input
                      type="text"
                      value={platformSettings.currency}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Texnik ta'mirlash rejimi (Maintenance Mode)</p>
                    <p className="text-[11px] text-slate-400">Yoqilganda foydalanuvchilar ogohlantirish bannerini ko'radi</p>
                  </div>
                  <button
                    onClick={() => setPlatformSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      platformSettings.maintenanceMode 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {platformSettings.maintenanceMode ? 'YOQILGAN' : 'O\'CHIRILGAN'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 3. MODALS (Add Product, Add Job, Add User, Broadcast, Photo Lightbox)      */}
      {/* ========================================================================= */}

      {/* MODAL 1: ADD PRODUCT */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === 'ru' ? 'Добавление нового товара' : "Yangi Mahsulot Qo'shish"}
              </h3>
              <button onClick={() => setIsAddProductModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nomi *</label>
                <input
                  type="text"
                  required
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Masalan: iPhone 16 Pro Max 256GB"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Narxi (UZS) *</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="15000000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Ombordagi soni</label>
                  <input
                    type="number"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, stock: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Toifa</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none capitalize"
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="laptops">Laptops</option>
                    <option value="audio">Audio</option>
                    <option value="wearables">Wearables</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Brend</label>
                  <input
                    type="text"
                    value={newProductForm.brand}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="Apple, Samsung..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Rasm havolasi (URL)</label>
                <input
                  type="url"
                  value={newProductForm.image}
                  onChange={(e) => setNewProductForm(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md active:scale-95"
                >
                  Saqlash va E'lon Qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD VACANCY */}
      {isAddJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                {language === 'ru' ? 'Создание новой вакансии' : "Yangi Vakansiya Yaratish"}
              </h3>
              <button onClick={() => setIsAddJobModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Kasb / Lavozim *</label>
                <input
                  type="text"
                  required
                  value={newJobForm.title}
                  onChange={(e) => setNewJobForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Masalan: Senior React Frontend Dasturchi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Kompaniya nomi *</label>
                  <input
                    type="text"
                    required
                    value={newJobForm.companyName}
                    onChange={(e) => setNewJobForm(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Hudud</label>
                  <input
                    type="text"
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold mb-1">Bandlik turi</label>
                  <select
                    value={newJobForm.type}
                    onChange={(e) => setNewJobForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  >
                    <option value="To'liq bandlik">To'liq bandlik</option>
                    <option value="Masofaviy (Remote)">Masofaviy (Remote)</option>
                    <option value="Gibrid">Gibrid</option>
                    <option value="Yarim stavka">Yarim stavka</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Maosh (Matn)</label>
                  <input
                    type="text"
                    value={newJobForm.salary}
                    onChange={(e) => setNewJobForm(prev => ({ ...prev, salary: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Kompaniya logotipi (URL)</label>
                <input
                  type="url"
                  value={newJobForm.companyLogo}
                  onChange={(e) => setNewJobForm(prev => ({ ...prev, companyLogo: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md active:scale-95"
                >
                  Vakansiyani Joylashtirish va Telegramga Yuborish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD USER */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Yangi Foydalanuvchi Qo'shish
              </h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">F.I.Sh *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ali Valiyev"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="ali@gmail.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Telefon</label>
                <input
                  type="text"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Roli</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                >
                  <option value="seeker">Nomzod (Ish qidiruvchi)</option>
                  <option value="employer">Ish beruvchi (HR)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md active:scale-95"
                >
                  Foydalanuvchini Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: FULLSCREEN PHOTO LIGHTBOX */}
      {previewPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewPhoto(null)}
        >
          <div 
            className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700 p-4"
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
            <div className="max-h-[75vh] flex items-center justify-center bg-black/60 rounded-2xl overflow-hidden">
              <img src={previewPhoto} alt="Chek fotosurati" className="max-h-[70vh] w-auto object-contain" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
