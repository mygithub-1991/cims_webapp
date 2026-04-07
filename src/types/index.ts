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
  subject?: string;
  contact_number?: string;
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
  roll_number: string;
  name: string;
  batch_id?: number;
  batch?: Batch;
  contact_number?: string;
  parent_name?: string;
  parent_contact?: string;
  total_fees: number;
  paid_fees: number;
  payment_mode?: string;
  installment_type?: string;
  referred_by?: string;
  board?: string;
  school_id?: number;
  date_of_joining?: number;
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
  time?: string;
  teacher_id?: number;
  teacher?: Teacher;
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
  amount_paid: number;
  date: number;
  payment_method?: string;
  receipt_id?: string;
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
  category?: string;
  description?: string;
  amount: number;
  expense_date: number;
  payment_method?: string;
  vendor_name?: string;
  receipt_number?: string;
  notes?: string;
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
