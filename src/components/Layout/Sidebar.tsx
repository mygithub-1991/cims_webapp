import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  People,
  School,
  Group,
  CheckCircle,
  AttachMoney,
  Receipt,
  Assessment,
  RestoreFromTrash,
  ManageAccounts,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

const drawerWidth = 240;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactElement;
  path: string;
  roles?: UserRole[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { id: 'students', label: 'Students', icon: <People />, path: '/students' },
  { id: 'teachers', label: 'Teachers', icon: <School />, path: '/teachers', roles: [UserRole.ADMIN] },
  { id: 'batches', label: 'Batches', icon: <Group />, path: '/batches' },
  { id: 'attendance', label: 'Attendance', icon: <CheckCircle />, path: '/attendance' },
  { id: 'fees', label: 'Fees', icon: <AttachMoney />, path: '/fees' },
  { id: 'expenses', label: 'Expenses', icon: <Receipt />, path: '/expenses', roles: [UserRole.ADMIN, UserRole.ACCOUNTANT] },
  { id: 'reports', label: 'Reports', icon: <Assessment />, path: '/reports' },
  { id: 'recovery', label: 'Recovery', icon: <RestoreFromTrash />, path: '/recovery', roles: [UserRole.ADMIN] },
  { id: 'users', label: 'User Management', icon: <ManageAccounts />, path: '/users', roles: [UserRole.ADMIN] },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return hasRole(item.roles);
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <School sx={{ mr: 1, color: 'primary.main' }} />
          <Box>
            <Typography variant="h6" noWrap>
              CIMS
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.full_name}
            </Typography>
          </Box>
        </Box>
      </Toolbar>

      <Divider />

      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List sx={{ mt: 'auto' }}>
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
