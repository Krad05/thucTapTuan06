import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setSession: (user: User, accessToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: (user, accessToken) => set({ user, accessToken }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'auth',
      // Phiên đăng nhập hết khi đóng tab, giảm thời gian token tồn tại trên thiết bị.
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    },
  ),
);
