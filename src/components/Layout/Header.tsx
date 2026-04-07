import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Chip } from '@mui/material';
import { Notifications, AccountCircle } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { formatRole } from '../../utils/formatters';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - 240px)`,
        ml: `240px`,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Coaching Institute Management System
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={formatRole(user?.role || '')}
            color="primary"
            size="small"
            variant="outlined"
          />

          <IconButton color="inherit">
            <Notifications />
          </IconButton>

          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
