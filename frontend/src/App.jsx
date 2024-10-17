import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ConfirmedTours from "./components/confirmedtours";
import HomePage from "./components/HomePage";
import TourPage from "./components/TourPage";
import AdminPage from "./components/Adminpage";
import CoordinatorPage from "./components/CoordinatorPage";
import LoginPage from "./components/LoginPage";
import BookingDetails from "./components/BookingDetails";
import About from "./components/About";
import Contact from "./components/Contact";
import Terms from "./components/Terms";
import AdminDashboard from "./components/admindashboard";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tour" element={<TourPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coordinator"
          element={
            <ProtectedRoute allowedRoles={["guide"]}>
              <CoordinatorPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test/bk" element={<BookingDetails />} />
        <Route path="/booking/:tourid" element={<BookingDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/confirmedtours" element={<ConfirmedTours />} />
      </Routes>
    </Router>
  );
}

export default App;
