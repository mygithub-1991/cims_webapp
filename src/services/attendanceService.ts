import { api } from './api';
import { API_ENDPOINTS } from '../config';
import { Attendance, DateFilter } from '../types';

export const attendanceService = {
  // Get all attendance records
  getAll: async (params?: {
    skip?: number;
    limit?: number;
    batch_id?: number;
    student_id?: number;
    date?: number;
    start_date?: number;
    end_date?: number;
  }): Promise<Attendance[]> => {
    return await api.get<Attendance[]>(API_ENDPOINTS.ATTENDANCE, { params });
  },

  // Get attendance by ID
  getById: async (id: number): Promise<Attendance> => {
    return await api.get<Attendance>(`${API_ENDPOINTS.ATTENDANCE}/${id}`);
  },

  // Mark attendance (batch)
  markAttendance: async (data: {
    batch_id: number;
    date: number;
    attendance: Array<{
      student_id: number;
      status: 'present' | 'absent' | 'late';
      remarks?: string;
    }>;
  }): Promise<Attendance[]> => {
    return await api.post<Attendance[]>(`${API_ENDPOINTS.ATTENDANCE}/batch`, data);
  },

  // Update attendance
  update: async (id: number, data: Partial<Attendance>): Promise<Attendance> => {
    return await api.put<Attendance>(`${API_ENDPOINTS.ATTENDANCE}/${id}`, data);
  },

  // Delete attendance
  delete: async (id: number): Promise<{ message: string }> => {
    return await api.delete<{ message: string }>(`${API_ENDPOINTS.ATTENDANCE}/${id}`);
  },
};
