import React from "react";
import { Box, Typography, TextField, Button, IconButton } from "@mui/material";
import { Facebook, Instagram, YouTube, LinkedIn, Twitter } from '@mui/icons-material'; // Importing icons
import Navbar from './Navbar'; 

const Contact = () => {
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
          src="https://videos.pexels.com/video-files/1409899/1409899-sd_640_360_25fps.mp4"
        />

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, letterSpacing: "0.05em" }}>
            Get in Touch
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Email us at: <a href="mailto:contact@gradiousTravels.com" style={{ color: "white", textDecoration: "underline" }}>contact@gradiousTravels.com</a>
          </Typography>

          <TextField
            variant="filled"
            label="Name"
            fullWidth
            sx={{ mb: 2, backgroundColor: "rgba(255, 255, 255, 0.7)", borderRadius: 1 }}
          />
          <TextField
            variant="filled"
            label="Email"
            fullWidth
            sx={{ mb: 2, backgroundColor: "rgba(255, 255, 255, 0.7)", borderRadius: 1 }}
          />
          <TextField
            variant="filled"
            label="Message"
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2, backgroundColor: "rgba(255, 255, 255, 0.7)", borderRadius: 1 }}
          />
          <Button variant="contained" color="primary" sx={{ fontWeight: 700 }}>
            Send Message
          </Button>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
            <IconButton href="https://www.twitter.com" target="_blank" sx={{ color: "white" }}>
              <Twitter />
            </IconButton>
            <IconButton href="https://www.instagram.com" target="_blank" sx={{ color: "white" }}>
              <Instagram />
            </IconButton>
            <IconButton href="https://www.facebook.com" target="_blank" sx={{ color: "white" }}>
              <Facebook />
            </IconButton>
            <IconButton href="https://www.youtube.com" target="_blank" sx={{ color: "white" }}>
              <YouTube />
            </IconButton>
            <IconButton href="https://www.linkedin.com" target="_blank" sx={{ color: "white" }}>
              <LinkedIn />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Contact;
