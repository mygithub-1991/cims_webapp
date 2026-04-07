import { api } from './api';
import { API_ENDPOINTS } from '../config';
import { Batch, PaginationParams } from '../types';

export const batchService = {
  // Get all batches
  getAll: async (params?: PaginationParams): Promise<Batch[]> => {
    return await api.get<Batch[]>(API_ENDPOINTS.BATCHES, { params });
  },

  // Get batch by ID
  getById: async (id: number): Promise<Batch> => {
    return await api.get<Batch>(`${API_ENDPOINTS.BATCHES}/${id}`);
  },

  // Create batch
  create: async (data: Partial<Batch>): Promise<Batch> => {
    return await api.post<Batch>(API_ENDPOINTS.BATCHES, data);
  },

  // Update batch
  update: async (id: number, data: Partial<Batch>): Promise<Batch> => {
    return await api.put<Batch>(`${API_ENDPOINTS.BATCHES}/${id}`, data);
  },

  // Soft delete batch
  softDelete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.BATCHES}/${id}?soft=true`);
  },

  // Hard delete batch (permanent)
  hardDelete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.BATCHES}/${id}?soft=false`);
  },

  // Legacy method (defaults to soft delete)
  delete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.BATCHES}/${id}`);
  },

  // Restore deleted batch
  restore: async (id: number): Promise<Batch> => {
    return await api.post<Batch>(`${API_ENDPOINTS.BATCHES}/${id}/restore`);
  },
};
