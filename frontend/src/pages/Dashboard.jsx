"use client";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";
import {
  BarChart,
  CloudUpload,
  Home,
  LogOut,
  Menu,
  Settings,
  Wand,
} from "lucide-react";
import toast from "react-hot-toast";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#14b8a6" },
    secondary: { main: "#a5f3fc" },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
          },
        },
      },
    },
  },
});

const featureCards = [
  {
    title: "Upload Bills and Manage Expenses",
    description:
      "Upload bills from your Google Drive. Add expenses manually, categorize them, and keep track of all your spending in one place.",
    icon: <CloudUpload />,
    action: "Start Now",
    path: "/expense",
  },
  {
    title: "Analytics",
    description:
      "Get insights into your spending habits with detailed charts and future expense predictions.",
    icon: <BarChart />,
    action: "View Analytics",
    path: "/visualize",
  },
  {
    title: "Future Expense Prediction",
    description:
      "Get AI-driven predictions for your expenses over the next three months based on past spending trends.",
    icon: <Wand />,
    action: "Predict Expenses",
    path: "/prediction",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to access the dashboard");
        navigate("/");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded); // ✅ DEBUG LINE

        const fullName = decoded.fullName || decoded.name || decoded.email;
        setUser({ email: decoded.email, fullName });
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("accessToken");
        navigate("/");
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Animation effect
    const handleScroll = () => {
      const cards = document.querySelectorAll(".feature-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const isInViewport =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth;

        if (isInViewport) {
          card.style.opacity = 1;
          card.style.transform = "translateY(0)";
        }
      });
    };

    const cards = document.querySelectorAll(".feature-card");
    cards.forEach((card) => {
      card.style.opacity = 0;
      card.style.transform = "translateY(20px)";
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });

    setTimeout(handleScroll, 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    toast.success("Logged out successfully", { duration: 3000 });
    navigate("/getStarted");
  };
  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5">Loading dashboard...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, position: "relative", minHeight: "100vh" }}>
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.12)" }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: "#14b8a6", fontWeight: "bold" }}
            >
              Expense Tracker
            </Typography>
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              <Button
                color="inherit"
                startIcon={<Home size={18} />}
                onClick={() => navigate("/")}
              >
                Home
              </Button>
              <Button
                color="inherit"
                startIcon={<Settings size={18} />}
                onClick={() => navigate("/services")}
              >
                Services
              </Button>
              <Button
                color="primary"
                variant="contained"
                sx={{ bgcolor: "#14b8a6" }}
              >
                Dashboard
              </Button>
              <Button
                color="error"
                startIcon={<LogOut size={18} />}
                onClick={handleLogout}
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
            </Box>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <Menu />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
          <Typography variant="h3" component="h1" align="center" gutterBottom>
            Dashboard
          </Typography>

          {user && (
            <Typography
              variant="body1"
              align="center"
              sx={{ mb: 6, color: "text.secondary" }}
            >
              Welcome back,{" "}
              <Box
                component="span"
                sx={{ color: "#14b8a6", fontWeight: "bold" }}
              >
                {user.fullName || user.email}
              </Box>
            </Typography>
          )}

          <Grid container spacing={4}>
            {featureCards.map((card, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  className="feature-card"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: "background.paper",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(20, 184, 166, 0.1)",
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        mb: 3,
                        color: "#14b8a6",
                      }}
                    >
                      {card.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        bgcolor: "#14b8a6",
                        "&:hover": { bgcolor: "#0d9488" },
                      }}
                      onClick={() => navigate(card.path)}
                    >
                      {card.action}
                      <Box component="span" sx={{ ml: 1 }}>
                        →
                      </Box>
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Decorative Blurs */}
        <Box
          sx={{
            position: "absolute",
            top: "80px",
            left: "5%",
            width: "128px",
            height: "128px",
            borderRadius: "50%",
            bgcolor: "rgba(20, 184, 166, 0.2)",
            filter: "blur(32px)",
            zIndex: -1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "40px",
            right: "5%",
            width: "192px",
            height: "192px",
            borderRadius: "50%",
            bgcolor: "rgba(165, 243, 252, 0.2)",
            filter: "blur(48px)",
            zIndex: -1,
          }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
