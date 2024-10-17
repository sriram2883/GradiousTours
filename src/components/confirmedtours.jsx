import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';

function ConfirmedTours() {
  const [confirmedtours, setConfirmedTours] = useState([]);
  const [isloggedin, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tourDetails, setTourDetails] = useState([]);

  const fetchConfirmedTours = useCallback(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!user) return;

    setLoading(true); // Start loading
    fetch(`http://localhost:3001/user/bookedtours/${user.username}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log('Confirmed Tours Data:', data); // Debugging line
        setConfirmedTours(data);
        setLoading(false); // End loading
      })
      .catch((error) => {
        console.error('Error fetching confirmed tours:', error);
        setLoading(false); // End loading in case of error
      });
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
      fetchConfirmedTours();
    }
  }, [fetchConfirmedTours]);

  useEffect(() => {
    if (confirmedtours.length > 0) {
      const token = localStorage.getItem('token');
      const fetchTourDetails = async () => {
        setLoading(true); // Start loading when fetching details
        const detailsPromises = confirmedtours.map((tour) =>
          fetch(`http://localhost:3001/user/tour/${tour.tour_id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              
            },
          })
            .then((res) => res.json())
            .then((data) => {
              console.log('Tour Details Data:', data); // Debugging line
              data.count = tour.count;
              data.bookedby=tour.bookedby;
              data.date=tour.date;
              return data;
            })
            .catch((error) => {
              console.error('Error fetching tour details:', error);
              return null;
            })
        );

        const details = await Promise.all(detailsPromises);
        console.log('Tour Details:', details); // Debugging line
        setTourDetails(details.filter(detail => detail !== null));
        setLoading(false); // End loading after fetching details
      };

      fetchTourDetails();
    }
  }, [confirmedtours]);

  if (!isloggedin) {
    return (
      <>
        <Navbar />
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6">You need to be logged in to view this page</Typography>
        </Box>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (confirmedtours.length === 0) {
    return (
      <>
        <Navbar />
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6">No confirmed tours</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Confirmed Tours
        </Typography>
        <Grid container spacing={3}>
          {tourDetails.map((tour) => (
            <Grid item xs={12} sm={6} md={4} key={tour._id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {tour[0].details?.tourname ?? 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Location:</strong> {tour[0].details?.location ?? 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Cost:</strong> {tour[0].details?.cost ? `$${tour[0].details.cost}` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Starting Point:</strong> {tour[0].details?.starting_point ? `${tour[0].details.starting_point}` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Count:</strong> {tour.count ? `${tour.count}` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Start Date:</strong> {tour[0].details?.starting_date ? new Date(tour[0].details.starting_date).toLocaleDateString() : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Return Date:</strong> {tour[0].details?.return_date ? new Date(tour[0].details.return_date).toLocaleDateString() : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Duration:</strong> {tour[0].details?.timespent ? `${tour[0].details.timespent} days` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Booked By:</strong> {tour.bookedby ? `${tour.bookedby}` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Booked Date:</strong> {tour.date ? `${new Date(tour.date).toDateString()}` : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Booking Time:</strong> {tour.date ? `${new Date(tour.date).toTimeString()}` : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default ConfirmedTours;
