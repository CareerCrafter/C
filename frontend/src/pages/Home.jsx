import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1581091870620-fd1ec7c53d1d?auto=format&fit=crop&w=1470&q=80')",

          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "10px",
        }}
      >
        <Card
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: 3,
            borderRadius: 3,
            maxWidth: "500px",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                color: "#90caf9",
                fontWeight: "bold",
                fontSize: "1rem",
              }}
            >
              Track Your Expenses Smartly
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#e0e0e0",
                marginTop: 1,
              }}
            >
              Manage your finances efficiently with AI-powered tracking system.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Why Choose Our System Section */}
      <Box
        sx={{
          textAlign: "center",
          padding: "50px 20px",
          backgroundColor: "#121212",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#90caf9" }}>
          Why Choose Our System?
        </Typography>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ marginTop: 3 }}
        >
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                backgroundColor: "#1e1e1e",
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                color: "#e0e0e0",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#90caf9" }}
              >
                🔍 AI-Based Tracking
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Automatically categorize expenses using AI.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                backgroundColor: "#1e1e1e",
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                color: "#e0e0e0",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#90caf9" }}
              >
                📊 Real-Time Analytics
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Visualize spending with interactive charts.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                backgroundColor: "#1e1e1e",
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                color: "#e0e0e0",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#90caf9" }}
              >
                🔒 Secure & Private
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Your data is encrypted and protected.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
