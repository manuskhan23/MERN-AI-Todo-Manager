import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

api.interceptors.request.use(async (config) => {
  // Use the Clerk singleton to get the current session token.
  // This ensures every request has a fresh, valid token if a session exists.
  try {
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Clerk token retrieval failed", error);
  }
  return config;
});

export default api;