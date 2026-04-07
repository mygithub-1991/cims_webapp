// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  USERS: '/auth/users',

  // Teachers
  TEACHERS: '/teachers',

  // Students
  STUDENTS: '/students',

  // Batches
  BATCHES: '/batches',

  // Attendance
  ATTENDANCE: '/attendance',

  // Fees
  FEES: '/fee-records',

  // Expenses
  EXPENSES: '/expenses',

  // Schools
  SCHOOLS: '/schools',

  // Sync
  SYNC: '/sync/full-sync',
  SYNC_STATUS: '/sync/status',
};

export const TOKEN_KEY = 'cims_auth_token';
export const USER_KEY = 'cims_user_data';
