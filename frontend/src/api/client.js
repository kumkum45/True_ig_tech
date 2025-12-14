import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
});

// JWT storage helpers
export const saveToken = (token) => localStorage.setItem("jwt", token);
export const getToken = () => localStorage.getItem("jwt");

// attach Authorization header when token available
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  return config;
});

export default api;
