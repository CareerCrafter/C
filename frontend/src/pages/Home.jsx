import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "10px",
          overflow: "hidden",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1470&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 0,
          },
        }}
      >
        <Card
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: 3,
            borderRadius: 3,
            maxWidth: "600px",
            position: "relative",
            zIndex: 1,
            border: "1px solid rgba(20, 184, 166, 0.3)",
            boxShadow: "0 0 20px rgba(20, 184, 166, 0.2)",
          }}
        >
          <CardContent>
            <Typography
              variant="h3"
              sx={{
                color: "#14b8a6",
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                mb: 2,
              }}
            >
              Track Your Expenses Smartly
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#e0e0e0",
                marginTop: 1,
                marginBottom: 3,
                fontSize: { xs: "1rem", md: "1.2rem" },
              }}
            >
              Manage your finances efficiently with our AI-powered tracking
              system. Visualize spending, predict future expenses, and take
              control of your financial life.
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}
            >
              <Button
                component={Link}
                to="/getStarted"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#14b8a6",
                  color: "#121212",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(20, 184, 166, 0.8)",
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Why Choose Our System Section */}
      <Box
        sx={{
          textAlign: "center",
          padding: "80px 20px",
          backgroundColor: "#121212",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#14b8a6", mb: 4 }}
        >
          Why Choose Our System?
        </Typography>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ marginTop: 3 }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: "#1e1e1e",
                padding: 3,
                borderRadius: 2,
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                color: "#e0e0e0",
                height: "100%",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.3)",
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "rgba(20, 184, 166, 0.1)",
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "2rem",
                  color: "#14b8a6",
                }}
              >
                🔍
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#14b8a6", mb: 2 }}
              >
                AI-Based Tracking
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                Our intelligent system automatically categorizes your expenses,
                identifies patterns, and helps you understand where your money
                goes without manual input.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: "#1e1e1e",
                padding: 3,
                borderRadius: 2,
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                color: "#e0e0e0",
                height: "100%",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.3)",
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "rgba(20, 184, 166, 0.1)",
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "2rem",
                  color: "#14b8a6",
                }}
              >
                📊
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#14b8a6", mb: 2 }}
              >
                Real-Time Analytics
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                Visualize your spending with interactive charts and graphs. Get
                insights into your financial habits and make informed decisions
                based on comprehensive data analysis.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: "#1e1e1e",
                padding: 3,
                borderRadius: 2,
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                color: "#e0e0e0",
                height: "100%",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.3)",
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: "rgba(20, 184, 166, 0.1)",
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "2rem",
                  color: "#14b8a6",
                }}
              >
                🔒
              </Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#14b8a6", mb: 2 }}
              >
                Secure & Private
              </Typography>
              <Typography variant="body1" sx={{ marginTop: 1 }}>
                Your financial data is encrypted and protected with
                industry-standard security measures. We prioritize your privacy
                and ensure your sensitive information remains confidential.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
