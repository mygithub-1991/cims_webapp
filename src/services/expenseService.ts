import { api } from './api';
import { API_ENDPOINTS } from '../config';
import { Expense, DateFilter } from '../types';

export const expenseService = {
  // Get all expenses
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    category?: string;
    start_date?: number;
    end_date?: number;
  }): Promise<Expense[]> => {
    return await api.get<Expense[]>(API_ENDPOINTS.EXPENSES, { params });
  },

  // Get expense by ID
  getById: async (id: number): Promise<Expense> => {
    return await api.get<Expense>(`${API_ENDPOINTS.EXPENSES}/${id}`);
  },

  // Create expense
  create: async (data: Partial<Expense>): Promise<Expense> => {
    return await api.post<Expense>(API_ENDPOINTS.EXPENSES, data);
  },

  // Update expense
  update: async (id: number, data: Partial<Expense>): Promise<Expense> => {
    return await api.put<Expense>(`${API_ENDPOINTS.EXPENSES}/${id}`, data);
  },

  // Soft delete expense
  softDelete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.EXPENSES}/${id}?soft=true`);
  },

  // Hard delete expense (permanent)
  hardDelete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.EXPENSES}/${id}?soft=false`);
  },

  // Legacy method (defaults to soft delete)
  delete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.EXPENSES}/${id}`);
  },

  // Restore deleted expense
  restore: async (id: number): Promise<Expense> => {
    return await api.post<Expense>(`${API_ENDPOINTS.EXPENSES}/${id}/restore`);
  },

  // Get expense summary by category
  getSummary: async (params?: DateFilter): Promise<{ category: string; total: number }[]> => {
    return await api.get<{ category: string; total: number }[]>(
      `${API_ENDPOINTS.EXPENSES}/summary`,
      { params }
    );
  },
};
