import axios from 'axios';
// Ngoại lệ có chủ đích: import thẳng store để tránh vòng lặp import qua index.ts.
import { useAuthStore } from '@/features/auth/store/authStore';
import { useCartStore } from '@/features/cart/store/cartStore';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const authClient = axios.create({ baseURL: apiBaseUrl });
export const apiClient = axios.create({ baseURL: apiBaseUrl });

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      useCartStore.getState().clear();
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  },
);
