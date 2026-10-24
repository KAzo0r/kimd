import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Filter, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useJobStore } from '../store/useJobStore';
import JobCard from '../components/common/JobCard';
import JobFilterSidebar from '../components/jobs/JobFilterSidebar';
import JobApplyModal from '../components/jobs/JobApplyModal';
import { translations, CITIES } from '../constants/translations';

export default function JobsPage() {
  const { language } = useThemeStore();
  const { jobs, filters, setFilters, clearFilters } = useJobStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const t = translations[language] || translations.uz;

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);

  // Sync URL search params with store
  useEffect(() => {
    const query = searchParams.get('query');
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const format = searchParams.get('format');

    const updates = {};
    if (query !== null) updates.query = query;
    if (city !== null) updates.city = city;
    if (category !== null) updates.category = category;
    if (format !== null) updates.format = format;

    if (Object.keys(updates).length > 0) {
      setFilters(updates);
    }
  }, [searchParams]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Query match (title, company, description)
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const inTitle = job.title.toLowerCase().includes(q);
        const inCompany = job.companyName.toLowerCase().includes(q);
        const inDescUz = job.descriptionUz?.toLowerCase().includes(q);
        const inDescRu = job.descriptionRu?.toLowerCase().includes(q);
        if (!inTitle && !inCompany && !inDescUz && !inDescRu) return false;
      }

      // City match
      if (filters.city && job.city !== filters.city) {
        return false;
      }

      // Category match
      if (filters.category && job.category !== filters.category) {
        return false;
      }

      // Experience match
      if (filters.experience && job.experience !== filters.experience) {
        return false;
      }

      // Format match
      if (filters.format && job.format !== filters.format) {
        return false;
      }

      // Min Salary match
      if (filters.minSalary > 0) {
        const jobMaxSalary = job.salaryMax || job.salaryMin || 0;
        if (jobMaxSalary < filters.minSalary) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'salaryHigh') {
        return (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0);
      }
      if (filters.sortBy === 'salaryLow') {
        return (a.salaryMin || 0) - (b.salaryMin || 0);
      }
      if (filters.sortBy === 'popular') {
        return (b.views || 0) - (a.views || 0);
      }
      // 'newest' default
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [jobs, filters]);

  const activeFiltersCount = [
    filters.query,
    filters.city,
    filters.category,
    filters.experience,
    filters.format,
    filters.minSalary > 0
  ].filter(Boolean).length;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Query input */}
          <div className="relative flex-1 w-full flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters({ query: e.target.value })}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3 text-sm rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* City quick select */}
          <div className="relative w-full sm:w-64">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
            <select
              value={filters.city}
              onChange={(e) => setFilters({ city: e.target.value })}
              className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">{t.cityPlaceholder}</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="w-full sm:w-auto lg:hidden px-4 py-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-900"
          >
            <Filter className="w-4 h-4" />
            <span>{t.filter}</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Faol filtrlar:</span>
            
            {filters.query && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <span>"{filters.query}"</span>
                <button onClick={() => setFilters({ query: "" })} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.city && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <span>{filters.city}</span>
                <button onClick={() => setFilters({ city: "" })} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <span>Kategoriya: {filters.category}</span>
                <button onClick={() => setFilters({ category: "" })} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.format && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <span>Format</span>
                <button onClick={() => setFilters({ format: "" })} className="hover:text-rose-500">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-rose-600 hover:underline ml-2"
            >
              {t.clearFilters}
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-24">
          <JobFilterSidebar />
        </div>

        {/* Jobs List Section */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Results Bar & Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">{filteredJobs.length}</span> {t.resultsFound}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">{t.sortBy}:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ sortBy: e.target.value })}
                  className="py-1.5 px-3 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="newest">{t.newest}</option>
                  <option value="salaryHigh">{t.salaryHigh}</option>
                  <option value="salaryLow">{t.salaryLow}</option>
                  <option value="popular">{t.popular}</option>
                </select>
              </div>

              {/* View layout toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Hech qanday vakansiya topilmadi
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Tanlangan filtrlar yoki qidiruv so'zi bo'yicha ma'lumot topilmadi. Filtrlarni tozalab ko'ring yoki boshqa so'z bilan izlang.
              </p>
              <div>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  {t.clearFilters}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Jobs Grid or List */}
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-5'
                  : 'space-y-4'
              }>
                {filteredJobs.slice(0, visibleCount).map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApplyClick={(j) => setSelectedJobForApply(j)}
                    isCompact={viewMode === 'list'}
                  />
                ))}
              </div>

              {/* Load more button */}
              {visibleCount < filteredJobs.length && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="px-8 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white shadow-sm transition-all"
                  >
                    Yana ko'proq vakansiyalarni yuklash ({filteredJobs.length - visibleCount} ta qoldi)
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <JobFilterSidebar isMobile onClose={() => setMobileFilterOpen(false)} />
          </div>
        </div>
      )}

      {/* Interactive Apply Modal */}
      <JobApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
      />

    </div>
  );
}
