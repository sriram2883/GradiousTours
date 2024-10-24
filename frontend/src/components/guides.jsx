import React, { useState, useEffect } from 'react';
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
  Divider,
  List,
  ListItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const GuideOperations = () => {
  const [guides, setGuides] = useState([]);
  const [guideId, setGuideId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [assignedTours, setAssignedTours] = useState([]);
  const [newTourId, setNewTourId] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
  const [currentGuide, setCurrentGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
    const token = localStorage.getItem("token");

  // Fetch guides from the server
  const fetchGuides = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://project-tour-management-server.onrender.com/admin/guides", {
        headers:{Authorization: `Bearer ${token}`,}
        
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setGuides(data);
    } catch (error) {
      setSnackbarMessage('Error fetching guides');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  // Validate form fields
  const validateForm = () => {
    // console.log(guideId, username, email, password);
     if (!guideId || !username || !email || (!password && isCreating)) {
      setSnackbarMessage('Please fill in all required fields');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  // Handle guide creation
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("https://project-tour-management-server.onrender.com/admin/guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          guide_id: guideId,
          username,
          email,
          password,
          tours: { assigned_tours: assignedTours },
        }),
      });
      // console.log(guideId, username, email, password, assignedTours);
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      setSnackbarMessage('Guide created successfully');
      fetchGuides();
      resetForm();
    } catch (error) {
      setSnackbarMessage('Error creating guide');
      setOpenSnackbar(true);
    }
  };

  // Handle guide update
  const handleUpdate = async () => {
    if (!currentGuide) return;

    if (!validateForm()) return;

    try {
      const response = await fetch(
        `https://project-tour-management-server.onrender.com/admin/guide/${currentGuide.guide_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username,
            email,
            password,
            tours: { assigned_tours: assignedTours },
          }),
        }
      );
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      setSnackbarMessage('Guide updated successfully');
      fetchGuides();
      resetForm();
    } catch (error) {
      setSnackbarMessage('Error updating guide');
      setOpenSnackbar(true);
    }
  };

  // Handle guide deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://project-tour-management-server.onrender.com/admin/guide/${id}`, {
        method: "DELETE",
        headers: {
        Authorization: `Bearer ${token}`,
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      setSnackbarMessage('Guide deleted successfully');
      fetchGuides();
    } catch (error) {
      setSnackbarMessage('Error deleting guide');
      setOpenSnackbar(true);
    }
  };

  // Open the edit form with existing guide details
  const openEditForm = (guide) => {
    setCurrentGuide(guide);
    setGuideId(guide.guide_id);
    setUsername(guide.username);
    setEmail(guide.email);
    setPassword(''); // Do not pre-fill password
    setAssignedTours(guide.tours.assigned_tours || []);
    setNewTourId(''); // Reset new tour ID field
    setIsCreating(false);
    setEditOpen(true);
  };

  // Open the create form
  const openCreateForm = () => {
    resetForm();
    setIsCreating(true);
    setEditOpen(true);
  };

  // Reset form fields
  const resetForm = () => {
    setGuideId('');
    setUsername('');
    setEmail('');
    setPassword('');
    setAssignedTours([]);
    setNewTourId('');
    setEditOpen(false);
    setCurrentGuide(null);
  };

  // Add a new tour ID to assignedTours
  const addTourId = () => {
    if (newTourId && !assignedTours.includes(newTourId)) {
      setAssignedTours([...assignedTours, newTourId]);
      setNewTourId(''); // Clear the input after adding
    }
  };

  // Remove a tour ID from assignedTours
  const removeTourId = (tourId) => {
    setAssignedTours(assignedTours.filter((id) => id !== tourId));
  };

  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={openCreateForm}
          >
            Create New Guide
          </Button>
        </Grid>
      </Grid>

      <div>
        <h3>Manage Guides</h3>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {guides.map((guide) => (
              <Grid item xs={12} sm={6} md={4} key={guide.guide_id}>
                <Card
                  sx={{
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {guide.username}
                    </Typography>
                    <Typography color="textSecondary">
                      <strong>Guide ID:</strong> {guide.guide_id}
                    </Typography>
                    <Typography color="textSecondary">
                      <strong>Email:</strong> {guide.email}
                    </Typography>
                    <Typography color="textSecondary">
                      <strong>Assigned Tours:</strong>{' '}
                      {guide.tours.assigned_tours.join(', ') || 'None'}
                    </Typography>

                    <Grid container justifyContent="space-between" alignItems="center" style={{ marginTop: '10px' }}>
                      <Grid item>
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          onClick={() => openEditForm(guide)}
                        >
                          <Edit />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          aria-label="delete"
                          color="secondary"
                          onClick={() => handleDelete(guide.guide_id)}
                        >
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>

      <Dialog open={editOpen} onClose={resetForm}>
        <DialogTitle>{isCreating ? 'Create Guide' : 'Edit Guide'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Guide ID"
            fullWidth
            variant="outlined"
            value={guideId}
            disabled={!isCreating}
            onChange={(e) => setGuideId(e.target.value)}
          />
          <TextField
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
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {isCreating && (
            <TextField
              margin="dense"
              label="Password"
              fullWidth
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          <Typography color="textSecondary" style={{ marginTop: '10px' }}>
            <strong>Tours:</strong>
          </Typography>
          <List>
            {assignedTours.map((tourId) => (
              <ListItem key={tourId}>
                <Grid container justifyContent="space-between">
                  <Grid item>{tourId}</Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeTourId(tourId)}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <TextField
            margin="dense"
            label="New Tour ID"
            fullWidth
            variant="outlined"
            value={newTourId}
            onChange={(e) => setNewTourId(e.target.value)}
          />
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={addTourId}
            style={{ marginTop: '10px' }}
          >
            Add Tour ID
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={isCreating ? handleCreate : handleUpdate}
            color="primary"
          >
            {isCreating ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GuideOperations;
