import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Send, CheckCircle2, FileText, User, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useJobStore } from '../../store/useJobStore';
import { translations } from '../../constants/translations';
import { formatSalary } from '../../utils/helpers';

export default function JobApplyModal({ job, isOpen, onClose }) {
  const { language } = useThemeStore();
  const { user } = useAuthStore();
  const { resume, applyToJob } = useJobStore();
  const t = translations[language] || translations.uz;

  const defaultCoverLetter = language === 'ru'
    ? 'Здравствуйте! Требования по данной вакансии соответствуют моим навыкам. Буду рад присоединиться к вашей команде.'
    : language === 'en'
    ? 'Hello! The requirements for this position match my skills. I would be thrilled to join your team.'
    : "Assalomu alaykum! Ushbu vakansiya bo'yicha talablar mening ko'nikmalarimga mos keladi. Sizning jamoangizda yangi marralarni zabt etishga tayyorman.";

  const [coverLetter, setCoverLetter] = useState(defaultCoverLetter);
  const [applicantName, setApplicantName] = useState(user?.name || resume?.fullName || "Javohir Karimov");
  const [applicantEmail, setApplicantEmail] = useState(user?.email || resume?.email || "javohir@ishtop.uz");
  const [applicantPhone, setApplicantPhone] = useState(user?.phone || resume?.phone || "+998 90 123 45 67");
  const [applicantCity, setApplicantCity] = useState(user?.city || resume?.city || "Toshkent");
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      applyToJob({
        jobId: job.id,
        coverLetter,
        applicantInfo: {
          id: user?.id || "user-seeker-1",
          name: applicantName,
          email: applicantEmail,
          phone: applicantPhone,
          city: applicantCity,
        },
        resumeData: resume
      });

      // Send Telegram notification to @apexishqidirish_bot
      try {
        import('../../utils/telegramService').then(({ notifyNewApplication }) => {
          notifyNewApplication({
            job,
            applicantInfo: {
              name: applicantName,
              email: applicantEmail,
              phone: applicantPhone,
              city: applicantCity
            },
            coverLetter
          });
        });
      } catch (err) {
        console.warn('Telegram job notification deferred:', err);
      }

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if canvas-confetti is not loaded
      }
    }, 600);
  };

  const handleModalClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleModalClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.applicationSuccess}
            </h3>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {t.applicationSuccessDesc}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <p><span className="font-semibold text-slate-900 dark:text-white">{language === 'ru' ? 'Вакансия:' : language === 'en' ? 'Vacancy:' : 'Vakansiya:'}</span> {job.title}</p>
              <p><span className="font-semibold text-slate-900 dark:text-white">{language === 'ru' ? 'Компания:' : language === 'en' ? 'Company:' : 'Kompaniya:'}</span> {job.companyName}</p>
              <p><span className="font-semibold text-slate-900 dark:text-white">{language === 'ru' ? 'Соискатель:' : language === 'en' ? 'Applicant:' : 'Ariza beruvchi:'}</span> {applicantName} ({applicantPhone})</p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleModalClose}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-md shadow-blue-600/20"
              >
                {language === 'ru' ? 'Понятно, спасибо!' : language === 'en' ? 'Understood, thank you!' : 'Tushundim, rahmat!'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{job.companyName}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t.applyModalTitle}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {job.title} • <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatSalary(job.salaryMin, job.salaryMax, job.salaryNegotiable, language)}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Applicant Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.fullName}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.phone}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.email}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.city}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={applicantCity}
                      onChange={(e) => setApplicantCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Attached Resume Banner */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-600 text-white">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {resume?.profession || "Frontend Developer"} {language === 'ru' ? 'резюме' : language === 'en' ? 'resume' : 'rezyumesi'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'ru' ? 'Автоматически прикреплено из профиля' : language === 'en' ? 'Automatically attached from profile' : 'IshTop.uz profili orqali avtomatik biriktiriladi'}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  {language === 'ru' ? 'Готово' : language === 'en' ? 'Ready' : 'Tayyor'}
                </span>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.coverLetterLabel}
                </label>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder={t.coverLetterPlaceholder}
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-600/20 hover:scale-[1.01] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? (language === 'ru' ? 'Отправка...' : language === 'en' ? 'Sending...' : 'Yuborilmoqda...') : t.sendApplication}</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
