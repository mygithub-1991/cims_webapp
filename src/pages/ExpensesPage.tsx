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
import { expenseService } from '../services/expenseService';
import { Expense } from '../types';
import { formatDate } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatters';

const EXPENSE_CATEGORIES = [
  'Salary',
  'Rent',
  'Utilities',
  'Stationery',
  'Maintenance',
  'Marketing',
  'Equipment',
  'Transportation',
  'Food & Beverages',
  'Other',
];

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState({
    vendor_name: '',
    description: '',
    amount: '',
    category: '',
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: '',
    receipt_number: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const expensesData = await expenseService.getAll();
      setExpenses(expensesData);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        vendor_name: expense.vendor_name || '',
        description: expense.description || '',
        amount: expense.amount.toString(),
        category: expense.category || '',
        expense_date: new Date(expense.expense_date).toISOString().split('T')[0],
        payment_method: expense.payment_method || '',
        receipt_number: expense.receipt_number || '',
        notes: expense.notes || '',
      });
    } else {
      setEditingExpense(null);
      setFormData({
        vendor_name: '',
        description: '',
        amount: '',
        category: '',
        expense_date: new Date().toISOString().split('T')[0],
        payment_method: '',
        receipt_number: '',
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = async () => {
    try {
      const data = {
        vendor_name: formData.vendor_name || undefined,
        description: formData.description || undefined,
        amount: parseFloat(formData.amount),
        category: formData.category || undefined,
        expense_date: new Date(formData.expense_date).getTime(),
        payment_method: formData.payment_method || undefined,
        receipt_number: formData.receipt_number || undefined,
        notes: formData.notes || undefined,
      };

      if (editingExpense) {
        await expenseService.update(editingExpense.id, data);
      } else {
        await expenseService.create(data);
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.delete(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete expense:', error);
      }
    }
  };

  const getCategoryColor = (category?: string) => {
    const colors: { [key: string]: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' } = {
      'Salary': 'error',
      'Rent': 'warning',
      'Utilities': 'info',
      'Stationery': 'primary',
      'Maintenance': 'secondary',
      'Marketing': 'success',
    };
    return colors[category || ''] || 'default';
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
            Expenses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage expense records
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
            Add Expense
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vendor</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Receipt No.</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <Typography fontWeight="medium">{expense.vendor_name || '-'}</Typography>
                </TableCell>
                <TableCell>
                  {expense.category ? (
                    <Chip
                      label={expense.category}
                      size="small"
                      color={getCategoryColor(expense.category) as any}
                    />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold" color="error.main">
                    {formatCurrency(expense.amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {expense.payment_method ? (
                    <Chip label={expense.payment_method} size="small" variant="outlined" />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{formatDate(expense.expense_date)}</TableCell>
                <TableCell>{expense.receipt_number || '-'}</TableCell>
                <TableCell>{expense.description || '-'}</TableCell>
                <TableCell>{expense.notes || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(expense)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(expense.id)}>
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
        <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Vendor Name"
            value={formData.vendor_name}
            onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            margin="normal"
          >
            <MenuItem value="">Select Category</MenuItem>
            {EXPENSE_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={formData.expense_date}
            onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
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
            label="Receipt Number"
            value={formData.receipt_number}
            onChange={(e) => setFormData({ ...formData, receipt_number: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingExpense ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default ExpensesPage;
