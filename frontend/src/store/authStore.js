import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  hydrated: false,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
  setHydrated: (hydrated) => set({ hydrated }),
}));

