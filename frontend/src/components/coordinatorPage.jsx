import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Button,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CardMedia,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "./Navbar";
import Footer from "./Footer";

const CoordinatorPage = () => {
  const navigate = useNavigate();
  const [coordinators, setCoordinators] = useState([]);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null); // Modal state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [coordinatorResponse, toursResponse, bookingsResponse] =
          await Promise.all([
            fetch(`http://localhost:3001/guide/guide/${user.username}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`http://localhost:3001/guide/tour/${user.username}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`http://localhost:3001/guide/travellers/${user.username}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        if (
          !coordinatorResponse.ok ||
          !toursResponse.ok ||
          !bookingsResponse.ok
        ) {
          throw new Error("Failed to fetch data");
        }

        const coordinatorsData = await coordinatorResponse.json();
        const toursData = await toursResponse.json();
        const bookingsData = await bookingsResponse.json();

        const totalBookings = calculateTotal(bookingsData); // Calculate total

        setCoordinators(coordinatorsData || []);
        setTours(toursData?.map((tour) => tour.details) || []);
        setBookings(bookingsData || []);
        setTotal(totalBookings); // Set the total count
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTotal = (bookingsData) => {
    let total = 0;
    bookingsData.forEach((booking) => {
      total += booking.count;
    });
    return total;
  };


  const findTourById = (tourId) => tours.find((tour) => tour.tourid === tourId);

  const findBookingsByTourId = (tourId) =>
    bookings.filter((booking) => booking.tour_id === tourId);

  const handleTourClick = (tour) => setSelectedTour(tour);

  const handleCloseModal = () => setSelectedTour(null);

  if (loading) return <Typography>Loading...</Typography>; // Loading indicator
  if (error) return <Typography color="error">{error}</Typography>; // Error message

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          color="primary"
        >
          Coordinator's Profile & Tours
        </Typography>

        {coordinators.length > 0 ? (
          <Grid container spacing={4}>
            {coordinators.map((coordinator) => (
              <Grid item xs={12} key={coordinator.guide_id}>
                <Card sx={{ boxShadow: 3, marginBottom: 4 }}>
                  <CardContent>
                    {/* Coordinator Details */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ mr: 2 }}>{coordinator.username[0]}</Avatar>
                      <Box>
                        <Typography variant="h5" color="primary">
                          {coordinator.username}
                        </Typography>
                        <Typography variant="body1">
                          Email: {coordinator.email}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Divider sx={{ marginY: 2 }} />
                <Typography variant="h6" color="primary" sx={{ marginTop: 2 }}>
                  Total Traveler Bookings: {total}
                </Typography>


                {/* Tour Details */}
                <Typography variant="h6" color="primary">
                  Assigned Tours:
                </Typography>

                <Grid container spacing={4}>
                  {coordinator.tours?.assigned_tours?.length > 0 ? (
                    coordinator.tours.assigned_tours.map((tourId) => {
                      const tour = findTourById(tourId);

                      return tour ? (
                        <Grid item xs={12} md={6} key={tour.tourid}>
                          <Card sx={{ boxShadow: 3 }}>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                Tour: {tour.tourname} - {tour.location}
                              </Typography>

                              {/* Tour Date and Time */}
                              <Typography variant="body2">
                                <strong>Start Date:</strong>{" "}
                                {tour?.starting_date || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Start Time:</strong>{" "}
                                {tour?.starting_time || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Return Time:</strong>{" "}
                                {tour?.return_time || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Starting point:</strong>{" "}
                                {tour?.starting_point || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Return Date:</strong>{" "}
                                {tour?.return_date || "N/A"}
                              </Typography>

                              <Carousel>
                                {tour.carousel.map((image, index) => (
                                  <CardMedia
                                    key={index}
                                    component="img"
                                    height="140"
                                    image={image}
                                    alt={`Tour image ${index + 1}`}
                                  />
                                ))}
                              </Carousel>

                              <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 2 }}
                                onClick={() => handleTourClick(tour)}
                              >
                                View Details
                              </Button>

                              <Typography
                                variant="h6"
                                color="primary"
                                sx={{ marginTop: 2 }}
                              >
                                Traveler Bookings:
                              </Typography>

                              {findBookingsByTourId(tourId).length === 0 ? (
                                <Typography
                                  variant="body1"
                                  color="textSecondary"
                                >
                                  No bookings available.
                                </Typography>
                              ) : (
                                findBookingsByTourId(tourId).map(
                                  (booking, index) => (
                                    <Box key={index} sx={{ padding: 2 }}>
                                      <Typography variant="body1">
                                        Traveler: {booking.username} (
                                        {booking.email})
                                      </Typography>
                                      <Typography variant="body2">
                                        Phone: {booking.phone} | Total
                                        Travelers: {booking.count}
                                      </Typography>
                                    </Box>
                                  )
                                )
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ) : (
                        <Typography key={tourId} variant="body1" color="error">
                          No tour found for this ID.
                        </Typography>
                      );
                    })
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No assigned tours.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No coordinators available.
          </Typography>
        )}

        {/* Modal for Tour Details */}
        {selectedTour && (
          <Dialog
            open={Boolean(selectedTour)}
            onClose={handleCloseModal}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Tour Details
              <IconButton
                aria-label="close"
                onClick={handleCloseModal}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="h6">
                Tour: {selectedTour.tourname}
              </Typography>
              <Typography>Location: {selectedTour.location}</Typography>
              <Typography>Cost: ₹{selectedTour.cost}</Typography>
              <Typography>Rating: {selectedTour.rating}/10</Typography>
              <Typography>Duration: {selectedTour.timespent}</Typography>
              <Typography>Start: {selectedTour.starting_date}</Typography>
              <Typography>Time: {selectedTour.starting_time}</Typography>
              <Typography>Return: {selectedTour.return_time}</Typography>
              <Typography variant="h6">Included:</Typography>
              <List>
                {selectedTour.included.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6">Stops:</Typography>
              {selectedTour.stops.map((stopGroup, groupIndex) => (
                <Box key={groupIndex} sx={{ marginBottom: 2 }}>
                  {stopGroup.map((stop, stopIndex) => (
                    <Card key={stopIndex} sx={{ marginBottom: 2 }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={stop.image}
                        alt={stop.loc}
                      />
                      <CardContent>
                        <Typography variant="h6">{stop.loc}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {stop.notes}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Rating: {stop.rating}/10
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ))}
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseModal}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
      <Footer />
    </>
  );
};

export default CoordinatorPage;
