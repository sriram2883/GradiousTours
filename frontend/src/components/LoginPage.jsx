import React, { useEffect, useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaUserTie } from "react-icons/fa"; // Importing icons
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false); // State for terms checkbox
  const [showTermsModal, setShowTermsModal] = useState(false); // State for modal visibility
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usertype, setUsertype] = useState("user");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const termsAcceptedFromStorage = localStorage.getItem("acceptedTerms");
    if (termsAcceptedFromStorage === "true") {
      setTermsAccepted(true);
    }
  }, []);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  const handleCheckboxChange = (e) => {
    setTermsAccepted(e.target.checked);
    localStorage.setItem("acceptedTerms", e.target.checked ? "true" : "false");
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents form submission
  
    if (!termsAccepted && isSignup) {
      alert("Please accept the terms and conditions to proceed.");
      return;
    }
  
    const endpoint = isSignup
      ? "https://project-tour-management-server.onrender.com/login/register"
      : "https://project-tour-management-server.onrender.com/login/";
  
    const payload = {
      username,
      email,
      password,
      ...(isSignup ? {} : { usertype }),
    };
  
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok.");
        }
        return res.json();
      })
      .then((data) => {
        if (isSignup) {
          setIsSignup(false);
        } else {
          const { token, user } = data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          
          const prevpage = localStorage.getItem("prevloc");
          if (prevpage) {
            window.location.href = prevpage;
          } else {
            switch (usertype) {
              case "user":
                navigate("/");
                break;
              case "guide":
                navigate("/coordinator");
                break;
              case "admin":
                navigate("/admin");
                break;
              default:
                // Handle unexpected usertype
                navigate("/");
                break;
            }
          }
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  };
  

  // Handle terms modal
  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
    localStorage.setItem("acceptedTerms", "true");
  };

  const handleRejectTerms = () => {
    setShowTermsModal(false);
    setTermsAccepted(false);
    localStorage.setItem("acceptedTerms", "false");
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="login-signup-container">
        <video autoPlay loop muted className="background-video">
          <source
            src="https://videos.pexels.com/video-files/8318649/8318649-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        <div className={`form-container ${isSignup ? "signup-mode" : ""}`}>
          <div className="left-content">
            {isSignup ? (
              <div>
                <img
                  src="https://tse4.mm.bing.net/th?id=OIP.0f0cne9SBE_xoOC3cO2M3QHaHa&pid=Api&P=0&h=180"
                  alt="Gradious Travels Logo"
                  className="logo"
                />
                <h2>Join Gradious Travels</h2>
                <p>Welcome! Let's get started on your adventure.</p>
              </div>
            ) : (
              <div>
                <img
                  src="https://tse4.mm.bing.net/th?id=OIP.0f0cne9SBE_xoOC3cO2M3QHaHa&pid=Api&P=0&h=180"
                  alt="Gradious Travels Logo"
                  className="logo"
                />
                <h2>Welcome Back to Gradious Travels</h2>
                <p>
                  Let's continue exploring the world! Login to your account and
                  resume your journey.
                </p>
              </div>
            )}
          </div>

          <div className="right-form">
            <form onSubmit={handleSubmit}>
              <h2>{isSignup ? "Sign Up" : "Sign In"}</h2>

              {isSignup && (
                <div className="input-group">
                  <FaUser className="icon" />
                  <input
                    type="text"
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required={isSignup}
                    className="input-field"
                  />
                </div>
              )}

              <div className="input-group">
                <FaEnvelope className="icon" />
                <input
                  type="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <FaLock className="icon" />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="input-field"
                />
              </div>

              {!isSignup && (
                <div className="input-group">
                  <FaUserTie className="icon" />
                  <select
                    name="usertype"
                    onChange={(e) => setUsertype(e.target.value)}
                    className="input-field select-field"
                    required
                    defaultValue="user"
                  >
                    <option value="admin">Admin</option>
                    <option value="guide">Guide</option>
                    <option value="user">User</option>
                  </select>
                </div>
              )}

              {isSignup && (
                <div className="input-group">
                  <FaLock className="icon" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="input-field"
                  />
                </div>
              )}

              {isSignup && (
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    onChange={handleCheckboxChange}
                    checked={termsAccepted}
                  />
                  <label htmlFor="terms" style={{ cursor: "pointer" }}></label>
                  <span style={{ marginLeft: "10px", color: "black" }}>
                    I agree to the
                    <span
                      onClick={() => setShowTermsModal(true)}
                      style={{
                        color: "#000072",
                        textDecoration: "underline",
                        cursor: "pointer",
                        marginLeft: "5px",
                      }}
                    >
                      Terms and Conditions
                    </span>
                  </span>
                </div>
              )}

              <button type="submit" className="submit-btn">
                {isSignup ? "Sign Up" : "Sign In"}
              </button>
            </form>

            <div className="switch-link">
              {isSignup ? (
                <p>
                  Already have an account?{" "}
                  <span onClick={toggleForm}>Sign In</span>
                </p>
              ) : (
                <p>
                  New to Gradious Travels?{" "}
                  <span onClick={toggleForm}>Sign Up</span>
                </p>
              )}
            </div>
          </div>
        </div>

]        {showTermsModal && (
          <div className="terms-modal">
            <div className="terms-modal-content">
              <h3>Terms and Conditions</h3>
              <div className="terms-text">
                <p>
                  <strong>1. Introduction</strong>
                </p>
                <p>
                  These terms and conditions govern your use of the Gradious
                  Travels website and any bookings or reservations made through
                  the Website. By using the Website, you agree to be bound by
                  these Terms.
                </p>
                <p>
                  <strong>2. Bookings and Reservations</strong>
                </p>
                <p>
                  Bookings and reservations can be made online or offline
                  through our customer service team. A binding contract between
                  you and Gradious Travels will be formed when we receive your
                  deposit or full payment. Please note that all bookings and
                  reservations are subject to availability.
                </p>
                <p>
                  <strong>3. Payment Terms</strong>
                </p>
                <p>
                  Full payment for all services is required at the time of
                  booking unless otherwise stated. Payment can be made via
                  credit card, debit card, or any other payment method specified
                  on our website.
                </p>
                <p>
                  <strong>4. Cancellations and Refunds</strong>
                </p>
                <p>
                  Our cancellation policy varies depending on the services
                  booked. Please refer to our cancellation policy for more
                  details.
                </p>
                <p>
                  <strong>5. Changes and Cancellations</strong>
                </p>
                <p>
                  If you need to make changes to your booking, please contact
                  our customer service team as soon as possible. Cancellations
                  are subject to our cancellation policy, which can be found on
                  our Website.
                </p>
                <p>
                  <strong> 6. Limitation of Liabilities</strong>
                </p>

                <p>
                  {" "}
                  Gradious Travels shall not be liable for any damages or losses
                  arising from your use of the Website or participation in our
                  tours. Our liability is limited to the amount you have paid
                  for your tour.
                </p>
                <p>
                  <strong>7. Customer Special Requests</strong>
                </p>

                <p>
                  {" "}
                  We will do our best to accommodate any special requests you
                  may have, but cannot guarantee that they will be met.
                </p>
                <p>
                  <strong> 8. Safety</strong>
                </p>

                <p>
                  {" "}
                  You are responsible for your own safety during the tour. We
                  recommend that you take out travel insurance to cover any
                  unexpected events.
                </p>
                <p>
                  <strong> 9. Behavior or Code of Conduct</strong>
                </p>

                <p>
                  {" "}
                  You are expected to behave in a respectful and considerate
                  manner towards other tour participants and our staff. Failure
                  to comply with our code of conduct may result in your removal
                  from the tour.
                </p>
                <p>
                  <strong>10. Complaints</strong>
                </p>

                <p>
                  {" "}
                  If you have any complaints or issues during the tour, please
                  contact our customer service team as soon as possible. We will
                  do our best to resolve any issues promptly and fairly.
                </p>
                <p>
                  <strong>11. Data Protection</strong>
                </p>

                <p>
                  {" "}
                  We collect and use your personal data in accordance with our
                  privacy policy, which can be found on our Website.
                </p>
                <p>
                  <strong>12. Governing Law</strong>
                </p>

                <p>
                  {" "}
                  These Terms are governed by and construed in accordance with
                  the laws of India.
                </p>
                <p>
                  <strong>13. Entire Agreement</strong>
                </p>

                <p>
                  {" "}
                  These Terms constitute the entire agreement between you and
                  Gradious Travels and supersede all prior or contemporaneous
                  agreements or understandings. By using the Website, you
                  acknowledge that you have read, understood, and agree to be
                  bound by these Terms.
                </p>
                <br></br>

                <p>
                  <strong>
                    {" "}
                    Please note that this is just a draft and you should have a
                    lawyer review it to ensure it complies with the laws of
                    India.
                  </strong>
                </p>
              </div>
              <button className="accept-btn" onClick={handleAcceptTerms}>
                I Accept
              </button>
              <button className="reject-btn" onClick={handleRejectTerms}>
                I Reject
              </button>
            </div>
          </div>
        )}

        <style jsx="true">{`
          /* Background video styling */
          .background-video {
          
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 87vh;
            object-fit: cover;
            z-index: -1;
          }

          /* Container for login/signup */
          .login-signup-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 80vh;
            position: relative;
          }

          /* Form container */
          .form-container {
            width: 70%;
            height: 520px;
            display: flex;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            position: relative;
            transition: all 0.5s ease;
          }

          /* Left content (image, text) */
          .left-content {
            width: 40%;
            padding: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: linear-gradient(to right, #3a7bd5, #3a6073);
            color: #fff;
            text-align: center;
          }

          .left-content h2 {
            margin: 20px 0;
          }

          .left-content p {
            font-size: 16px;
          }

          .logo {
            max-width: 100px;
            margin-bottom: 20px;
          }

          /* Right form */
          .right-form {
            width: 40%;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .right-form h2 {
            margin-bottom: 30px;
          }

          .input-group {
            position: relative;
            margin-bottom: 20px;
            width: 90%; /* Reduced width to avoid overflow */
          }

          .icon {
            position: absolute;
            top: 35%; /* Moved icon slightly upward to better align with field */
            transform: translateY(-50%);
            left: 10px;
            font-size: 1.2em;
            color: #888;
          }

          .input-field {
            width: 100%;
            padding: 10px 10px 10px 40px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 15px; /* Increased border radius */
            font-size: 1em;
            box-sizing: border-box;
          }

          .select-field {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }

          .checkbox-group {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
          }

          .checkbox-group label {
            margin-left: 8px;
          }

          .right-form button {
            width: 90%; /* Adjusted width to prevent overflow */
            padding: 10px;
            background-color: #3a7bd5;
            border: none;
            color: white;
            cursor: pointer;
            border-radius: 15px; /* Increased border radius */
            font-size: 1em;
            margin-top: 10px;
          }

          .right-form button:hover {
            background-color: #3a6073;
          }

          .switch-link {
            margin-top: 20px;
            text-align: center;
          }

          .switch-link p {
            cursor: pointer;
            color: #2832c2;
          }

          .switch-link p span:hover {
            color: #3a6073;
          }

          /* Signup Mode */
          .signup-mode .left-content {
            order: 2;
          }

          .signup-mode .right-form {
            order: 1;
          }

          /* Responsiveness for smaller screens */
          @media screen and (max-width: 768px) {
            .form-container {
              flex-direction: column;
              height: auto;
              width: 95%;
              max-height: 90vh;
              overflow: auto;
              margin: auto;
            }

            .left-content {
              width: 100%;
              padding: 20px;
            }

            .right-form {
              width: 100%;
              padding: 20px;
            }

            .input-field,
            .submit-btn {
              width: 100%;
            }

            /* Additional styles to maintain focus on content */
            .login-signup-container {
              justify-content: center;
              align-items: center;
              padding: 20px;
            }
          }

          /* Modal Styles */
          .terms-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .terms-modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 600px;
            overflow-y: auto;
            max-height: 80%;
          }

          .terms-text {
            max-height: 400px;
            overflow-y: auto;
            margin-bottom: 20px;
          }

          .accept-btn,
          .reject-btn {
            margin: 5px;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          .accept-btn {
            background-color: #4caf50;
            color: white;
          }

          .reject-btn {
            background-color: #f44336;
            color: white;
          }

          body{
            margin: 0;
            padding: 0;
            font-family: 'Poppins', sans-serif;
            box-sizing: border-box;
          }
        `}</style>
      </div>
    </>
  );
};

export default LoginPage;
