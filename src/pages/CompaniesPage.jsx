import React, { useState, useMemo } from 'react';
import { Search, Building2, Sparkles, Filter } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useJobStore } from '../store/useJobStore';
import CompanyCard from '../components/common/CompanyCard';
import { translations } from '../constants/translations';

export default function CompaniesPage() {
  const { language } = useThemeStore();
  const { companies, jobs } = useJobStore();
  const t = translations[language] || translations.uz;

  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  const industries = [
    { id: "all", label: "Barcha sohalar" },
    { id: "fintech", label: "Fintex va To'lovlar" },
    { id: "it", label: "IT va Dasturiy ta'minot" },
    { id: "retail", label: "Chakana savdo (Retail)" },
    { id: "telecom", label: "Telekom" },
    { id: "banking", label: "Bank xizmatlari" },
    { id: "construction", label: "Qurilish va Develompent" }
  ];

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        const inName = c.name.toLowerCase().includes(q);
        const inInd = (c.industryUz || c.industry || "").toLowerCase().includes(q);
        const inLoc = c.location.toLowerCase().includes(q);
        if (!inName && !inInd && !inLoc) return false;
      }

      if (selectedIndustry !== 'all') {
        const ind = (c.industry || "").toLowerCase();
        const indUz = (c.industryUz || "").toLowerCase();
        if (selectedIndustry === 'fintech' && !ind.includes('fintech') && !ind.includes('payment') && !indUz.includes('fintex')) return false;
        if (selectedIndustry === 'it' && !ind.includes('it') && !ind.includes('software') && !ind.includes('tech')) return false;
        if (selectedIndustry === 'retail' && !ind.includes('retail') && !ind.includes('supermarket') && !indUz.includes('savdo')) return false;
        if (selectedIndustry === 'telecom' && !ind.includes('telecom')) return false;
        if (selectedIndustry === 'banking' && !ind.includes('bank')) return false;
        if (selectedIndustry === 'construction' && !ind.includes('construction') && !ind.includes('real estate') && !indUz.includes('qurilish')) return false;
      }

      return true;
    });
  }, [companies, search, selectedIndustry]);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      
      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5" />
            <span>O'zbekistonning eng yaxshi ish beruvchilari</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t.companies} katalogi
          </h1>
          <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
            Nufuzli milliy va xalqaro kompaniyalar muhiti, ochiq vakansiyalari va xodimlarning haqiqiy baholari bilan tanishing.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kompaniya nomi, yo'nalishi yoki joylashuvi..."
              className="w-full pl-12 pr-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
            {filteredCompanies.length} ta kompaniya topildi
          </div>
        </div>

        {/* Industry Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {industries.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setSelectedIndustry(ind.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedIndustry === ind.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500">Hech qanday kompaniya topilmadi.</p>
        </div>
      )}

    </div>
  );
}
