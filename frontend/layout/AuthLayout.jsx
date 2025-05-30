import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import Navbar from "../src/components/Navbar";
import { Toaster } from "react-hot-toast";

const AuthLayout = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return (
    <Box>
      <Toaster position="bottom-center" />
      <Navbar />
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
