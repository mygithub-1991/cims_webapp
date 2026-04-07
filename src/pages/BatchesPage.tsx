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
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  DialogContentText,
} from '@mui/material';
import { Add, Edit, Delete, Refresh, Visibility, DeleteForever } from '@mui/icons-material';
import MainLayout from '../components/Layout/MainLayout';
import { batchService } from '../services/batchService';
import { teacherService } from '../services/teacherService';
import { Batch, Teacher } from '../types';
import { formatDate } from '../utils/dateUtils';

const BatchesPage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [viewingBatch, setViewingBatch] = useState<Batch | null>(null);
  const [deletingBatch, setDeletingBatch] = useState<Batch | null>(null);
  const [deleteType, setDeleteType] = useState<'soft' | 'hard'>('soft');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacher_id: '',
    time: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [batchesData, teachersData] = await Promise.all([
        batchService.getAll(),
        teacherService.getAll(),
      ]);
      setBatches(batchesData);
      setTeachers(teachersData);
    } catch (error) {
      console.error('Failed to load batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        name: batch.name,
        description: '',
        teacher_id: batch.teacher_id?.toString() || '',
        time: batch.time || '',
        start_date: '',
        end_date: '',
      });
    } else {
      setEditingBatch(null);
      setFormData({
        name: '',
        description: '',
        teacher_id: '',
        time: '',
        start_date: '',
        end_date: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBatch(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        name: formData.name,
        teacher_id: formData.teacher_id ? parseInt(formData.teacher_id) : undefined,
        time: formData.time || undefined,
      };

      if (editingBatch) {
        await batchService.update(editingBatch.id, data);
      } else {
        await batchService.create(data);
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Failed to save batch:', error);
    }
  };

  const handleOpenViewDialog = (batch: Batch) => {
    setViewingBatch(batch);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewingBatch(null);
  };

  const handleOpenDeleteDialog = (batch: Batch, type: 'soft' | 'hard') => {
    setDeletingBatch(batch);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingBatch(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBatch) return;

    try {
      if (deleteType === 'soft') {
        await batchService.softDelete(deletingBatch.id);
      } else {
        await batchService.hardDelete(deletingBatch.id);
      }
      handleCloseDeleteDialog();
      loadData();
    } catch (error) {
      console.error('Failed to delete batch:', error);
    }
  };

  const getTeacherName = (teacherId?: number) => {
    if (!teacherId) return '-';
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher?.name || '-';
  };

  const filteredBatches = batches.filter((batch) => {
    const query = searchQuery.toLowerCase();
    return (
      batch.name.toLowerCase().includes(query) ||
      (batch.time && batch.time.toLowerCase().includes(query))
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
            Batches
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage batch records
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
            Add Batch
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search batches by name or time..."
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
              <TableCell>Name</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Time</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBatches.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell>
                  <Chip label={batch.name} color="primary" />
                </TableCell>
                <TableCell>{getTeacherName(batch.teacher_id)}</TableCell>
                <TableCell>{batch.time || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenViewDialog(batch)} title="View Details">
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDialog(batch)} title="Edit">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDeleteDialog(batch, 'soft')} title="Soft Delete" color="warning">
                    <Delete />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDeleteDialog(batch, 'hard')} title="Permanent Delete" color="error">
                    <DeleteForever />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBatch ? 'Edit Batch' : 'Add Batch'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Batch Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Teacher"
            value={formData.teacher_id}
            onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
            margin="normal"
          >
            <MenuItem value="">None</MenuItem>
            {teachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            margin="normal"
            placeholder="e.g., Mon-Fri 10:00 AM - 12:00 PM"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingBatch ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Batch Details</DialogTitle>
        <DialogContent>
          {viewingBatch && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">id</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingBatch.id}</Typography>

              <Typography variant="subtitle2" color="text.secondary">name</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingBatch.name}</Typography>

              <Typography variant="subtitle2" color="text.secondary">time</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingBatch.time || 'null'}</Typography>

              <Typography variant="subtitle2" color="text.secondary">teacher_id</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {viewingBatch.teacher_id ? `${viewingBatch.teacher_id} (${getTeacherName(viewingBatch.teacher_id)})` : 'null'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">is_deleted</Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={viewingBatch.is_deleted ? 'true' : 'false'}
                  color={viewingBatch.is_deleted ? 'error' : 'success'}
                  size="small"
                />
              </Box>

              <Typography variant="subtitle2" color="text.secondary">created_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(viewingBatch.created_at)}</Typography>

              <Typography variant="subtitle2" color="text.secondary">updated_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(viewingBatch.updated_at)}</Typography>

              <Typography variant="subtitle2" color="text.secondary">deleted_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {viewingBatch.deleted_at ? formatDate(viewingBatch.deleted_at) : 'null'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">last_synced_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {viewingBatch.last_synced_at ? formatDate(viewingBatch.last_synced_at) : 'null'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">sync_status</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingBatch.sync_status || 'null'}</Typography>
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
                Are you sure you want to soft delete <strong>{deletingBatch?.name}</strong>?
                <br />
                <br />
                This will mark the batch as deleted but can be restored later.
              </>
            ) : (
              <>
                <strong style={{ color: 'red' }}>WARNING: This action cannot be undone!</strong>
                <br />
                <br />
                Are you sure you want to permanently delete <strong>{deletingBatch?.name}</strong>?
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

export default BatchesPage;
