import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import BatchesPage from './pages/BatchesPage';
import AttendancePage from './pages/AttendancePage';
import FeesPage from './pages/FeesPage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import { UserRole } from './types';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Private Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/students"
              element={
                <PrivateRoute>
                  <StudentsPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/teachers"
              element={
                <PrivateRoute requiredRoles={[UserRole.ADMIN]}>
                  <TeachersPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/batches"
              element={
                <PrivateRoute>
                  <BatchesPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/attendance"
              element={
                <PrivateRoute>
                  <AttendancePage />
                </PrivateRoute>
              }
            />

            <Route
              path="/fees"
              element={
                <PrivateRoute>
                  <FeesPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/expenses"
              element={
                <PrivateRoute requiredRoles={[UserRole.ADMIN, UserRole.ACCOUNTANT]}>
                  <ExpensesPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <ReportsPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/users"
              element={
                <PrivateRoute requiredRoles={[UserRole.ADMIN]}>
                  <UsersPage />
                </PrivateRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
