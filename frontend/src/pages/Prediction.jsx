"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Typography,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#14b8a6" },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

const mockPredictionData = [
  { month: "July", predicted: 1200 },
  { month: "August", predicted: 1100 },
  { month: "September", predicted: 1300 },
];

const Prediction = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate API loading
  useEffect(() => {
    setTimeout(() => {
      setData(mockPredictionData);
      setLoading(false);
    }, 1000); // Simulate loading delay
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Future Expense Prediction
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 4, color: "text.secondary" }}
        >
          Based on your recent expenses, here’s what we predict for the next 3
          months.
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Card
            sx={{
              bgcolor: "background.paper",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#a5f3fc" />
                  <YAxis stroke="#a5f3fc" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Box mt={4}>
          <Typography variant="body2" align="center" color="text.secondary">
            These are AI-simulated results. Real-time predictions will appear
            here once backend is connected.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Prediction;
