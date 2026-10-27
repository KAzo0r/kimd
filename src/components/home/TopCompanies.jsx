import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useJobStore } from '../../store/useJobStore';
import CompanyCard from '../common/CompanyCard';
import { translations } from '../../constants/translations';

export default function TopCompanies() {
  const { language } = useThemeStore();
  const { companies } = useJobStore();
  const t = translations[language] || translations.uz;

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {t.topCompaniesSubtitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.topCompaniesTitle}
          </h2>
        </div>

        <Link
          to="/companies"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>{language === 'ru' ? `Все ${companies.length} компаний` : language === 'en' ? `All ${companies.length} companies` : `Barcha ${companies.length} ta kompaniya`}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {companies.slice(0, 8).map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

    </section>
  );
}
