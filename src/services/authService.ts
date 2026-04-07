import { api } from './api';
import { API_ENDPOINTS, TOKEN_KEY, USER_KEY } from '../config';
import { LoginRequest, LoginResponse, User } from '../types';

export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);

    // Store token and user data
    if (response.access_token) {
      localStorage.setItem(TOKEN_KEY, response.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    }

    return response;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return await api.get<User>(API_ENDPOINTS.ME);
  },

  // Get stored user from localStorage
  getStoredUser: (): User | null => {
    const userJson = localStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Register new user (Admin only)
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    role: string;
  }): Promise<User> => {
    return await api.post<User>(API_ENDPOINTS.REGISTER, userData);
  },

  // Get all users (Admin only)
  getAllUsers: async (): Promise<User[]> => {
    return await api.get<User[]>(API_ENDPOINTS.USERS);
  },

  // Update user (Admin only)
  updateUser: async (userId: number, data: Partial<User>): Promise<User> => {
    return await api.put<User>(`${API_ENDPOINTS.USERS}/${userId}`, data);
  },

  // Delete user (Admin only)
  deleteUser: async (userId: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.USERS}/${userId}`);
  },
};
