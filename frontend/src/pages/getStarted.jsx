import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import toast from "react-hot-toast";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    toast.dismiss();
  }, []);

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .required("Email is required.")
      .trim()
      .lowercase(),
    password: yup.string().required("Password is required.").trim(),
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5050/user/login", values);
      localStorage.setItem("accessToken", res.data?.accessToken);
      toast.success("You are logged in successfully.");
      navigate("/Dashboard");
    } catch (error) {
      console.error("Login failed", error);
      toast.error(
        error?.response?.data?.message || "Invalid Credentials. Login failed !"
      );
    } finally {
      setLoading(false);
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
        position: "relative",
      }}
    >
      {loading && (
        <LinearProgress
          color="secondary"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 4,
            backgroundColor: "rgba(20, 184, 166, 0.2)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "rgb(20, 184, 166)",
            },
          }}
        />
      )}
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
              position: "relative",
            }}
          >
            <Typography variant="h5" sx={{ color: "rgb(20, 184, 166)" }}>
              Login
            </Typography>

            <FormControl fullWidth>
              <TextField
                label="Email"
                {...getFieldProps("email")}
                required
                variant="filled"
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
              {touched.email && errors.email && (
                <FormHelperText error sx={{ color: "#cf6679" }}>
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                {...getFieldProps("password")}
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
              {touched.password && errors.password && (
                <FormHelperText error sx={{ color: "#cf6679" }}>
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>

            <Box
              sx={{ textAlign: "center", width: "100%", position: "relative" }}
            >
              <Link
                to="/forgot-password"
                style={{
                  position: "absolute",
                  right: 0,
                  top: -20,
                  fontSize: "0.85rem",
                  color: "#90caf9",
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </Link>

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
                Submit
              </Button>

              <Link
                to="/register"
                style={{
                  color: "rgba(255, 69, 0, 0.85)",
                  textDecoration: "none",
                  marginTop: "10px",
                  display: "block",
                }}
              >
                New here? Register
              </Link>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
