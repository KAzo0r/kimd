import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_COMPANIES, MOCK_JOBS, DEFAULT_USER_RESUME } from '../constants/mockData';

const INITIAL_APPLICATIONS = [
  {
    id: "app-101",
    jobId: "job-1",
    jobTitle: "Senior React / Next.js Frontend Developer",
    companyId: "uzum",
    companyName: "Uzum Group",
    applicantId: "user-seeker-1",
    applicantName: "Javohir Karimov",
    applicantEmail: "javohir@ishtop.uz",
    applicantPhone: "+998 90 123 45 67",
    applicantCity: "Toshkent",
    coverLetter: "Assalomu alaykum! Uzum jamoasiga qo'shilish va millionlab xaridorlarga xizmat ko'rsatuvchi interfeyslarni yanada qulay qilish istagidaman. Tajribam va portfoliom mos keladi deb hisoblayman.",
    appliedAt: "2026-10-21T14:30:00Z",
    status: "interview", // 'applied' | 'reviewed' | 'interview' | 'accepted' | 'rejected'
    notes: "Texnik suhbatga taklif etildi. Shanba soat 15:00 da Zoom orqali."
  },
  {
    id: "app-102",
    jobId: "job-4",
    jobTitle: "iOS Swift Developer (Click Up)",
    companyId: "click",
    companyName: "CLICK Uzbekistan",
    applicantId: "user-seeker-1",
    applicantName: "Javohir Karimov",
    applicantEmail: "javohir@ishtop.uz",
    applicantPhone: "+998 90 123 45 67",
    applicantCity: "Toshkent",
    coverLetter: "CLICK mobil to'lovlari ekotizimi O'zbekistonda eng sevimli ilovalardan. Swift va SwiftUI bo'yicha amaliy ishlarimni taqdim eta olaman.",
    appliedAt: "2026-10-19T11:00:00Z",
    status: "reviewed",
    notes: "HR ko'rib chiqdi, jamoa yetakchisiga uzatildi."
  },
  {
    id: "app-103",
    jobId: "job-2",
    jobTitle: "Middle / Senior Go (Golang) Backend Developer",
    companyId: "payme",
    companyName: "Payme (Paycom)",
    applicantId: "user-seeker-2",
    applicantName: "Akmal Saidov",
    applicantEmail: "akmal.saidov@example.com",
    applicantPhone: "+998 93 456 78 90",
    applicantCity: "Toshkent",
    coverLetter: "Yuqori yuklamali tizimlar va mikroservislar bo'yicha 4 yillik tajribam bor.",
    appliedAt: "2026-10-20T17:20:00Z",
    status: "applied",
    notes: ""
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Suhbatga taklifnoma! 🎉",
    message: "Uzum Group sizni 'Senior React Developer' vakansiyasi bo'yicha texnik suhbatga taklif qildi.",
    date: "2026-10-21T15:00:00Z",
    unread: true,
    type: "interview",
    link: "/dashboard"
  },
  {
    id: "notif-2",
    title: "Arizangiz ko'rib chiqildi 📄",
    message: "CLICK Uzbekistan sizning 'iOS Swift Developer' vakansiyasiga arizangizni ko'rib chiqdi.",
    date: "2026-10-19T12:00:00Z",
    unread: false,
    type: "status",
    link: "/dashboard"
  },
  {
    id: "notif-3",
    title: "Yangi mos vakansiya topildi ✨",
    message: "TBC Bank 'Middle QA Automation Engineer' vakansiyasini joylashtirdi.",
    date: "2026-10-17T11:30:00Z",
    unread: false,
    type: "job",
    link: "/jobs/job-5"
  }
];

