import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Divider from "@mui/material/Divider";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "./Footer";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  TextField,
  Button,
  Skeleton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import DirectionsTransitIcon from "@mui/icons-material/DirectionsTransit";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import TempleBuddhistIcon from "@mui/icons-material/TempleBuddhist";
import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SpaIcon from "@mui/icons-material/Spa";
import Time from "@mui/icons-material/AccessTime";
import { BsCheckCircleFill } from "react-icons/bs";

// Icons mapping
const iconsMapping = {
  train: <DirectionsTransitIcon />,
  beach: <BeachAccessIcon />,
  breakfast: <RestaurantIcon />,
  temple: <TempleBuddhistIcon />,
  nature: <NaturePeopleIcon />,
  sunset: <WbSunnyIcon />,
  meditation: <SpaIcon />,
};

const BookingDetails = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const tourid = useParams().tourid;
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem('user'));
  const [tour, setTour] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    count: 1,
  });

  // Fetch tours data
  useEffect(() => {
    fetch("https://project-tour-management-server.onrender.com/user/tours", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        const tur = data.map((e) => e.details);
        setBookingData([...tur]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tours:", error);
        setLoading(false);
      });
  }, []);

  // Find and set the selected tour
  useEffect(() => {
    if (bookingData.length > 0) {
      const selectedTour = bookingData.find((tour) => tour.tourid == tourid);
      setTour(selectedTour);
    }
  }, [bookingData, tourid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Booking Details:", formData);
    // Add your form submission logic here
  };

  const handleBookNowClick = () => {
    if (!localStorage.getItem("token")) {
      alert("login");
      navigate("/login");
      return;
    }
    fetch(`https://project-tour-management-server.onrender.com/user/tour/${tourid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        bookedby: user.username,
        username: formData.name,
        email: formData.email,
        phone: formData.phone,
        count: formData.count,
        tour_id: tourid,
        date: new Date().toISOString()
      }),
    })
      .then((res) => {
        if (res.ok) {
          setIsModalOpen(true);
        }
      })
      .catch(() => {
        alert("error booking");
      });
  };

  const renderSkeleton = () => (
    <Card sx={{ padding: 2, boxShadow: 3 }}>
      <Skeleton variant="rectangular" width="100%" height={400} />
      <CardContent>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="80%" />
          </Grid>
          <Grid item xs={6}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="80%" />
          </Grid>
        </Grid>
        <Skeleton variant="text" width="40%" />
        <List>
          {Array.from(new Array(3)).map((_, index) => (
            <ListItem key={index}>
              <Skeleton variant="text" width="100%" />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ marginY: 4 }} />
        <Skeleton variant="text" width="40%" />
        <Box sx={{ maxHeight: "400px", overflowY: "auto", paddingRight: 2 }}>
          {Array.from(new Array(3)).map((_, index) => (
            <Card key={index} sx={{ marginBottom: 3, boxShadow: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  if (loading || !tour) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Container maxWidth="md" sx={{ marginTop: 5 }}>
            {renderSkeleton()}
          </Container>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="md" sx={{ marginTop: 5 }}>
          <Card sx={{ padding: 2, boxShadow: 3 }}>
            <Carousel>
              {tour.carousel.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image}
                  alt={`carousel-${index}`}
                  sx={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
              ))}
            </Carousel>

            <CardContent>
              <Typography
                variant="h4"
                gutterBottom
                textAlign="center"
                color="primary"
              >
                {tour.tourname}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6" color="textSecondary">
                    Location: {tour.location}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    <Time ></Time>  {tour.timespent} days {tour.timespent - 1 > 0 ? `and ${tour.timespent - 1} nights` : ''}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Rating:{tour.rating} / 10
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Starting Point: {tour.starting_point}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    Rerturn date: {tour.return_date}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h5" color="primary" align="right">
                    Cost: ₹{tour.cost}
                  </Typography>
                  <Typography variant="body1" align="right">
                    Starting: {tour.starting_date}, {tour.starting_time}
                  </Typography>
                  <Typography variant="body1" align="right">
                    Return: {tour.return_time}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
                Included:
              </Typography>
              <List>
                {tour.included.map((item, index) => (
                  <ListItem key={index}>
                    <BsCheckCircleFill />
                    <ListItemText primary={item} sx={{ padding: 1 }} />
                  </ListItem>
                ))}
              </List>
              {/* Divider added here */}
              <Divider sx={{ marginY: 4 }} />
              <Box sx={{ borderBottom: "2px solid #ccc", my: 3 }} />
              <Typography
                variant="h5"
                gutterBottom
                sx={{ marginTop: 4, textAlign: "center" }}
              >
                Trip Schedule
              </Typography>

              <Box
                sx={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  paddingRight: 2,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ccc",
                    borderRadius: "10px",
                  },
                }}
              >
                {tour.stops.map((day, dayIndex) => (
                  <Box key={dayIndex} sx={{ marginTop: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Day {dayIndex + 1} Stops:
                    </Typography>
                    {Object.values(day)
                      .flat()
                      .map((stop, index) => (
                        <Card
                          key={index}
                          sx={{ marginBottom: 3, boxShadow: 2 }}
                        >
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={4}>
                                <Box
                                  component="img"
                                  src={stop.image}
                                  alt={stop.loc}
                                  sx={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} md={8}>
                                <Typography variant="h6" gutterBottom>
                                  {stop.loc}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  color="textSecondary"
                                  paragraph
                                >
                                  {stop.notes}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  Duration: {stop.duration}
                                </Typography>

                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  gutterBottom
                                >
                                  Known For:
                                </Typography>
                                <Box display="flex" flexWrap="wrap">
                                  {stop.pros.map((pro, index) => (
                                    <Chip
                                      key={index}
                                      icon={iconsMapping[pro] || null}
                                      label={pro}
                                      sx={{ margin: 0.5 }}
                                      color="primary"
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Separate Booking Form Section */}
          {token !== null ? (
            <Card sx={{ marginTop: 4, padding: 2, boxShadow: 3 }}>
              <Typography variant="h5" align="center">
                Booking Information
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ marginTop: 3, textAlign: "center" }}
              >
                <TextField
                  label="Booked By"
                  value={user.username}
                  required
                  disabled={true}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  label="People Count"
                  name="count"
                  type="number"
                  value={formData.count}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={handleBookNowClick}
                >
                  Book Now
                </Button>
              </Box>
            </Card>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 4,
                marginBottom: 10,
              }}
            >
              <Button
                variant="contained"
                onClick={() => { localStorage.setItem("prevloc", window.location.href); navigate("/login") }}
                sx={{
                  padding: 2,
                  backgroundColor: "#8FD14F",
                  borderRadius: 2,
                  color: "#333",
                  boxShadow: 3,
                  "&:hover": {
                    backgroundColor: "#6EC207",
                  },
                }}
              >
                Please Login to Book
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="thank-you-modal-title"
        aria-describedby="thank-you-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="thank-you-modal-title"
            variant="h4"
            component="h2"
            align="center"
            gutterBottom
          >
            Thank You for Your Booking!
          </Typography>
          <Typography
            id="thank-you-modal-description"
            sx={{ mt: 2, mb: 4 }}
            align="center"
          >
            You will receive a confirmation email shortly with the details of
            your booking.
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{formData.name}</TableCell>
                  <TableCell>{formData.email}</TableCell>
                  <TableCell>{formData.phone}</TableCell>
                  <TableCell>{formData.count}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default BookingDetails;
