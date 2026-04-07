// User & Auth Types
export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  ACCOUNTANT = 'accountant',
  RECEPTION = 'reception',
  STUDENT = 'student',
  PARENT = 'parent',
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
  last_login_at?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// Teacher Types
export interface Teacher {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  qualification?: string;
  experience_years?: number;
  salary?: number;
  date_of_joining: number;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
  deleted_at?: number;
  last_synced_at?: number;
  sync_status?: string;
}

// Student Types
export interface Student {
  id: number;
  name: string;
  batch_id?: number;
  batch?: Batch;
  email?: string;
  phone?: string;
  parent_name?: string;
  parent_phone?: string;
  address?: string;
  date_of_birth?: number;
  date_of_joining: number;
  monthly_fee: number;
  paid_fees: number;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
  deleted_at?: number;
  last_synced_at?: number;
  sync_status?: string;
}

// Batch Types
export interface Batch {
  id: number;
  name: string;
  description?: string;
  teacher_id?: number;
  teacher?: Teacher;
  schedule?: string;
  start_date?: number;
  end_date?: number;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
  deleted_at?: number;
  last_synced_at?: number;
  sync_status?: string;
}

// Attendance Types
export interface Attendance {
  id: number;
  student_id: number;
  student?: Student;
  batch_id: number;
  batch?: Batch;
  date: number;
  status: 'present' | 'absent' | 'late';
  remarks?: string;
  is_deleted: boolean;
  created_at: number;
  deleted_at?: number;
  last_synced_at?: number;
  sync_status?: string;
}

// Fee Record Types
export interface FeeRecord {
  id: number;
  student_id: number;
  student?: Student;
  amount: number;
  date: number;
  payment_method?: string;
  receipt_number?: string;
  remarks?: string;
  is_deleted: boolean;
  created_at: number;
  deleted_at?: number;
  last_synced_at?: number;
  sync_status?: string;
}

// Expense Types
export interface Expense {
  id: number;
  title: string;
  description?: string;
  amount: number;
  category?: string;
  expense_date: number;
  payment_method?: string;
  receipt_number?: string;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
  deleted_at?: number;
  last_synced_at?: number;
  sync_status?: string;
}

// Dashboard Stats
export interface DashboardStats {
  total_students: number;
  total_teachers: number;
  total_batches: number;
  total_revenue: number;
  total_expenses: number;
  pending_fees: number;
  attendance_today: {
    present: number;
    absent: number;
    total: number;
  };
}

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

// Pagination
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

// Date filters
export interface DateFilter {
  start_date?: number;
  end_date?: number;
}
