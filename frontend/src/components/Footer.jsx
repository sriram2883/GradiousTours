// src/components/Footer.js
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#003366", // Dark blue background
        color: "white",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="body2">
        Gradious Travels is part of Gradious Technologies Pvt. Ltd, registered
        at #264, Lotus Heights, First Floor, Kavuri Hills Phase 2, Madhapur,
        Telangana, 500033.
      </Typography>
      <Typography variant="body2">Phone: +91 90001 20995</Typography>
      <Typography variant="body2" sx={{ marginTop: 1 }}>
        Copyright © 2024 Gradious Travels. All rights reserved.
      </Typography>

      <Box sx={{ marginTop: 1 }}>
        <IconButton
          color="inherit"
          onClick={() => window.open("https://www.facebook.com", "_blank")}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => window.open("https://www.instagram.com", "_blank")}
        >
          <InstagramIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => window.open("https://www.twitter.com", "_blank")}
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => window.open("https://www.youtube.com", "_blank")}
        >
          <YouTubeIcon />
        </IconButton>
      </Box>

      <Box sx={{ marginTop: 2 }}>
        <Typography variant="body2">
          Visit us at{" "}
          <a
            href="https://gradious.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white", textDecoration: "underline" }}
          >
            Gradious.com
          </a>
        </Typography>
        <img
          src="https://tse4.mm.bing.net/th?id=OIP.0f0cne9SBE_xoOC3cO2M3QHaHa&pid=Api&P=0&h=180"
          alt="Gradious Logo"
          style={{ height: 50, marginTop: 8 }}
        />
      </Box>
    </Box>
  );
};

export default Footer;
