import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEMO_USERS = {
  seeker: {
    id: "user-seeker-1",
    name: "Javohir Karimov",
    email: "javohir@ishtop.uz",
    role: "seeker",
    title: "Frontend Developer",
    city: "Toshkent",
    phone: "+998 90 123 45 67",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  employer: {
    id: "user-employer-1",
    name: "Sarvar Rustamov",
    email: "hr@uzum.uz",
    role: "employer",
    title: "HR Director",
    companyId: "uzum",
    companyName: "Uzum Group",
    city: "Toshkent",
    phone: "+998 71 200 00 00",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  admin: {
    id: "user-admin-1",
    name: "Alisher Yusupov",
    email: "admin@ishtop.uz",
    role: "admin",
    title: "Platform Super Admin",
    city: "Toshkent",
    phone: "+998 97 777 00 77",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: DEMO_USERS.seeker, // Pre-authenticated as demo seeker for convenience
      isAuthenticated: true,

      login: ({ email, password, role = "seeker", name, companyName }) => {
        const newUser = {
          id: `user-${Date.now()}`,
          name: name || (email.split('@')[0]),
          email,
          role,
          companyId: role === 'employer' ? 'custom-co' : undefined,
          companyName: role === 'employer' ? (companyName || "Mening Kompaniyam") : undefined,
          title: role === 'seeker' ? "Mutaxassis" : "HR Menejer",
          city: "Toshkent",
          phone: "+998 90 000 00 00",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        set({ user: newUser, isAuthenticated: true });
        return { success: true };
      },

      quickDemoLogin: (role) => {
        const demoUser = DEMO_USERS[role] || DEMO_USERS.seeker;
        set({ user: demoUser, isAuthenticated: true });
        return demoUser;
      },

      register: ({ name, email, password, role, companyName }) => {
        const newUser = {
          id: `user-${Date.now()}`,
          name,
          email,
          role,
          companyId: role === 'employer' ? 'custom-co' : undefined,
          companyName: role === 'employer' ? companyName : undefined,
          title: role === 'seeker' ? "Kandidat" : "Kompaniya vakili",
          city: "Toshkent",
          phone: "+998 90 000 00 00",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };
        set({ user: newUser, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (updatedFields) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...updatedFields } });
      }
    }),
    {
      name: 'ishtop-auth-storage'
    }
  )
);
