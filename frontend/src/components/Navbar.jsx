import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Home, Settings } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  // Helper function to determine if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" sx={{ backgroundColor: "#111" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "turquoise" }}
        >
          Expense Tracker
        </Typography>

        {/* Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            component={Link}
            to="/"
            sx={{
              backgroundColor: isActive("/") ? "turquoise" : "transparent",
              color: isActive("/") ? "black" : "white",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "turquoise",
                color: "black",
              },
            }}
            startIcon={<Home />}
          >
            Home
          </Button>

          <Button
            component={Link}
            to="/services"
            sx={{
              backgroundColor: isActive("/services")
                ? "turquoise"
                : "transparent",
              color: isActive("/services") ? "black" : "white",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "turquoise",
                color: "black",
              },
            }}
            startIcon={<Settings />}
          >
            Services
          </Button>

          <Button
            component={Link}
            to="/getStarted"
            sx={{
              backgroundColor: isActive("/getStarted")
                ? "turquoise"
                : "transparent",
              color: isActive("/getStarted") ? "black" : "white",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "turquoise",
                color: "black",
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
