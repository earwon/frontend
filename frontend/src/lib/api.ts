import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Needed for Sanctum
  withXSRFToken: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;