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
  Table,
} from "@mui/material";
import Mail from "@mui/icons-material/Email";
import WhatsApp from "@mui/icons-material/WhatsApp";
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
  const [Message, setMessage] = useState(
    "Hello, we are going to have a great time on our upcoming tour. Please be ready at the starting point on time. Thank you."
  );
  let allMails;
  let mailLinks;
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };
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
        // console.log(coordinatorsData);
        setCoordinators(coordinatorsData || []);
        setTours(toursData?.map((tour) => tour.details) || []);
        setBookings(bookingsData || []);
        setTotal(totalBookings); // Set the total count
      } catch (err) {
        console.error("Error fetching data:", err);
        logout(); // Log out on error
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

  const findBookingsByTourId = (tourId) => {
    const tourBookings = bookings.filter((booking) => booking.tour_id === tourId);
    allMails = tourBookings.map((booking) => booking.email).join(",");
    mailLinks = `mailto:${allMails}?subject=Group%20Message&body=${encodeURIComponent(Message)}`;
    return tourBookings;
  };

  const handleTourClick = (tour) => setSelectedTour(tour);

  const handleCloseModal = () => setSelectedTour(null);


  const sendWhatsAppGroupMessage = async (tourId) => {
    const phoneNumbers = findBookingsByTourId(tourId).map((booking) => booking.phone);
    const uniquePhoneNumbers = [...new Set(phoneNumbers)]; // Remove duplicates

    try {
      const response = await fetch("http://localhost:3001/guide/send-whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          message: Message,
          recipients: uniquePhoneNumbers,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("WhatsApp messages sent successfully!");
      } else {
        alert("Failed to send WhatsApp messages.");
      }
    } catch (error) {
      console.error("Error sending WhatsApp messages:", error);
      alert("An error occurred while sending the messages.");
    }
  };
  

  if (loading) return <Typography>Loading...</Typography>; // Loading indicator
  if (error) return <Typography color="error">{error}</Typography>; // Error message

  return (
    <>
      <Navbar />
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center" color="primary">
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
                        <Typography variant="body1">Email: {coordinator.email}</Typography>
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
                                <strong>Start Date:</strong> {tour?.starting_date || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Start Time:</strong> {tour?.starting_time || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Return Time:</strong> {tour?.return_time || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Starting point:</strong> {tour?.starting_point || "N/A"}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Return Date:</strong> {tour?.return_date || "N/A"}
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

                              <Typography variant="h6" color="primary" sx={{ marginTop: 2 }}>
                                Traveler Bookings:
                              </Typography>

                              {findBookingsByTourId(tourId).length === 0 ? (
                                <Typography variant="body1" color="textSecondary">
                                  No bookings available.
                                </Typography>
                              ) : (
                                <>
                                  <Table style={{ textAlign: "center" }}>
                                    <thead>
                                      <tr>
                                        <th>Traveler</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Total Travelers</th>
                                        <th>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {findBookingsByTourId(tourId).map((booking, index) => (
                                        <tr key={index}>
                                          <td>{booking.username}</td>
                                          <td>{booking.email}</td>
                                          <td>{booking.phone}</td>
                                          <td>{booking.count}</td>
                                          <td>
                                            <a
                                              href={`https://wa.me/${booking.phone}?text=${encodeURIComponent(Message)}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              <WhatsApp sx={{color:"#347928",marginRight:2}} />
                                            </a>
                                            <a
                                              href={`mailto:${booking.email}?subject=Group%20Message&body=${encodeURIComponent(Message)}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              <Mail sx={{color:'#3ABEF9'}} />
                                            </a>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>

                                  {/* Group mail section */}


                                  <Box sx={{ marginTop: 2, display: 'flex', alignItems: 'center' }}>
                                    <a href={mailLinks} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
                                      <IconButton
                                        sx={{
                                          marginLeft: 2,
                                          fontSize: 60,
                                          color: 'secondary.main',
                                          '&:hover': {
                                            cursor: 'pointer',
                                            opacity: 0.8, // Optional hover effect
                                          },
                                        }}
                                      >
                                        <Mail sx={{ fontSize: 40, color:"#3ABEF9" }} />
                                      </IconButton>
                                    </a> {/* Adjust the size here */}
                                    <Typography variant="body1" sx={{ marginLeft: 1, color: 'primary.main' }}> {/* Adjust the color here */}
                                      Group Mail
                                    </Typography>


                                    <IconButton
                                      onClick={() => sendWhatsAppGroupMessage(tourId)}
                                      sx={{
                                        marginLeft: 2,
                                        color: 'secondary.main',
                                        '&:hover': {
                                          cursor: 'pointer',
                                          opacity: 0.8, // Optional hover effect
                                        },
                                      }}
                                    >
                                      <WhatsApp sx={{ fontSize: 40 , color : '#347928'}} />
                                    </IconButton>
                                    <Typography variant="body1" sx={{ marginLeft: 1, color: 'primary.main' }}> {/* Adjust the color here */}
                                      Group WhatsApp
                                    </Typography>

                                  </Box>


                                </>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ) : null;
                    })
                  ) : (
                    <Typography>No tours assigned yet.</Typography>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No coordinators found.</Typography>
        )}
      </Box>
      {
        ((coordinators[0].tours.assigned_tours.length > 0) ?
          <Box sx={{ marginTop: 2,marginBottom:4, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="body1" fontWeight={600}>Message to Travelers:</Typography>
            <textarea
              value={Message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              style={{ width: "60%" }}
            />
          </Box>
          : null)
      }
      <Footer />

      {/* Modal for selected tour */}
      <Dialog open={Boolean(selectedTour)} onClose={handleCloseModal} maxWidth="md" fullWidth>
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
          {selectedTour && (
            <>
              <Carousel>
                {selectedTour.carousel.map((image, index) => (
                  <CardMedia
                    key={index}
                    component="img"
                    height="140"
                    image={image}
                    alt={`Tour image ${index + 1}`}
                  />
                ))}
              </Carousel>
              <Typography variant="h6">Tour: {selectedTour.tourname}</Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {selectedTour.location}
              </Typography>
              <Typography variant="body1">
                <strong>Start Date:</strong> {selectedTour.starting_date || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Start Time:</strong> {selectedTour.starting_time || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Return Date:</strong> {selectedTour.return_date || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Return Time:</strong> {selectedTour.return_time || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Starting Point:</strong> {selectedTour.starting_point || "N/A"}
              </Typography>
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
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CoordinatorPage;
