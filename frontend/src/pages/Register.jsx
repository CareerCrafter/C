import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import React, { useEffect, useState } from "react";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// CORRECTED: baseURL should be the root of your API, not including the specific endpoint
const axiosInstance = axios.create({
  baseURL: "http://localhost:5050", // Corrected base URL
});

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    toast.dismiss();
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const registerUser = async (values) => {
    try {
      // The specific endpoint is now correctly appended here
      const res = await axiosInstance.post("/user/register", values);
      toast.success(res?.data?.message || "Registration Successful!");
      setTimeout(() => {
        navigate("/GetStarted");
      }, 2000);
    } catch (error) {
      console.error("Register user error:", error);
      // This will display the specific error message from the backend,
      // e.g., "Email already exists." or Yup validation messages.
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#121212", // Dark background
        color: "#E0E0E0",
        padding: 2,
      }}
    >
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          address: "",
          password: "",
          gender: "",
          phoneNumber: "",
        }}
        validationSchema={yup.object({
          fullName: yup
            .string()
            .required("Full name is required.")
            .trim()
            .max(255, "Full name must be at max 255 characters."),
          email: yup
            .string()
            .email("Must be a valid email.")
            .required("Email is required.")
            .trim()
            .max(100, "Email must be at max 100 characters.")
            .lowercase(),
          address: yup
            .string()
            .notRequired()
            .max(255, "Address must be at max 255 characters.")
            .trim(),
          password: yup
            .string()
            .required("Password is required.")
            .trim()
            .min(8, "Password must be at least 8 characters.")
            .max(30, "Password must be at max 30 characters."),
          gender: yup
            .string()
            .required("Gender is required.")
            .trim()
            .oneOf(["male", "female", "other", "preferNotToSay"]),
          phoneNumber: yup
            .string()
            .notRequired()
            .trim()
            .matches(/^[0-9]+$/, "Phone number must contain only digits.")
            .min(10, "Phone number must be at least 10 characters.")
            .max(20, "Phone number must be at max 20 characters."),
        })}
        onSubmit={async (values) => {
          await registerUser(values);
        }}
      >
        {(formik) => (
          <form
            onSubmit={formik.handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "1.5rem",
              width: 400,
              boxShadow: "0 0 15px 2px rgba(20, 184, 166, 0.5)", // teal glow
              padding: "1.5rem",
              borderRadius: 8,
              backgroundColor: "#1E1E1E", // dark card bg
              color: "#E0E0E0",
            }}
          >
            <Typography variant="h5" sx={{ color: "rgb(20, 184, 166)" }}>
              Register
            </Typography>

            {/* Full Name Field */}
            <FormControl fullWidth>
              <TextField
                required
                label="Full Name"
                {...formik.getFieldProps("fullName")}
                variant="filled"
                sx={{
                  backgroundColor: "#2c2c2c",
                  borderRadius: 1,
                  input: { color: "#E0E0E0" },
                  "& .MuiInputLabel-root": { color: "rgba(20, 184, 166, 0.8)" },
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
              {formik.touched.fullName && formik.errors.fullName && (
                <FormHelperText error>{formik.errors.fullName}</FormHelperText>
              )}
            </FormControl>

            {/* Email Field */}
            <FormControl fullWidth>
              <TextField
                required
                label="Email"
                {...formik.getFieldProps("email")}
                variant="filled"
                sx={{
                  backgroundColor: "#2c2c2c",
                  borderRadius: 1,
                  input: { color: "#E0E0E0" },
                  "& .MuiInputLabel-root": { color: "rgba(20, 184, 166, 0.8)" },
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
              {formik.touched.email && formik.errors.email && (
                <FormHelperText error>{formik.errors.email}</FormHelperText>
              )}
            </FormControl>

            {/* Password Field with visibility toggle */}
            <FormControl fullWidth>
              <TextField
                required
                label="Password"
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("password")}
                variant="filled"
                sx={{
                  backgroundColor: "#2c2c2c",
                  borderRadius: 1,
                  input: { color: "#E0E0E0" },
                  "& .MuiInputLabel-root": { color: "rgba(20, 184, 166, 0.8)" },
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: "rgba(20, 184, 166, 0.8)" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {formik.touched.password && formik.errors.password && (
                <FormHelperText error>{formik.errors.password}</FormHelperText>
              )}
            </FormControl>

            {/* Address Field */}
            <FormControl fullWidth>
              <TextField
                label="Address"
                {...formik.getFieldProps("address")}
                variant="filled"
                sx={{
                  backgroundColor: "#2c2c2c",
                  borderRadius: 1,
                  input: { color: "#E0E0E0" },
                  "& .MuiInputLabel-root": { color: "rgba(20, 184, 166, 0.8)" },
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
              {formik.touched.address && formik.errors.address && (
                <FormHelperText error>{formik.errors.address}</FormHelperText>
              )}
            </FormControl>

            {/* Phone Number Field */}
            <FormControl fullWidth>
              <TextField
                label="Phone Number"
                {...formik.getFieldProps("phoneNumber")}
                variant="filled"
                sx={{
                  backgroundColor: "#2c2c2c",
                  borderRadius: 1,
                  input: { color: "#E0E0E0" },
                  "& .MuiInputLabel-root": { color: "rgba(20, 184, 166, 0.8)" },
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
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <FormHelperText error>
                  {formik.errors.phoneNumber}
                </FormHelperText>
              )}
            </FormControl>

            {/* Gender Dropdown */}
            <FormControl fullWidth variant="filled">
              <InputLabel
                required
                sx={{ color: "rgba(20, 184, 166, 0.8)" }}
                id="gender-label"
              >
                Gender
              </InputLabel>
              <Select
                labelId="gender-label"
                required
                label="Gender"
                {...formik.getFieldProps("gender")}
                sx={{
                  backgroundColor: "#2c2c2c",
                  color: "#E0E0E0",
                  "& .MuiSelect-icon": { color: "rgba(20, 184, 166, 0.8)" },
                  "&:before": { borderBottomColor: "#555" },
                  "&:after": { borderBottomColor: "rgb(20, 184, 166)" },
                }}
              >
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
                <MenuItem value={"other"}>Other</MenuItem>
                <MenuItem value={"preferNotToSay"}>Prefer Not To Say</MenuItem>
              </Select>
              {formik.touched.gender && formik.errors.gender && (
                <FormHelperText error>{formik.errors.gender}</FormHelperText>
              )}
            </FormControl>

            {/* Submit Button and Link */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                width: "100%",
              }}
            >
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "rgb(20, 184, 166)",
                  color: "#121212",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "rgba(20, 184, 166, 0.8)",
                  },
                }}
                type="submit"
              >
                Submit
              </Button>

              <Link
                to="/Getstarted"
                style={{
                  color: "rgba(255, 69, 0, 0.85)", // orangered variant
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Already registered? Login
              </Link>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
