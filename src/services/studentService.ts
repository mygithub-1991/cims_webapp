import { api } from './api';
import { API_ENDPOINTS } from '../config';
import { Student, PaginationParams } from '../types';

export const studentService = {
  // Get all students
  getAll: async (params?: PaginationParams & { batch_id?: number }): Promise<Student[]> => {
    return await api.get<Student[]>(API_ENDPOINTS.STUDENTS, { params });
  },

  // Get student by ID
  getById: async (id: number): Promise<Student> => {
    return await api.get<Student>(`${API_ENDPOINTS.STUDENTS}/${id}`);
  },

  // Create student
  create: async (data: Partial<Student>): Promise<Student> => {
    return await api.post<Student>(API_ENDPOINTS.STUDENTS, data);
  },

  // Update student
  update: async (id: number, data: Partial<Student>): Promise<Student> => {
    return await api.put<Student>(`${API_ENDPOINTS.STUDENTS}/${id}`, data);
  },

  // Delete student (soft delete)
  delete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.STUDENTS}/${id}`);
  },

  // Restore deleted student
  restore: async (id: number): Promise<Student> => {
    return await api.post<Student>(`${API_ENDPOINTS.STUDENTS}/${id}/restore`);
  },
};
