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
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import MainLayout from '../components/Layout/MainLayout';
import { teacherService } from '../services/teacherService';
import { Teacher } from '../types';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatters';

const TeachersPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    qualification: '',
    experience_years: '',
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
        email: teacher.email || '',
        phone: teacher.phone || '',
        subject: teacher.subject || '',
        qualification: teacher.qualification || '',
        experience_years: teacher.experience_years?.toString() || '',
        salary: teacher.salary?.toString() || '',
        date_of_joining: teacher.date_of_joining,
      });
    } else {
      setEditingTeacher(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        qualification: '',
        experience_years: '',
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
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
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

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await teacherService.delete(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete teacher:', error);
      }
    }
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Qualification</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Joining Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>
                  {teacher.subject ? (
                    <Chip label={teacher.subject} size="small" color="primary" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{teacher.phone || '-'}</TableCell>
                <TableCell>{teacher.email || '-'}</TableCell>
                <TableCell>
                  {teacher.experience_years ? `${teacher.experience_years} years` : '-'}
                </TableCell>
                <TableCell>{teacher.qualification || '-'}</TableCell>
                <TableCell>
                  {teacher.salary ? formatCurrency(teacher.salary) : '-'}
                </TableCell>
                <TableCell>{formatDate(teacher.date_of_joining)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(teacher)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(teacher.id)}>
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
            label="Qualification"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Experience (Years)"
            type="number"
            value={formData.experience_years}
            onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
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
    </MainLayout>
  );
};

export default TeachersPage;
