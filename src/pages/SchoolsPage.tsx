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
  DialogContentText,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, Refresh, Visibility, DeleteForever } from '@mui/icons-material';
import MainLayout from '../components/Layout/MainLayout';
import { schoolService } from '../services/schoolService';
import { School } from '../types';
import { formatDate } from '../utils/dateUtils';

const SchoolsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [viewingSchool, setViewingSchool] = useState<School | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);
  const [deleteType, setDeleteType] = useState<'soft' | 'hard'>('soft');
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

  const handleOpenViewDialog = (school: School) => {
    setViewingSchool(school);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewingSchool(null);
  };

  const handleOpenDeleteDialog = (school: School, type: 'soft' | 'hard') => {
    setDeletingSchool(school);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingSchool(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSchool) return;

    try {
      if (deleteType === 'soft') {
        await schoolService.softDelete(deletingSchool.id);
      } else {
        await schoolService.hardDelete(deletingSchool.id);
      }
      handleCloseDeleteDialog();
      loadData();
    } catch (error) {
      console.error('Failed to delete school:', error);
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
                  <IconButton
                    size="small"
                    onClick={() => handleOpenViewDialog(school)}
                    title="View Details"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(school)}
                    title="Edit"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDeleteDialog(school, 'soft')}
                    title="Soft Delete"
                    color="warning"
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDeleteDialog(school, 'hard')}
                    title="Permanent Delete"
                    color="error"
                  >
                    <DeleteForever />
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>School Details</DialogTitle>
        <DialogContent>
          {viewingSchool && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">ID</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingSchool.id}</Typography>

              <Typography variant="subtitle2" color="text.secondary">school_name</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingSchool.school_name}</Typography>

              <Typography variant="subtitle2" color="text.secondary">address</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingSchool.address}</Typography>

              <Typography variant="subtitle2" color="text.secondary">pincode</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingSchool.pincode}</Typography>

              <Typography variant="subtitle2" color="text.secondary">is_deleted</Typography>
              <Chip
                label={viewingSchool.is_deleted ? 'true' : 'false'}
                color={viewingSchool.is_deleted ? 'error' : 'success'}
                size="small"
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" color="text.secondary">deleted_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {viewingSchool.deleted_at ? formatDate(viewingSchool.deleted_at) : 'null'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">created_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(viewingSchool.created_at)}</Typography>

              <Typography variant="subtitle2" color="text.secondary">updated_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(viewingSchool.updated_at)}</Typography>

              <Typography variant="subtitle2" color="text.secondary">last_synced_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {viewingSchool.last_synced_at ? formatDate(viewingSchool.last_synced_at) : 'null'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">sync_status</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingSchool.sync_status || 'null'}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>
          {deleteType === 'soft' ? 'Confirm Soft Delete' : 'Confirm Permanent Delete'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteType === 'soft' ? (
              <>
                Are you sure you want to soft delete <strong>{deletingSchool?.school_name}</strong>?
                <br />
                <br />
                This will mark the school as deleted but can be restored later.
              </>
            ) : (
              <>
                <strong style={{ color: 'red' }}>WARNING: This action cannot be undone!</strong>
                <br />
                <br />
                Are you sure you want to permanently delete <strong>{deletingSchool?.school_name}</strong>?
                <br />
                <br />
                All data will be permanently removed from the database.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color={deleteType === 'soft' ? 'warning' : 'error'}
            variant="contained"
          >
            {deleteType === 'soft' ? 'Soft Delete' : 'Permanently Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default SchoolsPage;
