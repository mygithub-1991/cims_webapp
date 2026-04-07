import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import MainLayout from '../components/Layout/MainLayout';
import { schoolService } from '../services/schoolService';
import { School } from '../types';
import { formatDate } from '../utils/dateUtils';

const SchoolsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    school_name: '',
    address: '',
    pincode: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const schoolsData = await schoolService.getAll();
      setSchools(schoolsData);
    } catch (error) {
      console.error('Failed to load schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (school?: School) => {
    if (school) {
      setEditingSchool(school);
      setFormData({
        school_name: school.school_name,
        address: school.address,
        pincode: school.pincode,
      });
    } else {
      setEditingSchool(null);
      setFormData({
        school_name: '',
        address: '',
        pincode: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSchool(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingSchool) {
        await schoolService.update(editingSchool.id, formData);
      } else {
        await schoolService.create(formData);
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Failed to save school:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      try {
        await schoolService.delete(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete school:', error);
      }
    }
  };

  const filteredSchools = schools.filter((school) => {
    const query = searchQuery.toLowerCase();
    return (
      school.school_name.toLowerCase().includes(query) ||
      school.address.toLowerCase().includes(query) ||
      school.pincode.toLowerCase().includes(query)
    );
  });

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
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Schools
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage school records
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadData}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add School
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search schools by name, address, or pincode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          size="small"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>School Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Pincode</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSchools.map((school) => (
              <TableRow key={school.id}>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    {school.school_name}
                  </Typography>
                </TableCell>
                <TableCell>{school.address}</TableCell>
                <TableCell>{school.pincode}</TableCell>
                <TableCell>{formatDate(school.created_at)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(school)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(school.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredSchools.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No schools found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSchool ? 'Edit School' : 'Add School'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="School Name"
            value={formData.school_name}
            onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            fullWidth
            label="Pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingSchool ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default SchoolsPage;
