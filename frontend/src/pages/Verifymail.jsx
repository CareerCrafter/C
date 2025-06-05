import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Replace this with your actual API call
  const sendResetEmail = async (email) => {
    // Example with fetch, adjust URL and method as needed
    const response = await fetch(
      "https://your-backend.com/api/send-reset-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to send reset email");
    }

    return response.json(); // or whatever your backend returns
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Call your backend API here
      await sendResetEmail(email);

      toast.success("Reset password email sent!");
      setSuccess(true);

      // Optionally navigate to a "Check your mail" page:
      // navigate("/check-mail");
    } catch (err) {
      toast.error(err.message || "Failed to send reset email. Try again.");
      setSuccess(false);
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
        padding: 2,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          width: 350,
          padding: "2rem",
          backgroundColor: "#1E1E1E",
          borderRadius: 8,
          boxShadow: "0 0 15px 2px rgba(20, 184, 166, 0.4)",
        }}
      >
        <Typography variant="h5" sx={{ color: "rgb(20, 184, 166)" }}>
          Verify Your Email
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please enter your email address to receive a password reset link.
        </Typography>

        <TextField
          label="Email Address"
          variant="filled"
          required
          fullWidth
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            backgroundColor: "#2c2c2c",
            input: { color: "#E0E0E0" },
            "& .MuiInputLabel-root": { color: "rgba(20, 184, 166, 0.7)" },
          }}
          disabled={loading}
        />
        {error && (
          <FormHelperText error sx={{ color: "#cf6679" }}>
            {error}
          </FormHelperText>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "rgb(20, 184, 166)",
            color: "#121212",
            fontWeight: "bold",
            "&:hover": { backgroundColor: "rgba(20, 184, 166, 0.8)" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Send Reset Link"
          )}
        </Button>

        {success && (
          <Typography
            variant="body2"
            sx={{ color: "lightgreen", textAlign: "center", mt: 1 }}
          >
            Reset email sent! Please check your inbox.
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default VerifyEmail;
