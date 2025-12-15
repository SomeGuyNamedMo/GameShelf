import apiClient, { setStoredToken, clearStoredToken } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from './types';

export const authApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    setStoredToken(response.data.token);
    return response.data;
  },

  /**
   * Login with email and password
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    setStoredToken(response.data.token);
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Logout - clear stored token
   */
  logout(): void {
    clearStoredToken();
  },
};

export default authApi;

