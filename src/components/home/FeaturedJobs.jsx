import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useJobStore } from '../../store/useJobStore';
import JobCard from '../common/JobCard';
import JobApplyModal from '../jobs/JobApplyModal';
import { translations } from '../../constants/translations';

export default function FeaturedJobs() {
  const { language } = useThemeStore();
  const { jobs } = useJobStore();
  const t = translations[language] || translations.uz;

  const [activeTab, setActiveTab] = useState('all');
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  // Filter jobs based on tab
  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'it') return job.category === 'it';
    if (activeTab === 'finance') return job.category === 'finance';
    if (activeTab === 'marketing') return job.category === 'marketing' || job.category === 'sales';
    if (activeTab === 'remote') return job.format === 'formatRemote';
    return true; // 'all'
  }).slice(0, 6);

  const tabs = [
    { id: 'all', label: t.all },
    { id: 'it', label: "IT & Dasturlash" },
    { id: 'finance', label: "Moliya & Bank" },
    { id: 'marketing', label: "Marketing & Savdo" },
    { id: 'remote', label: "Masofaviy (Remote)" },
  ];

  return (
    <section className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.featuredJobsSubtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.featuredJobsTitle}
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApplyClick={(j) => setSelectedJobForApply(j)}
            />
          ))}
        </div>

        {/* Bottom CTA to see all */}
        <div className="mt-12 text-center">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white shadow-md hover:shadow-lg transition-all"
          >
            <span>Barcha {jobs.length} ta vakansiyani ko'rish</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </Link>
        </div>

      </div>

      {/* Interactive Apply Modal */}
      <JobApplyModal
        job={selectedJobForApply}
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
      />
    </section>
  );
}
