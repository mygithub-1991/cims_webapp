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
  DialogContentText,
} from '@mui/material';
import { Add, Edit, Delete, Refresh, Visibility, DeleteForever } from '@mui/icons-material';
import MainLayout from '../components/Layout/MainLayout';
import { teacherService } from '../services/teacherService';
import { Teacher } from '../types';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatters';

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);
  const [deleteType, setDeleteType] = useState<'soft' | 'hard'>('soft');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact_number: '',
    subject: '',
    salary: '',
    date_of_joining: new Date().getTime(),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const teachersData = await teacherService.getAll();
      setTeachers(teachersData);
    } catch (error) {
      console.error('Failed to load teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (teacher?: Teacher) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setFormData({
        name: teacher.name,
        contact_number: teacher.contact_number || '',
        subject: teacher.subject || '',
        salary: teacher.salary?.toString() || '',
        date_of_joining: teacher.date_of_joining,
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        name: '',
        contact_number: '',
        subject: '',
        salary: '',
        date_of_joining: new Date().getTime(),
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTeacher(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
      };

      if (editingTeacher) {
        await teacherService.update(editingTeacher.id, data);
      } else {
        await teacherService.create(data);
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Failed to save teacher:', error);
    }
  };

  const handleOpenViewDialog = (teacher: Teacher) => {
    setViewingTeacher(teacher);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewingTeacher(null);
  };

  const handleOpenDeleteDialog = (teacher: Teacher, type: 'soft' | 'hard') => {
    setDeletingTeacher(teacher);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingTeacher(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTeacher) return;

    try {
      if (deleteType === 'soft') {
        await teacherService.softDelete(deletingTeacher.id);
      } else {
        await teacherService.hardDelete(deletingTeacher.id);
      }
      handleCloseDeleteDialog();
      loadData();
    } catch (error) {
      console.error('Failed to delete teacher:', error);
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const query = searchQuery.toLowerCase();
    return (
      teacher.name.toLowerCase().includes(query) ||
      (teacher.subject && teacher.subject.toLowerCase().includes(query)) ||
      (teacher.contact_number && teacher.contact_number.toLowerCase().includes(query))
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
            Teachers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage teacher records
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
            Add Teacher
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search teachers by name, subject, or contact number..."
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
              <TableCell>Subject</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Joining Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>
                  {teacher.subject ? (
                    <Chip label={teacher.subject} size="small" color="primary" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{teacher.contact_number || '-'}</TableCell>
                <TableCell>{teacher.subject || '-'}</TableCell>
                <TableCell>
                  {teacher.salary ? formatCurrency(teacher.salary) : '-'}
                </TableCell>
                <TableCell>{formatDate(teacher.date_of_joining)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenViewDialog(teacher)} title="View Details">
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDialog(teacher)} title="Edit">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDeleteDialog(teacher, 'soft')} title="Soft Delete" color="warning">
                    <Delete />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDeleteDialog(teacher, 'hard')} title="Permanent Delete" color="error">
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
        <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Contact Number"
            value={formData.contact_number}
            onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Salary"
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTeacher ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Teacher Details</DialogTitle>
        <DialogContent>
          {viewingTeacher && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">id</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingTeacher.id}</Typography>

              <Typography variant="subtitle2" color="text.secondary">name</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingTeacher.name}</Typography>

              <Typography variant="subtitle2" color="text.secondary">subject</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingTeacher.subject || 'null'}</Typography>

              <Typography variant="subtitle2" color="text.secondary">contact_number</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingTeacher.contact_number || 'null'}</Typography>

              <Typography variant="subtitle2" color="text.secondary">salary</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {viewingTeacher.salary ? formatCurrency(viewingTeacher.salary) : 'null'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">date_of_joining</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(viewingTeacher.date_of_joining)}</Typography>

              <Typography variant="subtitle2" color="text.secondary">is_deleted</Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={viewingTeacher.is_deleted ? 'true' : 'false'}
                  color={viewingTeacher.is_deleted ? 'error' : 'success'}
                  size="small"
                />
              </Box>

              <Typography variant="subtitle2" color="text.secondary">created_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(viewingTeacher.created_at)}</Typography>

              <Typography variant="subtitle2" color="text.secondary">updated_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(viewingTeacher.updated_at)}</Typography>

              <Typography variant="subtitle2" color="text.secondary">deleted_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {viewingTeacher.deleted_at ? formatDate(viewingTeacher.deleted_at) : 'null'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">last_synced_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {viewingTeacher.last_synced_at ? formatDate(viewingTeacher.last_synced_at) : 'null'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">sync_status</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingTeacher.sync_status || 'null'}</Typography>
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
                Are you sure you want to soft delete <strong>{deletingTeacher?.name}</strong>?
                <br />
                <br />
                This will mark the teacher as deleted but can be restored later.
              </>
            ) : (
              <>
                <strong style={{ color: 'red' }}>WARNING: This action cannot be undone!</strong>
                <br />
                <br />
                Are you sure you want to permanently delete <strong>{deletingTeacher?.name}</strong>?
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

export default TeachersPage;
