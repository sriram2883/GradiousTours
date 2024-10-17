import React from "react";
import { Box, Typography } from "@mui/material";
import Carousel from "react-material-ui-carousel";

const HeroSection = () => {
  const items = [
    {
      name: "PEACE",
      description: "Experience tranquility in every destination",
      video:
        "https://videos.pexels.com/video-files/2635756/2635756-hd_1920_1080_30fps.mp4",
    },
    {
      name: "PASSION",
      description: "Explore the world with unwavering passion",
      video:
        "https://videos.pexels.com/video-files/3121327/3121327-uhd_2560_1440_24fps.mp4",
    },
    {
      name: "PARADISE",
      description: "Where every dream turns into reality",
      video:
        "https://videos.pexels.com/video-files/28180180/12319995_2560_1440_60fps.mp4",
    },
  ];

  return (
    <Box sx={{ position: "relative", textAlign: "center", color: "white" }}>
      <Carousel>
        {items.map((item, i) => (
          <Box
            key={i}
            sx={{
              height: "75vh",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              speed: 0.1,
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            {/* Video Background */}
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
            >
              <source src={item.video} type="video/mp4" />
            </video>

            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.4)", // Adjust brightness here
                zIndex: 0,
              }}
            />

            <Typography
              variant="h3"
              sx={{
                zIndex: 1,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)",
                fontSize: { xs: "2rem", md: "3.5rem" },
              }}
            >
              {item.name}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                zIndex: 1,
                fontWeight: 400,
                letterSpacing: "0.05em",
                textShadow: "1px 1px 5px rgba(0, 0, 0, 0.6)",
                fontSize: { xs: "1rem", md: "1.5rem" },
                marginTop: 1,
              }}
            >
              {item.description}
            </Typography>
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default HeroSection;
