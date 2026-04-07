import { api } from './api';
import { API_ENDPOINTS } from '../config';
import { FeeRecord } from '../types';

export const feeService = {
  // Get all fee records
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    student_id?: number;
    start_date?: number;
    end_date?: number;
  }): Promise<FeeRecord[]> => {
    return await api.get<FeeRecord[]>(API_ENDPOINTS.FEES, { params });
  },

  // Get fee by ID
  getById: async (id: number): Promise<FeeRecord> => {
    return await api.get<FeeRecord>(`${API_ENDPOINTS.FEES}/${id}`);
  },

  // Collect fee
  collectFee: async (data: Partial<FeeRecord>): Promise<FeeRecord> => {
    return await api.post<FeeRecord>(API_ENDPOINTS.FEES, data);
  },

  // Update fee record
  update: async (id: number, data: Partial<FeeRecord>): Promise<FeeRecord> => {
    return await api.put<FeeRecord>(`${API_ENDPOINTS.FEES}/${id}`, data);
  },

  // Soft delete fee record
  softDelete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.FEES}/${id}?soft=true`);
  },

  // Hard delete fee record (permanent)
  hardDelete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.FEES}/${id}?soft=false`);
  },

  // Legacy method (defaults to soft delete)
  delete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.FEES}/${id}`);
  },

  // Get pending fees summary
  getPendingFees: async (): Promise<{ student_id: number; student_name: string; pending: number }[]> => {
    return await api.get<{ student_id: number; student_name: string; pending: number }[]>(
      `${API_ENDPOINTS.FEES}/pending`
    );
  },
};
