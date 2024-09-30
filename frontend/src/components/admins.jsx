import React, { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const AdminOperations = () => {
  const [admins, setAdmins] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const token = localStorage.getItem("token");

  // Fetching admin data
  const fetchAdmins = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/coadmins',
        { headers:{
             Authorization: `Bearer ${token}`,
        }
}
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Admin creation
  const handleCreate = async () => {
    try {
      const response = await fetch("http://localhost:3001/admin/coadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      fetchAdmins();
      setDialogOpen(false);
      resetForm();
      setSnackbarMessage('Admin created successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Error creating admin');
      setOpenSnackbar(true);
      console.error('Error creating admin:', error);
    }
  };

  // Admin update
  const handleUpdate = async () => {
    if (!selectedAdmin) return;
    try {
      const response = await fetch(
        `http://localhost:3001/admin/coadmin/${username}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      fetchAdmins();
      setDialogOpen(false);
      setSnackbarMessage('Admin updated successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Error updating admin');
      setOpenSnackbar(true);
      console.error('Error updating admin:', error);
    }
  };

  // Admin deletion
  const handleDelete = async (user) => {
    try {
      const response = await fetch(
        `http://localhost:3001/admin/coadmin/${user}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          }
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      fetchAdmins();
      setSnackbarMessage('Admin deleted successfully!');
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage('Error deleting admin');
      setOpenSnackbar(true);
      console.error('Error deleting admin:', error);
    }
  };

  // Dialog open/close
  const openDialog = (admin = null) => {
    if (admin) {
      setUsername(admin.username);
      setEmail(admin.email);
      setPassword('');
      setSelectedAdmin(admin);
      setIsCreating(false);
    } else {
      resetForm();
      setSelectedAdmin(null);
      setIsCreating(true);
    }
    setDialogOpen(true);
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={() => openDialog()}
            color="primary"
          >
            Create New Admin
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        {admins.map((admin) => (
          <Grid item xs={12} sm={6} md={4} key={admin.username}>
            <Card sx={{ position: 'relative', '&:hover': { boxShadow: 6 } }}>
              <CardContent>
                <Typography variant="h6" component="div">
                  {admin.username}
                </Typography>
                <Typography color="textSecondary">
                  <strong>Email:</strong> {admin.email}
                </Typography>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ marginTop: 2 }}
                >
                  <IconButton
                    aria-label="edit"
                    color="primary"
                    onClick={() => openDialog(admin)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    color="secondary"
                    onClick={() => handleDelete(admin.username)}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{isCreating ? 'Create Admin' : 'Edit Admin'}</DialogTitle>
        <DialogContent>
          <TextField
            disabled={!isCreating}
            autoFocus
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          {isCreating ? (
            <Button onClick={handleCreate} color="primary">
              Create
            </Button>
          ) : (
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminOperations;
