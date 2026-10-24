import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Landmark, 
  TrendingUp, 
  ShoppingBag, 
  Palette, 
  Users, 
  Truck, 
  Headphones, 
  Building2, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useJobStore } from '../../store/useJobStore';
import { translations, CATEGORIES } from '../../constants/translations';

const iconMap = {
  Code2,
  Landmark,
  TrendingUp,
  ShoppingBag,
  Palette,
  Users,
  Truck,
  Headphones,
  Building2,
  GraduationCap
};

export default function CategoryGrid() {
  const { language } = useThemeStore();
  const { jobs, setFilters } = useJobStore();
  const t = translations[language] || translations.uz;

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {t.exploreCategories}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.topCategories}
          </h2>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>Barcha vakansiyalar</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Briefcase;
          const liveCount = jobs.filter(j => j.category === cat.id).length;
          const name = language === 'ru' ? cat.nameRu : language === 'en' ? cat.nameEn : cat.nameUz;

          return (
            <Link
              key={cat.id}
              to={`/jobs?category=${cat.id}`}
              onClick={() => setFilters({ category: cat.id })}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500/60 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <IconComponent className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {liveCount} {t.resultsFound.split(' ')[1] || 'vakansiya'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

    </section>
  );
}
