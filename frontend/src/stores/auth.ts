import { defineStore } from "pinia";
import api from "@/lib/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token") || null,
  }),
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
      const response = await api.post("/login", user);
      // Store token in local storage
      this.setUser(response.data.user, response.data.token);
    },

    setUser(user: any, token: string) {
      this.user = user;
      this.token = token;
      localStorage.setItem("user", JSON.stringify(user)); 
      localStorage.setItem("token", token);
    },
    
    async logout() {
      this.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    async register(user: {name: string, email: string, password: string, password_confirmation: string, role:string}) {
      await api.get("/sanctum/csrf-cookie"); // Required for Sanctum CSRF protection
      const response = await api.post("/register", user);

      sessionStorage.setItem("autofill_email", user.email);
      sessionStorage.setItem("autofill_password", user.password);

      this.setUser(response.data.user, response.data.token);
    }
  },
  getters: {
    // Check if a token is available, implying the user is authenticated
    isAuthenticated: (state) => {
      return !!state.token; // Return true if token exists, false otherwise
    },
    getUserRole: (state) => state.user?.role || "user",
    isAdmin: (state) => state.user?.role === "admin",
  },
});