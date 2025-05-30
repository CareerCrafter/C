import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const validationSchema = yup.object({
    newPassword: yup
      .string()
      .min(6, "Minimum 6 characters")
      .required("Required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Required"),
  });

  const handleReset = async (values) => {
    try {
      // Here you should send the new password to your backend
      toast.success("Password reset successfully!");
      navigate("/"); // Redirect to login
    } catch (error) {
      toast.error("Reset failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#E0E0E0",
      }}
    >
      <Formik
        initialValues={{ newPassword: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleReset}
      >
        {({ handleSubmit, getFieldProps, touched, errors }) => (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
              width: 350,
              boxShadow: "0 0 15px 2px rgba(20, 184, 166, 0.4)",
              padding: "1.5rem",
              borderRadius: 8,
              backgroundColor: "#1E1E1E",
              color: "#E0E0E0",
            }}
          >
            <Typography variant="h5" sx={{ color: "rgb(20, 184, 166)" }}>
              Reset Password
            </Typography>

            <FormControl fullWidth>
              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                {...getFieldProps("newPassword")}
                required
                variant="filled"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        sx={{ color: "#E0E0E0" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "#2c2c2c",
                  borderRadius: 1,
                  input: { color: "#E0E0E0" },
                  "& .MuiInputLabel-root": {
                    color: "rgba(20, 184, 166, 0.7)",
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#2c2c2c",
                  },
                  "& .MuiFilledInput-underline:before": {
                    borderBottomColor: "#555",
                  },
                  "& .MuiFilledInput-underline:after": {
                    borderBottomColor: "rgb(20, 184, 166)",
                  },
                }}
              />
              {touched.newPassword && errors.newPassword && (
                <FormHelperText error sx={{ color: "#cf6679" }}>
                  {errors.newPassword}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                {...getFieldProps("confirmPassword")}
                required
                variant="filled"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirm((prev) => !prev)}
                        edge="end"
                        sx={{ color: "#E0E0E0" }}
                      >
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "#2c2c2c",
                  borderRadius: 1,
                  input: { color: "#E0E0E0" },
                  "& .MuiInputLabel-root": {
                    color: "rgba(20, 184, 166, 0.7)",
                  },
                  "& .MuiFilledInput-root": {
                    backgroundColor: "#2c2c2c",
                  },
                  "& .MuiFilledInput-underline:before": {
                    borderBottomColor: "#555",
                  },
                  "& .MuiFilledInput-underline:after": {
                    borderBottomColor: "rgb(20, 184, 166)",
                  },
                }}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <FormHelperText error sx={{ color: "#cf6679" }}>
                  {errors.confirmPassword}
                </FormHelperText>
              )}
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "rgb(20, 184, 166)",
                color: "#121212",
                fontWeight: "bold",
                mt: 2,
                "&:hover": {
                  backgroundColor: "rgba(20, 184, 166, 0.8)",
                },
              }}
            >
              Reset Password
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default ForgotPassword;
