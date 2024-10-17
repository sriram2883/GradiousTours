import React from "react";
import { Box, Typography } from "@mui/material";
import Navbar from './Navbar'; // Importing the Navbar component

const About = () => {
  return (
    <Box>
      <Navbar />

      <Box
        sx={{
          position: "relative",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
          src="https://videos.pexels.com/video-files/6444883/6444883-sd_640_360_30fps.mp4"/>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: 4,
            borderRadius: 2,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            maxWidth: "800px",
          }}
        >
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, letterSpacing: "0.1em" }}>
            About Gradious Travels
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            At Gradious Travels, we believe that every journey is a story waiting to be told. With passion and precision, we craft unforgettable experiences for adventurers, explorers, and dreamers.
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Founded in 2023, we specialize in personalized travel experiences, curated just for you. Whether it's the peaceful landscapes of the mountains or the vibrant cities of the world, we have a destination for every traveler. Let us take you on a journey where exploration meets comfort, and passion meets adventure.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default About;
