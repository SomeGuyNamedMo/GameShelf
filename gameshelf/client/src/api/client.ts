import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from './types';

// Environment-based configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
// Default to mock mode in development when no backend is available
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' && import.meta.env.DEV;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Token storage key
const TOKEN_KEY = 'gameshelf_token';

// Get stored token
export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Set token
export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Clear token
export const clearStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle 401 - unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      clearStoredToken();
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Extract error message
    const message = error.response?.data?.error?.message 
      || error.message 
      || 'An unexpected error occurred';
    
    // Create enhanced error
    const enhancedError = new Error(message) as Error & { 
      code?: string; 
      status?: number;
      details?: Record<string, unknown>;
    };
    enhancedError.code = error.response?.data?.error?.code;
    enhancedError.status = error.response?.status;
    enhancedError.details = error.response?.data?.error?.details;
    
    return Promise.reject(enhancedError);
  }
);

// Export client and config
export { apiClient, USE_MOCK, API_BASE_URL };
export default apiClient;

