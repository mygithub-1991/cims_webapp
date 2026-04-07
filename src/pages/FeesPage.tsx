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
import { feeService } from '../services/feeService';
import { studentService } from '../services/studentService';
import { FeeRecord, Student } from '../types';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatters';

const FeesPage: React.FC = () => {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeRecord | null>(null);
  const [formData, setFormData] = useState({
    student_id: '',
    amount_paid: '',
    date: new Date().toISOString().split('T')[0],
    payment_method: '',
    receipt_id: '',
    remarks: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [feesData, studentsData] = await Promise.all([
        feeService.getAll(),
        studentService.getAll(),
      ]);
      setFees(feesData);
      setStudents(studentsData);
    } catch (error) {
      console.error('Failed to load fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (fee?: FeeRecord) => {
    if (fee) {
      setEditingFee(fee);
      setFormData({
        student_id: fee.student_id.toString(),
        amount_paid: fee.amount_paid.toString(),
        date: new Date(fee.date).toISOString().split('T')[0],
        payment_method: fee.payment_method || '',
        receipt_id: fee.receipt_id || '',
        remarks: fee.remarks || '',
      });
    } else {
      setEditingFee(null);
      setFormData({
        student_id: '',
        amount_paid: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: '',
        receipt_id: '',
        remarks: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingFee(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        student_id: parseInt(formData.student_id),
        amount_paid: parseFloat(formData.amount_paid),
        date: new Date(formData.date).getTime(),
        payment_method: formData.payment_method || undefined,
        receipt_id: formData.receipt_id || undefined,
        remarks: formData.remarks || undefined,
      };

      if (editingFee) {
        await feeService.update(editingFee.id, data);
      } else {
        await feeService.collectFee(data);
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Failed to save fee:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      try {
        await feeService.delete(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete fee:', error);
      }
    }
  };

  const getStudentName = (studentId: number) => {
    const student = students.find((s) => s.id === studentId);
    return student?.name || 'Unknown';
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
            Fee Collection
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage fee payments
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
            Collect Fee
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Receipt No.</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fees.map((fee) => (
              <TableRow key={fee.id}>
                <TableCell>
                  <Chip label={fee.receipt_id || `#${fee.id}`} size="small" />
                </TableCell>
                <TableCell>{getStudentName(fee.student_id)}</TableCell>
                <TableCell>
                  <Typography fontWeight="bold" color="success.main">
                    {formatCurrency(fee.amount_paid)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {fee.payment_method ? (
                    <Chip label={fee.payment_method} size="small" variant="outlined" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{formatDate(fee.date)}</TableCell>
                <TableCell>{fee.remarks || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(fee)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(fee.id)}>
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
        <DialogTitle>{editingFee ? 'Edit Fee Record' : 'Collect Fee'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Student"
            value={formData.student_id}
            onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
            margin="normal"
            required
          >
            <MenuItem value="">Select Student</MenuItem>
            {students.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                {student.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Amount Paid"
            type="number"
            value={formData.amount_paid}
            onChange={(e) => setFormData({ ...formData, amount_paid: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            select
            label="Payment Method"
            value={formData.payment_method}
            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            margin="normal"
          >
            <MenuItem value="">Select Method</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            <MenuItem value="Cheque">Cheque</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Receipt ID"
            value={formData.receipt_id}
            onChange={(e) => setFormData({ ...formData, receipt_id: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Remarks"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingFee ? 'Update' : 'Collect'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default FeesPage;
