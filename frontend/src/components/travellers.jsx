import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import debounce from 'lodash.debounce';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
}));

const TravellerOperations = () => {
  const classes = useStyles();
  const [travellers, setTravellers] = useState([]);
  const [filteredTravellers, setFilteredTravellers] = useState([]);
  const [filterType, setFilterType] = useState('tour_id');
  const [filterValue, setFilterValue] = useState('');
  const [username, setUsername] = useState('');
  const [bookedby,setBookedBy]=useState('Admin');
  const [count, setCount] = useState(0);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tourId, setTourId] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentTraveller, setCurrentTraveller] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // New state for delete confirmation dialog
  const token = localStorage.getItem("token");

  const fetchTravellers = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://project-tour-management-server.onrender.com/admin/traveller", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTravellers(data);
      setFilteredTravellers(data);
    } catch (error) {
      console.error('Error fetching travellers:', error);
      setSnackbar({ open: true, message: 'Failed to fetch travellers.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravellers();
  }, []);

  const debouncedFilter = useCallback(
    debounce((type, value) => {
      let filtered = travellers;
      if (value) {
        filtered = travellers.filter(traveller =>
          traveller[type].toString().toLowerCase().includes(value.toLowerCase())
        );
      }
      setFilteredTravellers(filtered);
    }, 300),
    [travellers]
  );

  useEffect(() => {
    debouncedFilter(filterType, filterValue);
  }, [filterType, filterValue, debouncedFilter]);

  const handleCreate = async () => {
    try {
      const response = await fetch("https://project-tour-management-server.onrender.com/admin/traveller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          count,
          phone,
          email,
          tour_id: tourId,
          bookedby,
          date: new Date().toISOString()
        }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      fetchTravellers();
      setEditOpen(false);
      resetFields();
      setSnackbar({ open: true, message: 'Traveller created successfully.', severity: 'success' });
    } catch (error) {
      console.error('Error creating traveller:', error);
      setSnackbar({ open: true, message: 'Failed to create traveller.', severity: 'error' });
    }
  };

  const handleUpdate = async () => {
    if (!currentTraveller) return;

    try {
      const response = await fetch(
        `https://project-tour-management-server.onrender.com/admin/traveller/${currentTraveller.username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username,
            count,
            phone,
            email,
            tour_id: tourId,
          }),
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      fetchTravellers();
      setEditOpen(false);
      setSnackbar({ open: true, message: 'Traveller updated successfully.', severity: 'success' });
    } catch (error) {
      console.error('Error updating traveller:', error);
      setSnackbar({ open: true, message: 'Failed to update traveller.', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!currentTraveller) return;

    try {
      const response = await fetch(
        `https://project-tour-management-server.onrender.com/admin/traveller/${currentTraveller.username}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tour_id: currentTraveller.tour_id }),
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      fetchTravellers();
      setSnackbar({ open: true, message: 'Traveller deleted successfully.', severity: 'success' });
      setConfirmDeleteOpen(false); // Close the confirmation dialog
    } catch (error) {
      console.error('Error deleting traveller:', error);
      setSnackbar({ open: true, message: 'Failed to delete traveller.', severity: 'error' });
    }
  };

  const openEditForm = (traveller) => {
    setCurrentTraveller(traveller);
    setUsername(traveller.username);
    setCount(traveller.count);
    setPhone(traveller.phone);
    setEmail(traveller.email);
    setTourId(traveller.tour_id);
    setIsCreating(false);
    setEditOpen(true);
  };

  const openCreateForm = () => {
    resetFields();
    setIsCreating(true);
    setEditOpen(true);
  };

  const openConfirmDeleteDialog = (traveller) => {
    setCurrentTraveller(traveller);
    setConfirmDeleteOpen(true); // Open confirmation dialog
  };

  const resetFields = () => {
    setUsername('');
    setCount(0);
    setPhone('');
    setEmail('');
    setTourId('');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
        <Grid item>
          <Button variant="contained" startIcon={<Add />} onClick={openCreateForm}>
            Create New Traveller
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
        <Grid item xs={12} sm={8} md={6}>
          <Box display="flex" alignItems="center" mb={2}>
            <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
              <InputLabel id="filter-type-label">Filter By</InputLabel>
              <Select
                labelId="filter-type-label"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                label="Filter By"
              >
                <MenuItem value="tour_id">Tour ID</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={`Search by ${filterType === 'tour_id' ? 'Tour ID' : 'Email'}`}
              placeholder={`Enter ${filterType === 'tour_id' ? 'Tour ID' : 'Email'}`}
              fullWidth
              variant="outlined"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {filteredTravellers.length > 0 ? (
              <Grid container spacing={2}>
                {filteredTravellers.map((traveller) => (
                  <Grid item xs={12} sm={6} md={4} key={traveller._id}>
                    <Card className={classes.card}>
                      <CardContent>
                        <Typography variant="h5">{traveller.username}</Typography>
                        <Typography variant="body1">Count: {traveller.count}</Typography>
                        <Typography variant="body1">Phone: {traveller.phone}</Typography>
                        <Typography variant="body1">Email: {traveller.email}</Typography>
                        <Typography variant="body1">Tour ID: {traveller.tour_id}</Typography>
                        <Typography variant="body1">Booked By: {traveller.bookedby}</Typography>
                        <Typography variant="body1">Booked Date: {traveller.date}</Typography>
                      </CardContent>
                      <CardContent style={{ marginTop: '10px' }}>
                        <Grid container justifyContent="space-between" alignItems="center">
                          <Grid item>
                            <IconButton onClick={() => openEditForm(traveller)} color="primary">
                              <Edit />
                            </IconButton>
                          </Grid>
                          <Grid item>
                            <IconButton onClick={() => openConfirmDeleteDialog(traveller)} color="secondary">
                              <Delete />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </CardContent>

                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No travellers found.</Typography>
            )}
          </>
        )}
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete {currentTraveller?.username}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit/Create Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>{isCreating ? 'Create Traveller' : 'Edit Traveller'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Count"
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tour ID"
            value={tourId}
            onChange={(e) => setTourId(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={isCreating ? handleCreate : handleUpdate} color="primary">
            {isCreating ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TravellerOperations;
