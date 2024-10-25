import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Chip,
  Box,
  Container,
  CircularProgress,
  Alert,
  useMediaQuery,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Carousel from "react-material-ui-carousel";

const StyledCard = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius * 2,
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[10],
  },
}));

const CardImageContainer = styled(Box)({
  position: "relative",
  overflow: "hidden",
  height: 240,
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  "&:hover img": {
    transform: "scale(1.1)",
  },
});

const ImageOverlay = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  width: "100%",
  padding: theme.spacing(2),
  backgroundImage: "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
  textAlign: "left",
  color: "white",
  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker overlay on hover
    backdropFilter: "blur(0.4px)",
  },
}));

const PriceChip = styled(Chip)(() => ({
  backgroundColor: "#ff5722",
  color: "white",
  fontWeight: "bold",
  fontSize: "0.9rem",
}));

const RatingText = styled(Typography)(({ theme }) => ({
  display: "block",
  color: "yellow",
}));

const TourCarousel = ({ title, tours, loading, handleCardClick }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const cardsPerSlide = isSmallScreen ? 1 : isMediumScreen ? 2 : 3;

  // Duplicating tours to create an infinite loop effect
  const duplicatedTours = [...tours, ...tours];

  return (
    <Box sx={{ my: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
        {title}
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      ) : (
        <Carousel
          autoPlay
          indicators={true}
          interval={3500}
          animation="slide"
          navButtonsAlwaysVisible
          sx={{ px: { xs: 1, sm: 2, md: 4 } }}
          cycleNavigation
          indicatorContainerProps={{
            style: {
              marginTop: '20px',
              position: 'absolute',
              bottom: 0,
              zIndex: 1,
            },
          }}
          indicatorIconButtonProps={{
            style: {
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
          activeIndicatorIconButtonProps={{
            style: {
              color: '#ff5722',
            },
          }}
        >
          {Array.from({ length: Math.ceil(duplicatedTours.length / cardsPerSlide) }, (_, i) => (
            <Box
              key={i}
              display="flex"
              justifyContent="center"
              gap={2}
              sx={{
                px: 1,
                "& > *": { flexBasis: `calc(100% / ${cardsPerSlide} - 16px)` },
              }}
            >
              {duplicatedTours.slice(i * cardsPerSlide, i * cardsPerSlide + cardsPerSlide).map((tour, idx) => (
                <StyledCard key={idx} onClick={() => handleCardClick(tour.tourid)}>
                  <CardImageContainer>
                    <img src={tour.carousel[0]} alt={tour.tourname} />
                    <ImageOverlay>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>{tour.tourname}</Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {tour.timespent} days and {tour.timespent - 1} nights
                      </Typography>
                      <Box mt={1}>
                        <PriceChip label={`₹${tour.cost}`} />
                      </Box>
                      {/* Add rating display if available */}
                      {/* {tour.rating && (
                        <RatingText variant="caption">
                          Rating: {tour.rating} ★
                        </RatingText>
                      )} */}
                    </ImageOverlay>
                  </CardImageContainer>
                </StyledCard>
              ))}
            </Box>
          ))}
        </Carousel>
      )}
    </Box>
  );
};

const TourCards = () => {
  const [tours, setTours] = useState([]);
  const [rtours, setRtours] = useState([]);
  const [ptours, setPtours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);

        const res1 = await fetch("https://project-tour-management-server.onrender.com/user/tours");
        const data1 = await res1.json();
        setTours(data1.map((tour) => tour.details));

        const res2 = await fetch("https://project-tour-management-server.onrender.com/user/tours/highlyrecommended");
        const data2 = await res2.json();
        setRtours(data2.map((tour) => tour.details));

        const res3 = await fetch("https://project-tour-management-server.onrender.com/user/tours/popular");
        const data3 = await res3.json();
        setPtours(data3.map((tour) => tour.details));

        setLoading(false);
      } catch (err) {
        setError("Failed to load tours. Please try again later.");
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleCardClick = (tourid) => {
    navigate(`/booking/${tourid}`);
  };

  return (
    <Container sx={{ maxWidth: "lg", mt: 4 }}>
      {error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : (
        <>
          <TourCarousel title="Highly Recommended" tours={rtours} loading={loading} handleCardClick={handleCardClick} />
          <TourCarousel title="Popular Destinations" tours={ptours} loading={loading} handleCardClick={handleCardClick} />
          <TourCarousel title="All Trips" tours={tours} loading={loading} handleCardClick={handleCardClick} />
        </>
      )}
    </Container>
  );
};

export default TourCards;
