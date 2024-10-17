import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const Terms = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    localStorage.setItem("acceptedTerms", "true");
    navigate("/login");
  };

  const handleReject = () => {
    navigate("/login");
  };

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      <video
        autoPlay
        loop
        muted
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
        <source
          src="https://videos.pexels.com/video-files/20584448/20584448-sd_640_360_30fps.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "30px",
          borderRadius: "10px",
          maxWidth: "80%",
          width: "600px",
          maxHeight: "70vh",
          overflowY: "auto",
          margin: "0 auto",
          marginTop: "50px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Terms and Conditions
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>1. Introduction</strong>
          <br />
          These terms and conditions ("Terms") govern your use of the Gradious
          Travels website (the "Website") and any bookings or reservations made
          through the Website. By using the Website, you agree to be bound by
          these Terms.
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>2. Bookings and Reservations</strong>
          <br />
          Bookings and reservations can be made online or offline through our
          customer service team. A binding contract between you and Gradious
          Travels will be formed when we receive your deposit or full payment.
          Please note that all bookings and reservations are subject to
          availability.
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>3. Payment</strong>
          <br />
          Payment can be made by credit card, bank transfer, or other payment
          methods accepted by Gradious Travels. A deposit is required to secure
          your booking, with the balance due 10 days before the tour departure
          date. Failure to make payment may result in cancellation of your
          booking.
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>4. Changes and Cancellations by Gradious Travels</strong>
          <br />
          We reserve the right to make changes to your tour itinerary or cancel
          your tour due to unforeseen circumstances. In the event of
          cancellation, we will refund your payment in full.
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>5. Changes and Cancellations by You</strong>
          <br />
          If you need to make changes to your booking, please contact our
          customer service team as soon as possible. Cancellations are subject
          to our cancellation policy, which can be found on our Website.
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>6. Limitation of Liabilities</strong>
          <br />
          Gradious Travels shall not be liable for any damages or losses arising
          from your use of the Website or participation in our tours. Our
          liability is limited to the amount you have paid for your tour.
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>7. Customer Special Requests</strong>
          <br />
          We will do our best to accommodate any special requests you may have,
          but cannot guarantee that they will be met.
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>8. Safety</strong>
          <br />
          You are responsible for your own safety during the tour. We recommend
          that you take out travel insurance to cover any unexpected events.
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>9. Behavior or Code of Conduct</strong>
          <br />
          You are expected to behave in a respectful and considerate manner
          towards other tour participants and our staff. Failure to comply with
          our code of conduct may result in your removal from the tour.
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>10. Complaints</strong>
          <br />
          If you have any complaints or issues during the tour, please contact
          our customer service team as soon as possible. We will do our best to
          resolve any issues promptly and fairly.
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>11. Data Protection</strong>
          <br />
          We collect and use your personal data in accordance with our privacy
          policy, which can be found on our Website.
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>12. Governing Law</strong>
          <br />
          These Terms are governed by and construed in accordance with the laws
          of [India].
        </Typography>

        <Typography variant="body1" paragraph>
          <strong>13. Entire Agreement</strong>
          <br />
          These Terms constitute the entire agreement between you and Gradious
          Travels and supersede all prior or contemporaneous agreements or
          understandings. By using the Website, you acknowledge that you have
          read, understood, and agree to be bound by these Terms.
        </Typography>
      </Box>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleAccept}
          style={{ marginRight: "10px" }}
        >
          I Accept
        </Button>
        <Button variant="contained" color="secondary" onClick={handleReject}>
          I Reject
        </Button>
      </div>
    </div>
  );
};

export default Terms;
