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
  CircularProgress,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Save, Refresh } from '@mui/icons-material';
import MainLayout from '../components/Layout/MainLayout';
import { attendanceService } from '../services/attendanceService';
import { studentService } from '../services/studentService';
import { batchService } from '../services/batchService';
import { Batch, Student } from '../types';
import { getStartOfDay } from '../utils/dateUtils';

const AttendancePage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState<{
    [key: number]: { is_present: boolean };
  }>({});

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      loadStudents();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBatch]);

  const loadBatches = async () => {
    try {
      const batchesData = await batchService.getAll();
      setBatches(batchesData);
    } catch (error) {
      console.error('Failed to load batches:', error);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await studentService.getAll({
        batch_id: parseInt(selectedBatch),
      });
      setStudents(studentsData);

      // Initialize attendance data with default 'present' status
      const initialData: typeof attendanceData = {};
      studentsData.forEach((student) => {
        initialData[student.id] = { is_present: true };
      });
      setAttendanceData(initialData);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId: number, is_present: boolean) => {
    setAttendanceData({
      ...attendanceData,
      [studentId]: { is_present },
    });
  };

  const handleSubmit = async () => {
    if (!selectedBatch) {
      alert('Please select a batch');
      return;
    }

    try {
      setLoading(true);
      const attendanceDate = getStartOfDay(new Date(selectedDate).getTime());

      const attendanceArray = Object.entries(attendanceData).map(([studentId, data]) => ({
        student_id: parseInt(studentId),
        date: attendanceDate,
        is_present: data.is_present,
      }));

      await attendanceService.markAttendance(attendanceArray);

      alert('Attendance marked successfully!');
      loadStudents();
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      alert('Failed to mark attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const getSummary = () => {
    const summary = { present: 0, absent: 0 };
    Object.values(attendanceData).forEach((data) => {
      if (data.is_present) {
        summary.present++;
      } else {
        summary.absent++;
      }
    });
    return summary;
  };

  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return student.name.toLowerCase().includes(query);
  });

  const summary = getSummary();

  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Mark Attendance
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select batch and date to mark student attendance
        </Typography>
      </Box>

      {/* Batch and Date Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: "1 1 300px" }}>
              <TextField
                fullWidth
                select
                label="Select Batch"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <MenuItem value="">Select Batch</MenuItem>
                {batches.map((batch) => (
                  <MenuItem key={batch.id} value={batch.id}>
                    {batch.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ flex: "1 1 300px" }}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ flex: "1 1 300px" }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                onClick={loadStudents}
                disabled={!selectedBatch}
                sx={{ height: '56px' }}
              >
                Load Students
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Search Box */}
      {students.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search students by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Box>
      )}

      {/* Summary Cards */}
      {students.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <Box sx={{ flex: '1 1 200px' }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Students
                </Typography>
                <Typography variant="h4">{students.length}</Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 200px' }}>
            <Card sx={{ bgcolor: 'success.light' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Present
                </Typography>
                <Typography variant="h4">{summary.present}</Typography>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 200px' }}>
            <Card sx={{ bgcolor: 'error.light' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Absent
                </Typography>
                <Typography variant="h4">{summary.absent}</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Attendance Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <CircularProgress />
        </Box>
      ) : students.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={batches.find((b) => b.id === student.batch_id)?.name || '-'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <RadioGroup
                        row
                        value={attendanceData[student.id]?.is_present ? 'present' : 'absent'}
                        onChange={(e) =>
                          handleStatusChange(
                            student.id,
                            e.target.value === 'present'
                          )
                        }
                      >
                        <FormControlLabel
                          value="present"
                          control={<Radio color="success" />}
                          label="Present"
                        />
                        <FormControlLabel
                          value="absent"
                          control={<Radio color="error" />}
                          label="Absent"
                        />
                      </RadioGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Save />}
              onClick={handleSubmit}
              disabled={loading}
            >
              Save Attendance
            </Button>
          </Box>
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {selectedBatch
              ? 'No students found in this batch'
              : 'Please select a batch to mark attendance'}
          </Typography>
        </Paper>
      )}
    </MainLayout>
  );
};

export default AttendancePage;
