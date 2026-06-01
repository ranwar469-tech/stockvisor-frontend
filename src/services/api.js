import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || /* 'https://frigidity-bunkbed-stalemate.ngrok-free.dev/' */ 'http://localhost:8000'  /*'https://stockvisor-backend.onrender.com'*/ ,
  headers: { 'Content-Type': 'application/json' },
});

api.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sv_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || '';
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('sv_token');
      localStorage.removeItem('sv_user');
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
