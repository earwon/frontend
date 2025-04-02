import { defineStore } from "pinia";
import api from "@/lib/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as { name: string; email: string; password: string; password_confirmation: string; role: string; } | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === "admin",
  },
  actions: {
    async fetchUser() {
      try {
        const response = await api.get("/user");
        this.user = response.data;
      } catch {
        this.user = null;
      }
    },
    async login(user: {email: string, password: string}) {
      await api.get("/sanctum/csrf-cookie"); // Required for Sanctum CSRF protection
      await api.post("/login", user);
      await this.fetchUser();
    },
    async logout() {
      await api.post("/logout");
      this.user = null;
    },

    async register(user: {name: string, email: string, password: string, password_confirmation: string, role:string}) {
      await api.get("/sanctum/csrf-cookie"); // Required for Sanctum CSRF protection
      await api.post("/register", user);
      await this.fetchUser();
    }
  },
});