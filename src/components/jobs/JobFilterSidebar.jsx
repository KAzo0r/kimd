import React from 'react';
import { Filter, X, RotateCcw, MapPin, Briefcase, DollarSign, Clock, Layers } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useJobStore } from '../../store/useJobStore';
import { translations, CITIES, CATEGORIES } from '../../constants/translations';

export default function JobFilterSidebar({ isMobile = false, onClose }) {
  const { language } = useThemeStore();
  const { filters, setFilters, clearFilters, jobs } = useJobStore();
  const t = translations[language] || translations.uz;

  const experienceOptions = [
    { id: "", label: t.all },
    { id: "expNo", label: t.expNo },
    { id: "exp1to3", label: t.exp1to3 },
    { id: "exp3to6", label: t.exp3to6 },
    { id: "expMore6", label: t.expMore6 }
  ];

  const formatOptions = [
    { id: "", label: t.all },
    { id: "formatFull", label: t.formatFull },
    { id: "formatRemote", label: t.formatRemote },
    { id: "formatHybrid", label: t.formatHybrid },
    { id: "formatPartTime", label: t.formatPartTime },
    { id: "formatInternship", label: t.formatInternship }
  ];

  const salaryPresets = [
    { label: t.all, min: 0 },
    { label: "5 000 000+ so'm", min: 5000000 },
    { label: "10 000 000+ so'm", min: 10000000 },
    { label: "15 000 000+ so'm", min: 15000000 },
    { label: "25 000 000+ so'm", min: 25000000 },
    { label: "35 000 000+ so'm", min: 35000000 }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-6">
      
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>{t.filter}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearFilters}
            className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.clearFilters}</span>
          </button>

          {isMobile && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-500" />
          <span>{t.filterCity}</span>
        </label>
        <select
          value={filters.city}
          onChange={(e) => setFilters({ city: e.target.value })}
          className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t.cityPlaceholder}</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-500" />
          <span>{t.filterCategory}</span>
        </label>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
          className="w-full py-2 px-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t.all}</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {language === 'ru' ? cat.nameRu : language === 'en' ? cat.nameEn : cat.nameUz}
            </option>
          ))}
        </select>
      </div>

      {/* Salary Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          <span>{t.filterSalary}</span>
        </label>
        <div className="space-y-1.5">
          {salaryPresets.map((preset, idx) => (
            <label
              key={idx}
              className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 transition-colors"
            >
              <input
                type="radio"
                name="salaryFilter"
                checked={filters.minSalary === preset.min}
                onChange={() => setFilters({ minSalary: preset.min })}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 rounded border-slate-300"
              />
              <span>{preset.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.filterExperience}</span>
        </label>
        <div className="space-y-1.5">
          {experienceOptions.map((exp) => (
            <label
              key={exp.id}
              className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 transition-colors"
            >
              <input
                type="radio"
                name="experienceFilter"
                checked={filters.experience === exp.id}
                onChange={() => setFilters({ experience: exp.id })}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 rounded border-slate-300"
              />
              <span>{exp.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Format Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-purple-500" />
          <span>{t.filterFormat}</span>
        </label>
        <div className="space-y-1.5">
          {formatOptions.map((fmt) => (
            <label
              key={fmt.id}
              className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-blue-600 transition-colors"
            >
              <input
                type="radio"
                name="formatFilter"
                checked={filters.format === fmt.id}
                onChange={() => setFilters({ format: fmt.id })}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 rounded border-slate-300"
              />
              <span>{fmt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {isMobile && (
        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-blue-600 text-white font-semibold text-xs rounded-xl shadow-md"
        >
          Filtrlarni qo'llash
        </button>
      )}

    </div>
  );
}
