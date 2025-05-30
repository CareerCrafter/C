import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router";

const GuestLayout = () => {
  const isLoggedIn = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/", { replace: true });
    }
  }, [navigate, isLoggedIn]);
  return (
    <Box>
      <Toaster />
      <Outlet />
    </Box>
  );
};

export default GuestLayout;
