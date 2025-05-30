import React from "react";
import ReactDOM from "react-dom/client";
import { Box } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import GetStarted from "./pages/getStarted";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/expense";
import ForgotPassword from "./pages/ForgotPassword";

import "./index.css";

const AppContent = () => {
  const location = useLocation();

  // Show main navbar only on these routes
  const showMainNavbar = [
    "/",
    "/services",
    "/getStarted",
    "/register",
  ].includes(location.pathname);

  return (
    <>
      {/* Toast notifications container */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Conditionally render Navbar */}
      {showMainNavbar && <Navbar />}

      <Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/getStarted" element={<GetStarted />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Box>
    </>
  );
};

const Main = () => (
  <Router>
    <AppContent />
  </Router>
);

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
