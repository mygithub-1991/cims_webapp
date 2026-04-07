import { api } from './api';
import { API_ENDPOINTS } from '../config';
import { Teacher, PaginationParams } from '../types';

export const teacherService = {
  // Get all teachers
  getAll: async (params?: PaginationParams): Promise<Teacher[]> => {
    return await api.get<Teacher[]>(API_ENDPOINTS.TEACHERS, { params });
  },

  // Get teacher by ID
  getById: async (id: number): Promise<Teacher> => {
    return await api.get<Teacher>(`${API_ENDPOINTS.TEACHERS}/${id}`);
  },

  // Create teacher
  create: async (data: Partial<Teacher>): Promise<Teacher> => {
    return await api.post<Teacher>(API_ENDPOINTS.TEACHERS, data);
  },

  // Update teacher
  update: async (id: number, data: Partial<Teacher>): Promise<Teacher> => {
    return await api.put<Teacher>(`${API_ENDPOINTS.TEACHERS}/${id}`, data);
  },

  // Delete teacher (soft delete)
  delete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.TEACHERS}/${id}`);
  },

  // Restore deleted teacher
  restore: async (id: number): Promise<Teacher> => {
    return await api.post<Teacher>(`${API_ENDPOINTS.TEACHERS}/${id}/restore`);
  },
};
