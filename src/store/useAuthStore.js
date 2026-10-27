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
    name: "Alisher Yusupov (Admin)",
    email: "admin@gmail.com",
    role: "admin",
    title: "Platform Super Admin",
    city: "Toshkent",
    phone: "+998 90 777 00 77",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  }
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: DEMO_USERS.seeker, // Pre-authenticated as demo seeker for convenience
      isAuthenticated: true,

      login: async ({ email, password, role = "seeker", name, companyName }) => {
        const cleanEmail = (email || '').trim().toLowerCase();

        // Special Admin credentials: admin@gmail.com with password admin
        if (cleanEmail === 'admin@gmail.com' && password === 'admin') {
          const adminUser = DEMO_USERS.admin;
          set({ user: adminUser, isAuthenticated: true });
          return { success: true, user: adminUser, role: 'admin' };
        }

        // Try Supabase Auth if configured
        try {
          const { supabase } = await import('../utils/supabaseClient');
          if (supabase) {
            const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
            if (!error && data?.user) {
              const metaRole = data.user.user_metadata?.role || (cleanEmail === 'admin@gmail.com' ? 'admin' : role);
              const authedUser = {
                id: data.user.id,
                name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
                email: data.user.email,
                role: metaRole,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`
              };
              set({ user: authedUser, isAuthenticated: true });
              return { success: true, user: authedUser, role: metaRole };
            }
          }
        } catch (err) {
          // fallback to local auth
        }

        const newUser = {
          id: `user-${Date.now()}`,
          name: name || (cleanEmail.split('@')[0]),
          email: cleanEmail,
          role: cleanEmail === 'admin@gmail.com' ? 'admin' : role,
          companyId: role === 'employer' ? 'custom-co' : undefined,
          companyName: role === 'employer' ? (companyName || "Mening Kompaniyam") : undefined,
          title: role === 'seeker' ? "Mutaxassis" : "HR Menejer",
          city: "Toshkent",
          phone: "+998 90 000 00 00",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`
        };
        set({ user: newUser, isAuthenticated: true });
        return { success: true, user: newUser, role: newUser.role };
      },

      loginWithPhone: ({ phone, name, role = "seeker", companyName }) => {
        const cleanPhone = (phone || '').trim();
        const isSpecialAdmin = cleanPhone.includes("7770077") || cleanPhone.includes("admin");
        const assignedRole = isSpecialAdmin ? "admin" : role;

        const newUser = {
          id: `user-phone-${Date.now()}`,
          name: name || (assignedRole === 'admin' ? "Super Admin" : "Foydalanuvchi"),
          phone: cleanPhone,
          email: `${cleanPhone.replace(/\D/g, '')}@ishtop.uz`,
          role: assignedRole,
          companyId: assignedRole === 'employer' ? 'custom-co' : undefined,
          companyName: assignedRole === 'employer' ? (companyName || "Mening Kompaniyam") : undefined,
          title: assignedRole === 'seeker' ? "Kandidat" : assignedRole === 'admin' ? "Super Admin" : "Kompaniya vakili",
          city: "Toshkent",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanPhone}`
        };
        set({ user: newUser, isAuthenticated: true });
        return { success: true, user: newUser, role: assignedRole };
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
