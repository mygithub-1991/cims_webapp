import React from 'react';
import { Box, Typography } from '@mui/material';
import MainLayout from '../components/Layout/MainLayout';

const ReportsPage: React.FC = () => {
  return (
    <MainLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View reports and analytics
        </Typography>
      </Box>
    </MainLayout>
  );
};

export default ReportsPage;
