import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Container,
  Skeleton,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import Time from "@mui/icons-material/AccessTime";

const TourCards = () => {
  const [tours, setTours] = useState([]);
  const [rtours, setRtours] = useState([]);
  const [ptours, setPtours] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res1 = await fetch("https://project-tour-management-server.onrender.com/user/tours", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data1 = await res1.json();
        const tour1 = data1.map((tour) => tour.details);
        setTours(tour1);

        const res2 = await fetch(
          "https://project-tour-management-server.onrender.com/user/tours/highlyrecommended",
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const data2 = await res2.json();
        const tour2 = data2.map((tour) => tour.details);
        setRtours(tour2);

        const res3 = await fetch("https://project-tour-management-server.onrender.com/user/tours/popular", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data3 = await res3.json();
        const tour3 = data3.map((tour) => tour.details);
        setPtours(tour3);

        setLoading(false);
        // console.log(tours);

      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };

    fetchTours();
  }, []);

  const handleCardClick = (tourid) => {
    navigate(`/booking/${tourid}`);
  };

  const renderCarouselCards = (wtours) =>
    wtours.map((tour) => (
      <Card
        key={tour.tourid}
        onClick={() => { handleCardClick(tour.tourid); }}
        sx={{ cursor: "pointer", width: "100%", mx: 1 }}
      >
        <CardContent>
          <Typography variant="h5">{tour.tourname}</Typography>
          <Typography variant="body2" color="text.secondary">
            Duration: {tour.timespent} days {tour.timespent - 1 > 0 ? `and ${tour.timespent - 1} nights` : ''}
          </Typography>
          <Box mt={2}>
            <Chip label={`Price: ₹${tour.cost}`} color="primary" />
          </Box>
          <Box
            mt={2}
            sx={{
              overflow: "hidden",
              height: 200,
              width: "300px",
            }}
          >
            <img
              src={tour.carousel[0]}
              alt={tour.tourname}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </Box>
        </CardContent>
      </Card>
    ));

  const renderSkeletonCards = () =>
    Array.from({ length: 3 }).map((_, index) => (
      <Card key={index} sx={{ width: "100%", mx: 1 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <Box mt={2}>
            <Skeleton variant="rectangular" width="100%" height={200} />
          </Box>
        </CardContent>
      </Card>
    ));

  const carouselSettings = {
    autoPlay: true,
    infinite: true,
    animation: "slide",
    indicators: false,
    interval: 2000,
    cycleNavigation: true,
    navButtonsAlwaysVisible: true,
    slidesToshow: 3,
    navButtonsProps: {
      style: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: "white",
      },
    },
  };

  return (
    <Container>
      <Box sx={{ my: 5 }}>
        <Typography variant="h4" gutterBottom>
          Highly Recommended
        </Typography>
        <Carousel {...carouselSettings}>
          {Array.from({ length: 2 }, (_, i) => (
            <Box
              key={i}
              sx={{ display: "flex", justifyContent: "space-around" }}
            >
              {loading
                ? renderSkeletonCards()
                : renderCarouselCards(rtours).slice(i * 3, i * 3 + 3)}
            </Box>
          ))}
        </Carousel>
      </Box>

      {/* Popular Destinations Section */}
      <Box sx={{ my: 5 }}>
        <Typography variant="h4" gutterBottom>
          Popular Destinations
        </Typography>
        <Carousel {...carouselSettings}>
          {Array.from({ length: 2 }, (_, i) => (
            <Box
              key={i}
              sx={{ display: "flex", justifyContent: "space-around" }}
            >
              {loading
                ? renderSkeletonCards()
                : renderCarouselCards(ptours).slice(i * 3, i * 3 + 3)}
            </Box>
          ))}
        </Carousel>
      </Box>

      {/* All Trips Section */}
      <Box sx={{ my: 5 }}>
        <Typography variant="h4" gutterBottom>
          All Trips
        </Typography>
        <Carousel {...carouselSettings}>
          {Array.from({ length: parseInt(tours.length / 3) + 1 }, (_, i) => (
            <Box
              key={i}
              sx={{ display: "flex", justifyContent: "space-around" }}
            >
              {loading
                ? renderSkeletonCards()
                : renderCarouselCards(tours).slice(i * 3, i * 3 + 3)}
            </Box>
          ))}
        </Carousel>
      </Box>
    </Container>
  );
};

export default TourCards;
