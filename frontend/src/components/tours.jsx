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
  CardMedia,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const TourOperations = () => {
  const [tours, setTours] = useState([]);
  const [tourId, setTourId] = useState('');
  const [details, setDetails] = useState({
    tourid: tourId,
    starting_point: '',
    tourname: '',
    included: [],
    rating: 0,
    cost: 0,
    location: '',
    starting_date: null,
    starting_time: null,
    return_date: null,
    return_time: null,
    timespent: null,
    carousel: [],
    stops: [[]], // Start with one day of stops
  });
  const [editOpen, setEditOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);


  const fetchTours = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/admin/tours', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const calculateTimeSpent = (startingDate, returnDate) => {
    if (!startingDate || !returnDate) return null;
    const startDate = new Date(startingDate);
    const endDate = new Date(returnDate);
    const timeDifference = endDate - startDate;
    // Convert time difference from milliseconds to days
    let timeSpentDays = Math.ceil(timeDifference / (1000 * 86400));
    return timeSpentDays == (null || '') ? '1' : timeSpentDays;
  };

  const handleCreate = async () => {
    // Calculate timespent and create a new object with updated details
    let timespent = calculateTimeSpent(details.starting_date, details.return_date);
    const updatedDetails = { ...details, timespent, tourid: tourId };

    try {
      const response = await fetch('http://localhost:3001/admin/tour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tour_id: tourId, details: updatedDetails }), // Use updated details
      });

      if (!response.ok) throw new Error('Network response was not ok');

      await response.json();
      fetchTours();
      setEditOpen(false);

      // Reset details and tourId after creation
      setDetails({
        tourid: '',
        starting_point: '',
        tourname: '',
        included: [],
        rating: 0,
        cost: 0,
        location: '',
        starting_date: null,
        starting_time: null,
        return_date: null,
        return_time: null,
        timespent: null,
        carousel: [],
        stops: [[]], // Reset to one day of stops
      });
      setTourId(''); // Clear tourId after creation
    } catch (error) {
      console.error('Error creating tour:', error);
    }
  };


  const handleUpdate = async () => {
    if (!currentTour) return;

    // Calculate timespent and create a new object with updated details
    let timespent = calculateTimeSpent(details.starting_date, details.return_date);
    const updatedDetails = { ...details, timespent };

    try {
      const response = await fetch(
        `http://localhost:3001/admin/tour/${currentTour.tour_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ details: updatedDetails }), // Use updated details
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      fetchTours();
      setEditOpen(false);
    } catch (error) {
      console.error('Error updating tour:', error);
    }
  };


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/tour/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      await response.json();
      fetchTours();
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };
  //error in setting old stops
  const openEditForm = (tour) => {
    setCurrentTour(tour);
    setDetails({
      ...tour.details,
      stops: Array.isArray(tour.details.stops) ? tour.details.stops : [[]], // Ensure stops is an array of arrays
    });
    // console.log(details.stops[0]);
    setTourId(tour.tour_id);
    setIsCreating(false);
    setEditOpen(true);
  };

  const openCreateForm = () => {
    setDetails({
      tourid: '',
      starting_point: '',
      tourname: '',
      included: [],
      rating: 0,
      cost: 0,
      location: '',
      starting_date: null,
      starting_time: null,
      return_date: null,
      return_time: null,
      timespent: null,
      carousel: [],
      stops: [[]], // Start with one day of stops
    });
    setTourId(''); // Clear tourId field for new tour
    setIsCreating(true);
    setEditOpen(true);
  };

  const addCarouselEntry = () => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      carousel: [...prevDetails.carousel, ''],
    }));
  };

  const removeCarouselEntry = (index) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      carousel: prevDetails.carousel.filter((_, i) => i !== index),
    }));
  };

  const addStopEntry = (dayIndex) => {
    setDetails((prevDetails) => {
      const updatedStops = [...prevDetails.stops];
      if (!updatedStops[dayIndex]) updatedStops[dayIndex] = [];
      updatedStops[dayIndex].push({
        loc: '',
        notes: '',
        image: '',
        pros: [],
        duration: '',
      });
      return { ...prevDetails, stops: updatedStops };
    });
  };

  const removeStopEntry = (dayIndex, stopIndex) => {
    setDetails((prevDetails) => {
      const updatedStops = [...prevDetails.stops];
      if (updatedStops[dayIndex]) {
        updatedStops[dayIndex] = updatedStops[dayIndex].filter((_, i) => i !== stopIndex);
        return { ...prevDetails, stops: updatedStops };
      }
      return prevDetails;
    });
  };

  const addNewDay = () => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      stops: [...prevDetails.stops, []],
    }));
  };

  const removeDay = (dayIndex) => {
    setDetails((prevDetails) => {
      const updatedStops = [...prevDetails.stops];
      updatedStops.splice(dayIndex, 1);
      return { ...prevDetails, stops: updatedStops };
    });
  };

  const handleCarouselChange = (index, value) => {
    setDetails((prevDetails) => {
      const newCarousel = [...prevDetails.carousel];
      newCarousel[index] = value;
      return { ...prevDetails, carousel: newCarousel };
    });
  };

  const handleStopChange = (dayIndex, stopIndex, field, value) => {
    setDetails((prevDetails) => {
      const newStops = [...prevDetails.stops];
      if (newStops[dayIndex] && newStops[dayIndex][stopIndex]) {
        newStops[dayIndex][stopIndex][field] = value;
      }
      return { ...prevDetails, stops: newStops };
    });
  };

  const handleProsChange = (dayIndex, stopIndex, value) => {
    setDetails((prevDetails) => {
      const newStops = [...prevDetails.stops];
      if (newStops[dayIndex] && newStops[dayIndex][stopIndex]) {
        newStops[dayIndex][stopIndex].pros = value.split(', ').filter(Boolean);
      }
      return { ...prevDetails, stops: newStops };
    });
  };
  const getFirstCarouselImage = (carousel) => {
    return carousel.length > 0 ? carousel[0] : '';
  };
  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Button startIcon={<Add />} onClick={openCreateForm}>
            Create New Tour
          </Button>
        </Grid>
      </Grid>


      <div>
        <h3>Manage Tours</h3>
        {loading ?(<CircularProgress/>):
        <Grid container spacing={2}>
          {tours.map((tour) => (
            <Grid item xs={12} sm={6} md={4} key={tour.tour_id}>
              <Card
               sx={{
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}>
                <CardContent>
                  <Grid container spacing={2}>
                    {/* Text content on the left side */}
                    <Grid item xs={12} sm={8}>
                      <Typography variant="h5" component="div">
                        {tour.details.tourname}
                      </Typography>
                      <Typography color="textSecondary">
                        <strong>Tour ID:</strong> {tour.tour_id}
                      </Typography>
                      <Typography color="textSecondary">
                        <strong>Starting Point:</strong> {tour.details.starting_point}
                      </Typography>
                      <Typography color="textSecondary">
                        <strong>Location:</strong> {tour.details.location}
                      </Typography>
                      <Typography color="textSecondary">
                        <strong>Cost:</strong> ${tour.details.cost}
                      </Typography>
                      <Typography color="textSecondary">
                        <strong>Rating:</strong> {tour.details.rating}
                      </Typography>

                      <Typography color="textSecondary">
                        <strong>Time Spent:</strong> {tour.details.timespent} days
                      </Typography>
                      <Typography color="textSecondary">
                        <strong>Starting Date:</strong> {tour.details.starting_date}
                      </Typography>
                      <Typography color="textSecondary">
                        <strong>Starting Time:</strong> {tour.details.starting_time}
                      </Typography>
                      <Typography color="textSecondary">
                        <strong>Return Date:</strong> {tour.details.return_date}
                      </Typography>
                      <Typography color="textSecondary">
                        <strong>Return Time:</strong> {tour.details.return_time}
                      </Typography>
                    </Grid>

                    {/* Image on the right side */}
                    <Grid item xs={12} sm={4}>
                      <CardMedia
                        component="img"
                        image={getFirstCarouselImage(tour.details.carousel)}
                        alt="Tour Image"
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }} // Ensure the image fits well
                      />
                    </Grid>
                  </Grid>

                  {/* Action buttons */}
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ marginTop: '10px' }}
                  >
                    <Grid item>
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => openEditForm(tour)}
                      >
                        <Edit />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        aria-label="delete"
                        color="secondary"
                        onClick={() => handleDelete(tour.tour_id)}
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
        }
      </div>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>{isCreating ? 'Create Tour' : 'Edit Tour'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tour Id"
            fullWidth
            variant="outlined"
            value={tourId}
            disabled={!isCreating} // Disable input field when editing
            onChange={(e) => setTourId(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Tour Name"
            fullWidth
            variant="outlined"
            value={details.tourname}
            onChange={(e) => setDetails({ ...details, tourname: e.target.value })}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Starting Point"
            fullWidth
            variant="outlined"
            value={details.starting_point}
            onChange={(e) => setDetails({ ...details, starting_point: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Included"
            fullWidth
            variant="outlined"
            value={details.included.join(', ')}
            onChange={(e) =>
              setDetails({ ...details, included: e.target.value.split(', ').filter(Boolean) })
            }
          />
          <TextField
            margin="dense"
            label="Rating"
            type="number"
            fullWidth
            variant="outlined"
            value={details.rating}
            onChange={(e) => setDetails({ ...details, rating: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Cost"
            type="number"
            fullWidth
            variant="outlined"
            value={details.cost}
            onChange={(e) => setDetails({ ...details, cost: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Location"
            fullWidth
            variant="outlined"
            value={details.location}
            onChange={(e) => setDetails({ ...details, location: e.target.value })}
          />
          {!isCreating && (
            <TextField
              margin="dense"
              label="Time Spent"
              fullWidth
              variant="outlined"
              disabled={true}
              value={details.timespent || ''}
            />
          )}

          <TextField
            margin="dense"
            label="Starting Date"
            type="date"
            fullWidth
            variant="outlined"
            value={details.starting_date}
            onChange={(e) => setDetails({ ...details, starting_date: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Starting Time"
            type="time"
            fullWidth
            variant="outlined"
            value={details.starting_time}
            onChange={(e) => setDetails({ ...details, starting_time: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Return Date"
            type="date"
            fullWidth
            variant="outlined"
            value={details.return_date}
            onChange={(e) => setDetails({ ...details, return_date: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Return Time"
            type="time"
            fullWidth
            variant="outlined"
            value={details.return_time}
            onChange={(e) => setDetails({ ...details, return_time: e.target.value })}
          />

          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6">Carousel Images</Typography>
          {details.carousel.map((image, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <TextField
                margin="dense"
                label={`Image URL ${index + 1}`}
                fullWidth
                variant="outlined"
                value={image}
                onChange={(e) => handleCarouselChange(index, e.target.value)}
              />
              <IconButton
                aria-label="delete"
                color="secondary"
                onClick={() => removeCarouselEntry(index)}
              >
                <Delete />
              </IconButton>
            </div>
          ))}
          <Button onClick={addCarouselEntry}>Add Image</Button>

          <Divider style={{ margin: '20px 0' }} />
          <Typography variant="h6">Tour Stops</Typography>
          {details.stops.map((dayStops = [], dayIndex) => (
            <div key={dayIndex}>
              <Typography variant="subtitle1" component="div">
                Day {dayIndex + 1}
              </Typography>
              {Array.isArray(dayStops) && dayStops.map((stop, stopIndex) => (
                <Card key={stopIndex} style={{ marginBottom: '10px' }}>
                  <CardContent>
                    <TextField
                      margin="dense"
                      label="Location"
                      fullWidth
                      variant="outlined"
                      value={stop.loc || ''} // Provide default value
                      onChange={(e) => handleStopChange(dayIndex, stopIndex, 'loc', e.target.value)}
                    />
                    <TextField
                      margin="dense"
                      label="Notes"
                      fullWidth
                      variant="outlined"
                      value={stop.notes || ''}
                      onChange={(e) => handleStopChange(dayIndex, stopIndex, 'notes', e.target.value)}
                    />
                    <TextField
                      margin="dense"
                      label="Image URL"
                      fullWidth
                      variant="outlined"
                      value={stop.image || ''}
                      onChange={(e) => handleStopChange(dayIndex, stopIndex, 'image', e.target.value)}
                    />
                    <TextField
                      margin="dense"
                      label="Duration"
                      fullWidth
                      variant="outlined"
                      value={stop.duration || ''}
                      onChange={(e) => handleStopChange(dayIndex, stopIndex, 'duration', e.target.value)}
                    />
                    <TextField
                      margin="dense"
                      label="Pros (comma separated)"
                      fullWidth
                      variant="outlined"
                      value={stop.pros ? stop.pros.join(', ') : ''}
                      onChange={(e) => handleProsChange(dayIndex, stopIndex, e.target.value)}
                    />
                    <IconButton
                      aria-label="delete"
                      color="secondary"
                      onClick={() => removeStopEntry(dayIndex, stopIndex)}
                    >
                      <Delete />
                    </IconButton>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={() => addStopEntry(dayIndex)}>Add Stop</Button>
              {details.stops.length > 1 && (
                <Button onClick={() => removeDay(dayIndex)}>Remove Day</Button>
              )}
            </div>
          ))}
          <Button onClick={addNewDay}>Add New Day</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="primary">
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
    </>
  );
};

export default TourOperations;
