// TourOverview.js
import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";

const tourImages = [
  {
    title: "Beautiful Mountain View",
    img: "https://th.bing.com/th/id/OIP.4kxJ0E-QjJkiG87JA6QXpAHaE8?rs=1&pid=ImgDetMain://source.unsplash.com/1600x900/?mountain",
  },
  {
    title: "",
    img: "https://th.bing.com/th/id/OIP.4kxJ0E-QjJkiG87JA6QXpAHaE8?rs=1&pid=ImgDetMain",
  },
  {
    title: "City Lights",
    img: "https://th.bing.com/th/id/OIP.bMiLHLPq67SrhND5q87niQHaFB?pid=ImgDet&w=206&h=140&c=7&dpr=1.3",
  },
];

const tours = [
  {
    title: "Mountain Expedition",
    description: "Explore the majestic mountains with our guided tours.",
    time: "3 days, 2 nights",
    cost: "$400",
  },
  {
    title: "Beach Relaxation",
    description: "Enjoy serene beaches and calm waters.",
    time: "5 days, 4 nights",
    cost: "$700",
  },
  {
    title: "City Adventures",
    description: "Discover the hustle and bustle of vibrant city life.",
    time: "2 days, 1 night",
    cost: "$300",
  },
];

const TourOverview = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {/* Carousel Section */}
      <Carousel>
        {tourImages.map((item, index) => (
          <Box key={index} sx={{ position: "relative", textAlign: "center" }}>
            <CardMedia
              component="img"
              height="450"
              image={item.img}
              alt={item.title}
            />
            <Typography
              variant="h4"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "white",
                fontWeight: "bold",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "10px 20px",
                borderRadius: "10px",
              }}
            >
              {item.title}
            </Typography>
          </Box>
        ))}
      </Carousel>

      {/* Tour Overview Section */}
      <Typography variant="h3" align="center" sx={{ my: 5 }}>
        Our Tours
      </Typography>
      <Grid container spacing={4}>
        {tours.map((tour, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {tour.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {tour.description}
                </Typography>

                {/* Tour Plan (Time and Cost) */}
                <Typography variant="h6" color="textSecondary">
                  Tour Plan:
                </Typography>
                <List>
                  <ListItem disableGutters>
                    <ListItemText primary="Duration" secondary={tour.time} />
                  </ListItem>
                  <Divider />
                  <ListItem disableGutters>
                    <ListItemText primary="Cost" secondary={tour.cost} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TourOverview;
