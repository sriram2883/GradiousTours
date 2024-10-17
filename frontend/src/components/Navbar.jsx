import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import GradiousLogo from './gradious logo.png';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isuser = user?.usertype === 'user' ;
  const isloggedin = user ? true : false;
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookings, setBookings] = useState([]);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Fetch bookings only once when the component is mounted
  useEffect(() => {
    if (isloggedin && user.usertype=='user') {
      const fetchBookings = async () => {
        try {
          const response = await fetch(`http://localhost:3001/user/bookedtours/${user.username}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          const data = await response.json();
          setBookings(data);
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      };
      fetchBookings();
    }
  }, [isloggedin, user?.username]); // Only run when `isloggedin` or `user.username` changes

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(211, 211, 211, 0.5)",
        backdropFilter: "blur(10px)",
        boxShadow: "none",
        width: "100%",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/">
          <img
            src={GradiousLogo}
            alt="Gradious Travels Logo"
            style={{ height: "80px", width: "200px", marginRight: "20px" }}
          />
        </Link>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button sx={buttonStyles} component={Link} to="/">
            Home
          </Button>
          <Button sx={buttonStyles} component={Link} to="/about">
            About
          </Button>
          <Button sx={buttonStyles} component={Link} to="/contact">
            Contact
          </Button>
          {isloggedin && bookings && isuser &&(
            <Button sx={buttonStyles} component={Link} to="/confirmedtours">
              My Tours
            </Button>
          )}
          {isloggedin ? (
            <>
              <Button
                sx={buttonStyles}
                onClick={() => {
                  if (user.usertype === 'admin') {
                    navigate('/admin');
                  } else if (user.usertype === 'guide') {
                    navigate('/coordinator');
                  }
                }}
              >
                {user.username}
              </Button>
              <Button
                sx={buttonStyles}
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button sx={buttonStyles} component={Link} to="/login">
              Login / Signup
            </Button>
          )}
        </Box>

        {/* Mobile Menu Icon */}
        <IconButton sx={{ display: { xs: 'block', md: 'none' } }} onClick={handleMenuToggle}>
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        {/* Mobile Menu */}
        <Box
          sx={{
            display: { xs: mobileMenuOpen ? 'block' : 'none', md: 'none' },
            position: "absolute",
            top: "64px", // Adjust based on AppBar height
            right: 0,
            width: "100%",
            backgroundColor: "rgba(211, 211, 211, 0.8)",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <Button sx={mobileMenuButtonStyles} component={Link} to="/" onClick={handleMenuToggle}>
            Home
          </Button>
          <Button sx={mobileMenuButtonStyles} component={Link} to="/about" onClick={handleMenuToggle}>
            About
          </Button>
          <Button sx={mobileMenuButtonStyles} component={Link} to="/contact" onClick={handleMenuToggle}>
            Contact
          </Button>
          {isloggedin && bookings && (
            <Button sx={mobileMenuButtonStyles} component={Link} to="/confirmedtours">
              My Tours
            </Button>
          )}
          {isloggedin ? (
            <>
              <Button
                sx={mobileMenuButtonStyles}
                onClick={() => {
                  if (user.usertype === 'admin') {
                    navigate('/admin');
                  } else if (user.usertype === 'guide') {
                    navigate('/coordinator');
                  }
                  handleMenuToggle();
                }}
              >
                {user.username}
              </Button>
              <Button
                sx={mobileMenuButtonStyles}
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button sx={mobileMenuButtonStyles} component={Link} to="/login" onClick={handleMenuToggle}>
              Login / Signup
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const buttonStyles = {
  color: "white",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  fontWeight: "bold",
  transition: "color 0.3s, text-shadow 0.3s",
  "&:hover": {
    color: "black",
    background: "linear-gradient(90deg, #ff4b2b, #ff416c)",
  },
};

const mobileMenuButtonStyles = {
  display: "block",
  color: "white",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
  fontWeight: "bold",
  transition: "color 0.3s, text-shadow 0.3s",
  "&:hover": {
    color: "black",
    background: "linear-gradient(90deg, #ff4b2b, #ff416c)",
  },
  width: "100%",
  borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
};

export default Navbar;
