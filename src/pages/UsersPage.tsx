import React from 'react';
import { Box, Typography } from '@mui/material';
import MainLayout from '../components/Layout/MainLayout';

const UsersPage: React.FC = () => {
  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage users and roles (Admin only)
        </Typography>
      </Box>
    </MainLayout>
  );
};

export default UsersPage;
