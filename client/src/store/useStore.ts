'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { translations, Lang } from '@/i18n/translations';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  favorites: string[];
  notifications: Notification[];
}

interface Notification {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Language
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (section: string, key: string) => string;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (articleId: string) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      theme: 'dark',
      lang: 'fr',
      notifications: [],
      favorites: [],

      t: (section: string, key: string) => {
        const lang = get().lang;
        const trans = translations[lang] as any;
        return trans?.[section]?.[key] || key;
      },

      setLang: (lang) => set({ lang }),

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          if (typeof window !== 'undefined') localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token, favorites: data.user.favorites || [], isLoading: false });
        } catch (err: any) {
          set({ isLoading: false });
          throw new Error(err.response?.data?.message || 'Login failed');
        }
      },

      register: async (username, email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', { username, email, password });
          if (typeof window !== 'undefined') localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token, favorites: data.user.favorites || [], isLoading: false });
        } catch (err: any) {
          set({ isLoading: false });
          throw new Error(err.response?.data?.message || 'Registration failed');
        }
      },

      logout: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('token');
        set({ user: null, token: null, favorites: [] });
      },

      loadUser: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user, favorites: data.user.favorites?.map((f: any) => f._id || f) || [] });
        } catch {
          if (typeof window !== 'undefined') localStorage.removeItem('token');
          set({ user: null, token: null });
        }
      },

      updateProfile: async (profileData) => {
        const { data } = await api.put('/auth/profile', profileData);
        set({ user: data.user });
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => n._id === id ? { ...n, read: true } : n),
        }));
      },

      toggleFavorite: async (articleId) => {
        const { user, favorites } = get();
        if (!user) throw new Error('Login required');
        const { data } = await api.post(`/articles/${articleId}/favorite`);
        if (data.isFavorite) {
          set({ favorites: [...favorites, articleId] });
        } else {
          set({ favorites: favorites.filter((id) => id !== articleId) });
        }
      },
    }),
    {
      name: 'otaku-news-store',
      partialize: (state) => ({ theme: state.theme, lang: state.lang, token: state.token }),
    }
  )
);
