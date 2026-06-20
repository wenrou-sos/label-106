import { create } from 'zustand';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

const STORAGE_KEY = 'nail-salon-auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  rememberMe: boolean;
  login: (username: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  hydrateFromStorage: () => void;
}

const generateToken = (): string => {
  return btoa(`${Date.now()}-${Math.random().toString(36).substring(2)}`);
};

const loadFromStorage = (): { user: User | null; token: string | null; isAuthenticated: boolean } => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return { user: null, token: null, isAuthenticated: false };
};

const saveToStorage = (state: { user: User | null; token: string | null; isAuthenticated: boolean }) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
};

const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
};

const initialStored = loadFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialStored.user,
  token: initialStored.token,
  isAuthenticated: initialStored.isAuthenticated,
  isLoading: false,
  error: null,
  rememberMe: initialStored.isAuthenticated,

  login: async (username: string, password: string, remember = true) => {
    set({ isLoading: true, error: null });

    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = mockUsers.find((u) => u.username === username);

    if (user && password === '123456') {
      const token = generateToken();
      const authData = {
        user,
        token,
        isAuthenticated: true,
      };

      if (remember) {
        saveToStorage(authData);
      } else {
        clearStorage();
      }

      set({
        ...authData,
        isLoading: false,
        error: null,
        rememberMe: remember,
      });
      return true;
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: '用户名或密码错误',
      rememberMe: remember,
    });
    return false;
  },

  logout: () => {
    clearStorage();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: false,
    });
  },

  clearError: () => set({ error: null }),

  hydrateFromStorage: () => {
    const stored = loadFromStorage();
    if (stored.isAuthenticated && stored.user && stored.token) {
      set({
        user: stored.user,
        token: stored.token,
        isAuthenticated: true,
        rememberMe: true,
      });
    }
  },
}));