export const useJobStore = create(
  persist(
    (set, get) => ({
      jobs: MOCK_JOBS,
      companies: MOCK_COMPANIES,
      applications: INITIAL_APPLICATIONS,
      favorites: ["job-1", "job-3", "job-11"],
      resume: DEFAULT_USER_RESUME,
      notifications: INITIAL_NOTIFICATIONS,

      // Filter state
      filters: {
        query: "",
        city: "",
        category: "",
        experience: "",
        format: "",
        minSalary: 0,
        maxSalary: 60000000,
        sortBy: "newest" // 'newest' | 'salaryHigh' | 'salaryLow' | 'popular'
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }));
      },

      clearFilters: () => {
        set({
          filters: {
            query: "",
            city: "",
            category: "",
            experience: "",
            format: "",
            minSalary: 0,
            maxSalary: 60000000,
            sortBy: "newest"
          }
        });
      },

      toggleFavorite: (jobId) => {
        set((state) => {
          const isFav = state.favorites.includes(jobId);
          return {
            favorites: isFav
              ? state.favorites.filter((id) => id !== jobId)
              : [...state.favorites, jobId]
          };
        });
      },

      applyToJob: ({ jobId, coverLetter, applicantInfo, resumeData }) => {
        const state = get();
        const targetJob = state.jobs.find((j) => j.id === jobId);
        if (!targetJob) return { success: false, message: "Job not found" };

        const newApplication = {
          id: `app-${Date.now()}`,
          jobId,
          jobTitle: targetJob.title,
          companyId: targetJob.companyId,
          companyName: targetJob.companyName,
          applicantId: applicantInfo?.id || "user-seeker-1",
          applicantName: applicantInfo?.name || "Javohir Karimov",
          applicantEmail: applicantInfo?.email || "applicant@ishtop.uz",
          applicantPhone: applicantInfo?.phone || "+998 90 123 45 67",
          applicantCity: applicantInfo?.city || "Toshkent",
          coverLetter: coverLetter || "Mening rezyumem ushbu lavozim talablariga to'liq javob beradi deb hisoblayman.",
          appliedAt: new Date().toISOString(),
          status: "applied",
          notes: "Yangi kelib tushgan ariza",
          resumeSnapshot: resumeData || state.resume
        };

        const newNotification = {
          id: `notif-${Date.now()}`,
          title: "Ariza muvaffaqiyatli topshirildi!",
          message: `${targetJob.companyName} kompaniyasiga '${targetJob.title}' bo'yicha arizangiz yuborildi.`,
          date: new Date().toISOString(),
          unread: true,
          type: "application",
          link: "/dashboard"
        };

        // Update jobs applicant count
        const updatedJobs = state.jobs.map((j) =>
          j.id === jobId ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j
        );

        set({
          applications: [newApplication, ...state.applications],
          notifications: [newNotification, ...state.notifications],
          jobs: updatedJobs
        });

        return { success: true, application: newApplication };
      },

      updateApplicationStatus: (applicationId, newStatus, note = "") => {
        set((state) => {
          const targetApp = state.applications.find((a) => a.id === applicationId);
          if (!targetApp) return state;

          const updatedApps = state.applications.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus, notes: note || app.notes } : app
          );

          const statusTitles = {
            applied: "Arizangiz qabul qilindi",
            reviewed: "Arizangiz ko'rib chiqilmoqda 🔍",
            interview: "Siz suhbatga taklif qilindingiz! 🎯",
            accepted: "Tabriklaymiz! Siz ishga qabul qilindingiz! 🥳",
            rejected: "Afsuski, arizangiz rad etildi"
          };

          const newNotif = {
            id: `notif-${Date.now()}`,
            title: statusTitles[newStatus] || "Ariza holati yangilandi",
            message: `${targetApp.companyName} - '${targetApp.jobTitle}' vakansiyasi bo'yicha holat: ${newStatus}`,
            date: new Date().toISOString(),
            unread: true,
            type: newStatus,
            link: "/dashboard"
          };

          return {
            applications: updatedApps,
            notifications: [newNotif, ...state.notifications]
          };
        });
      },

      addJob: (newJob) => {
        const id = `job-${Date.now()}`;
        const createdJob = {
          id,
          views: 1,
          applicantsCount: 0,
          createdAt: new Date().toISOString(),
          featured: false,
          urgent: false,
          ...newJob
        };

        set((state) => ({
          jobs: [createdJob, ...state.jobs],
          notifications: [
            {
              id: `notif-${Date.now()}`,
              title: "Vakansiya e'lon qilindi!",
              message: `'${createdJob.title}' vakansiyasi muvaffaqiyatli joylashtirildi.`,
              date: new Date().toISOString(),
              unread: true,
              type: "job",
              link: `/jobs/${id}`
            },
            ...state.notifications
          ]
        }));
        return createdJob;
      },

      updateJob: (jobId, updatedData) => {
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, ...updatedData } : j))
        }));
      },

      deleteJob: (jobId) => {
        set((state) => ({
          jobs: state.jobs.filter((j) => j.id !== jobId),
          favorites: state.favorites.filter((id) => id !== jobId)
        }));
      },

      toggleJobFeatured: (jobId) => {
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, featured: !j.featured } : j))
        }));
      },

      incrementJobViews: (jobId) => {
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === jobId ? { ...j, views: (j.views || 0) + 1 } : j))
        }));
      },

      saveResume: (newResume) => {
        set({ resume: newResume });
      },

      markNotificationRead: (notifId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notifId ? { ...n, unread: false } : n
          )
        }));
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, unread: false }))
        }));
      },

      deleteNotification: (notifId) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== notifId)
        }));
      }
    }),
    {
      name: 'ishtop-job-storage'
    }
  )
);
