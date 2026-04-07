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
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [deleteType, setDeleteType] = useState<'soft' | 'hard'>('soft');
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleOpenViewDialog = (expense: Expense) => {
    setViewingExpense(expense);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setViewingExpense(null);
  };

  const handleOpenDeleteDialog = (expense: Expense, type: 'soft' | 'hard') => {
    setDeletingExpense(expense);
    setDeleteType(type);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletingExpense(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingExpense) return;

    try {
      if (deleteType === 'soft') {
        await expenseService.softDelete(deletingExpense.id);
      } else {
        await expenseService.hardDelete(deletingExpense.id);
      }
      handleCloseDeleteDialog();
      loadData();
    } catch (error) {
      console.error('Failed to delete expense:', error);
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

  const filteredExpenses = expenses.filter((expense) => {
    const query = searchQuery.toLowerCase();
    return (
      (expense.vendor_name && expense.vendor_name.toLowerCase().includes(query)) ||
      (expense.category && expense.category.toLowerCase().includes(query)) ||
      (expense.description && expense.description.toLowerCase().includes(query))
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

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search expenses by vendor name, category, or description..."
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
            {filteredExpenses.map((expense) => (
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
                  <IconButton size="small" onClick={() => handleOpenViewDialog(expense)} title="View Details">
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDialog(expense)} title="Edit">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDeleteDialog(expense, 'soft')} title="Soft Delete" color="warning">
                    <Delete />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleOpenDeleteDialog(expense, 'hard')} title="Permanent Delete" color="error">
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleCloseViewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Expense Details</DialogTitle>
        <DialogContent>
          {viewingExpense && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">id</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingExpense.id}</Typography>

              <Typography variant="subtitle2" color="text.secondary">category</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingExpense.category || 'null'}</Typography>

              <Typography variant="subtitle2" color="text.secondary">description</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingExpense.description || 'null'}</Typography>

              <Typography variant="subtitle2" color="text.secondary">amount</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatCurrency(viewingExpense.amount)}</Typography>

              <Typography variant="subtitle2" color="text.secondary">expense_date</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(viewingExpense.expense_date)}</Typography>

              <Typography variant="subtitle2" color="text.secondary">payment_method</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingExpense.payment_method || 'null'}</Typography>

              <Typography variant="subtitle2" color="text.secondary">vendor_name</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingExpense.vendor_name || 'null'}</Typography>

              <Typography variant="subtitle2" color="text.secondary">receipt_number</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingExpense.receipt_number || 'null'}</Typography>

              <Typography variant="subtitle2" color="text.secondary">notes</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingExpense.notes || 'null'}</Typography>

              <Typography variant="subtitle2" color="text.secondary">is_deleted</Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={viewingExpense.is_deleted ? 'true' : 'false'}
                  color={viewingExpense.is_deleted ? 'error' : 'success'}
                  size="small"
                />
              </Box>

              <Typography variant="subtitle2" color="text.secondary">created_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(viewingExpense.created_at)}</Typography>

              <Typography variant="subtitle2" color="text.secondary">updated_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{formatDate(viewingExpense.updated_at)}</Typography>

              <Typography variant="subtitle2" color="text.secondary">deleted_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {viewingExpense.deleted_at ? formatDate(viewingExpense.deleted_at) : 'null'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">last_synced_at</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {viewingExpense.last_synced_at ? formatDate(viewingExpense.last_synced_at) : 'null'}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary">sync_status</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{viewingExpense.sync_status || 'null'}</Typography>
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
                Are you sure you want to soft delete this expense <strong>{deletingExpense?.vendor_name || 'record'}</strong>?
                <br />
                <br />
                This will mark the expense as deleted but can be restored later.
              </>
            ) : (
              <>
                <strong style={{ color: 'red' }}>WARNING: This action cannot be undone!</strong>
                <br />
                <br />
                Are you sure you want to permanently delete this expense <strong>{deletingExpense?.vendor_name || 'record'}</strong>?
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

export default ExpensesPage;
