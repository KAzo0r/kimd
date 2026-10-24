import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Laptop, Headphones, Watch, BatteryCharging, Gamepad2, ArrowRight } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { translations } from '../../constants/translations';

export default function CategorySection() {
  const { language } = useThemeStore();
  const t = translations[language] || translations.uz;

  const categories = [
    {
      id: 'smartphones',
      name: t.catSmartphones,
      icon: Smartphone,
      count: '14+ model',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=400&auto=format&fit=crop',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      id: 'laptops',
      name: t.catLaptops,
      icon: Laptop,
      count: '10+ model',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop',
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'audio',
      name: t.catAudio,
      icon: Headphones,
      count: '18+ model',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop',
      color: 'from-emerald-500 to-teal-700'
    },
    {
      id: 'wearables',
      name: t.catWearables,
      icon: Watch,
      count: '8+ model',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'accessories',
      name: t.catAccessories,
      icon: BatteryCharging,
      count: '25+ model',
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=400&auto=format&fit=crop',
      color: 'from-rose-500 to-red-600'
    }
  ];

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.categoriesTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.categoriesSubtitle}
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 group"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
              >
                {/* Background Accent Pill */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-slate-400 mt-1 font-medium">
                  {cat.count}
                </span>

                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span>Ko'rish</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
