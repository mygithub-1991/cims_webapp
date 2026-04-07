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
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import MainLayout from '../components/Layout/MainLayout';
import { studentService } from '../services/studentService';
import { batchService } from '../services/batchService';
import { Student, Batch } from '../types';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatters';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    batch_id: '',
    parent_name: '',
    parent_phone: '',
    monthly_fee: '',
    date_of_joining: new Date().getTime(),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsData, batchesData] = await Promise.all([
        studentService.getAll(),
        batchService.getAll(),
      ]);
      setStudents(studentsData);
      setBatches(batchesData);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        email: student.email || '',
        phone: student.phone || '',
        batch_id: student.batch_id?.toString() || '',
        parent_name: student.parent_name || '',
        parent_phone: student.parent_phone || '',
        monthly_fee: student.monthly_fee.toString(),
        date_of_joining: student.date_of_joining,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        batch_id: '',
        parent_name: '',
        parent_phone: '',
        monthly_fee: '',
        date_of_joining: new Date().getTime(),
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingStudent(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        batch_id: formData.batch_id ? parseInt(formData.batch_id) : undefined,
        monthly_fee: parseFloat(formData.monthly_fee),
      };

      if (editingStudent) {
        await studentService.update(editingStudent.id, data);
      } else {
        await studentService.create(data);
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Failed to save student:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  const getBatchName = (batchId?: number) => {
    if (!batchId) return '-';
    const batch = batches.find((b) => b.id === batchId);
    return batch?.name || '-';
  };

  const getPendingFees = (student: Student) => {
    return student.monthly_fee - student.paid_fees;
  };

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
            Students
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage student records
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
            Add Student
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell>Monthly Fee</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>Joining Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  <Chip label={getBatchName(student.batch_id)} size="small" />
                </TableCell>
                <TableCell>{student.phone || '-'}</TableCell>
                <TableCell>{student.parent_name || '-'}</TableCell>
                <TableCell>{formatCurrency(student.monthly_fee)}</TableCell>
                <TableCell>{formatCurrency(student.paid_fees)}</TableCell>
                <TableCell>
                  <Chip
                    label={formatCurrency(getPendingFees(student))}
                    color={getPendingFees(student) > 0 ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(student.date_of_joining)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(student)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(student.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingStudent ? 'Edit Student' : 'Add Student'}</DialogTitle>
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
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Batch"
            value={formData.batch_id}
            onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
            margin="normal"
          >
            <MenuItem value="">None</MenuItem>
            {batches.map((batch) => (
              <MenuItem key={batch.id} value={batch.id}>
                {batch.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Parent Name"
            value={formData.parent_name}
            onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Parent Phone"
            value={formData.parent_phone}
            onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Monthly Fee"
            type="number"
            value={formData.monthly_fee}
            onChange={(e) => setFormData({ ...formData, monthly_fee: e.target.value })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingStudent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default StudentsPage;
