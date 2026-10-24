import React from 'react';
import { 
  Printer, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Briefcase, 
  GraduationCap, 
  Languages, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { formatSalary } from '../../utils/helpers';

export default function ResumePreview({ resume, onEditClick, showPrintBtn = true }) {
  if (!resume) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl max-w-4xl mx-auto space-y-8 print:border-none print:shadow-none print:p-0">
      
      {/* Top Header Actions (Hidden in Print) */}
      {showPrintBtn && (
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Faol qidiruvda (Ishga tayyor)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onEditClick && (
              <button
                onClick={onEditClick}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Tahrirlash
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-600/20"
            >
              <Printer className="w-4 h-4" />
              <span>PDF / Chop etish</span>
            </button>
          </div>
        </div>
      )}

      {/* Candidate Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {resume.fullName || "Ism Familiya"}
          </h1>
          <p className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400">
            {resume.profession || "Mutaxassislik"}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-600 dark:text-slate-400">
            {resume.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {resume.city}
              </span>
            )}
            {resume.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                {resume.phone}
              </span>
            )}
            {resume.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                {resume.email}
              </span>
            )}
            {resume.telegram && (
              <span className="flex items-center gap-1">
                <Send className="w-3.5 h-3.5 text-sky-500" />
                {resume.telegram}
              </span>
            )}
          </div>
        </div>

        {resume.expectedSalary && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left sm:text-right shrink-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Kutilayotgan maosh:
            </span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatSalary(resume.expectedSalary, null, false, 'uz')}
            </span>
          </div>
        )}
      </div>

      {/* Bio / Summary */}
      {resume.bio && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Qisqacha ma'lumot (Summary)
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {resume.bio}
          </p>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Asosiy ko'nikmalar & Texnologiyalar
          </h3>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40 text-xs font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {resume.experiences && resume.experiences.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <span>Ish tajribasi</span>
          </h3>

          <div className="space-y-4 border-l-2 border-slate-200 dark:border-slate-800 pl-4 ml-1">
            {resume.experiences.map((exp, idx) => (
              <div key={idx} className="relative space-y-1">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 absolute -left-[21px] top-1.5 border-2 border-white dark:border-slate-900" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {exp.role} <span className="font-normal text-slate-500 dark:text-slate-400">@ {exp.company}</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">{exp.period}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.educations && resume.educations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-500" />
            <span>Ta'lim</span>
          </h3>

          <div className="space-y-2.5">
            {resume.educations.map((edu, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {edu.institution}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {edu.degree}
                  </p>
                </div>
                <span className="text-xs text-slate-500 font-medium shrink-0">
                  {edu.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-purple-500" />
            <span>Tillar</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {resume.languages.map((lang, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">{lang.language}</span>
                <span className="text-slate-500 dark:text-slate-400">{lang.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
