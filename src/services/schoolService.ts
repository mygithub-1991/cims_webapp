import { api } from './api';
import { API_ENDPOINTS } from '../config';
import { School, PaginationParams } from '../types';

export const schoolService = {
  // Get all schools
  getAll: async (params?: PaginationParams): Promise<School[]> => {
    return await api.get<School[]>(API_ENDPOINTS.SCHOOLS, { params });
  },

  // Get school by ID
  getById: async (id: number): Promise<School> => {
    return await api.get<School>(`${API_ENDPOINTS.SCHOOLS}/${id}`);
  },

  // Create school
  create: async (data: Partial<School>): Promise<School> => {
    return await api.post<School>(API_ENDPOINTS.SCHOOLS, data);
  },

  // Update school
  update: async (id: number, data: Partial<School>): Promise<School> => {
    return await api.put<School>(`${API_ENDPOINTS.SCHOOLS}/${id}`, data);
  },

  // Soft delete school
  softDelete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.SCHOOLS}/${id}?soft=true`);
  },

  // Hard delete school (permanent)
  hardDelete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.SCHOOLS}/${id}?soft=false`);
  },

  // Legacy method (defaults to soft delete)
  delete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.SCHOOLS}/${id}`);
  },

  // Restore deleted school
  restore: async (id: number): Promise<School> => {
    return await api.post<School>(`${API_ENDPOINTS.SCHOOLS}/${id}/restore`);
  },
};
