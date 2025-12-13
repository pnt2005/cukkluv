import { create } from "zustand";
import { authAPI } from "../utils/api";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    try {
      const data = await authAPI.getCurrentUser();
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: () => {
    localStorage.clear();
    set({ user: null });
  },
}));
