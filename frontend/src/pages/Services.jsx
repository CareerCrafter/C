import React from "react";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

const Services = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: "50px 20px",
        backgroundColor: "#000000", // black background
        color: "#E0E0E0", // light text color for readability
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#14B8A6", textAlign: "center" }} // teal-ish heading color
      >
        Our Services
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 3 }}>
        {[
          {
            title: "🔍 AI-Based Expense Categorization",
            description:
              "Leverage AI to automatically categorize your expenses, making tracking effortless.",
          },
          {
            title: "📊 Real-Time Analytics",
            description:
              "Get real-time visual analytics of your spending patterns with interactive charts and graphs.",
          },
          {
            title: "🔒 Secure & Private Data Handling",
            description:
              "Your privacy is important to us. All your data is encrypted and handled with the utmost security.",
          },
          {
            title: "💡 Personalized Spending Insights",
            description:
              "Receive customized insights and suggestions to improve your spending habits.",
          },
          {
            title: "📈 Expense Forecasting",
            description:
              "Use our predictive tools to forecast your future expenses based on historical data.",
          },
          {
            title: "🔄 Automatic Bill Uploading",
            description:
              "Upload your bills easily and let the system extract relevant data using OCR technology.",
          },
        ].map(({ title, description }, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card
              sx={{
                padding: 3,
                borderRadius: 2,
                boxShadow:
                  "0 4px 8px rgba(20, 184, 166, 0.4), 0 6px 20px rgba(20, 184, 166, 0.3)", // teal shadow
                backgroundColor: "#121212", // dark card background
                color: "#E0E0E0", // card text color
                height: "100%", // equal height cards
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#14B8A6" }}
              >
                {title}
              </Typography>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ marginTop: 1, color: "#CCCCCC" }}
                >
                  {description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Services;
