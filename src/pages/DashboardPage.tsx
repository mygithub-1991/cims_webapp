import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  People,
  School,
  Group,
  AttachMoney,
  Receipt,
  TrendingUp,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { studentService } from '../services/studentService';
import { teacherService } from '../services/teacherService';
import { batchService } from '../services/batchService';
import { feeService } from '../services/feeService';
import { expenseService } from '../services/expenseService';
import { formatCurrency } from '../utils/formatters';
import MainLayout from '../components/Layout/MainLayout';

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalBatches: number;
  totalRevenue: number;
  totalExpenses: number;
  pendingFees: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalBatches: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    pendingFees: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [students, teachers, batches, fees, expenses] = await Promise.all([
        studentService.getAll(),
        teacherService.getAll(),
        batchService.getAll(),
        feeService.getAll(),
        expenseService.getAll(),
      ]);

      const totalRevenue = fees.reduce((sum, fee) => sum + fee.amount, 0);
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const pendingFees = students.reduce(
        (sum, student) => sum + (student.monthly_fee - student.paid_fees),
        0
      );

      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalBatches: batches.length,
        totalRevenue,
        totalExpenses,
        pendingFees,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon,
    color,
    format = 'number',
  }: {
    title: string;
    value: number;
    icon: React.ReactElement;
    color: string;
    format?: 'number' | 'currency';
  }) => (
    <Card sx={{ height: '100%', minWidth: 200 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {format === 'currency' ? formatCurrency(value) : value}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: color,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome to CIMS Dashboard
        </Typography>
      </Box>

      {/* Stats Cards using Flexbox */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 calc(25% - 16px)', minWidth: 200 }}>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={<People sx={{ color: 'white' }} />}
            color="#1976d2"
          />
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 16px)', minWidth: 200 }}>
          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
            icon={<School sx={{ color: 'white' }} />}
            color="#2e7d32"
          />
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 16px)', minWidth: 200 }}>
          <StatCard
            title="Total Batches"
            value={stats.totalBatches}
            icon={<Group sx={{ color: 'white' }} />}
            color="#ed6c02"
          />
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 16px)', minWidth: 200 }}>
          <StatCard
            title="Pending Fees"
            value={stats.pendingFees}
            icon={<Warning sx={{ color: 'white' }} />}
            color="#d32f2f"
            format="currency"
          />
        </Box>
      </Box>

      {/* Financial Stats Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: 250 }}>
          <StatCard
            title="Total Revenue"
            value={stats.totalRevenue}
            icon={<AttachMoney sx={{ color: 'white' }} />}
            color="#388e3c"
            format="currency"
          />
        </Box>

        <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: 250 }}>
          <StatCard
            title="Total Expenses"
            value={stats.totalExpenses}
            icon={<Receipt sx={{ color: 'white' }} />}
            color="#f57c00"
            format="currency"
          />
        </Box>

        <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: 250 }}>
          <StatCard
            title="Net Profit"
            value={stats.totalRevenue - stats.totalExpenses}
            icon={<TrendingUp sx={{ color: 'white' }} />}
            color="#0288d1"
            format="currency"
          />
        </Box>
      </Box>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'primary.light',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'primary.main', color: 'white' },
                transition: 'all 0.3s',
              }}
            >
              <CheckCircle />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Mark Attendance
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                bgcolor: 'success.light',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'success.main', color: 'white' },
                transition: 'all 0.3s',
              }}
            >
              <AttachMoney />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Collect Fee
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                bgcolor: 'warning.light',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'warning.main', color: 'white' },
                transition: 'all 0.3s',
              }}
            >
              <People />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Add Student
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                bgcolor: 'info.light',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'info.main', color: 'white' },
                transition: 'all 0.3s',
              }}
            >
              <Receipt />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Add Expense
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default DashboardPage;
