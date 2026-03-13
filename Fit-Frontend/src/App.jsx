import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AuthContext } from "react-oauth2-code-pkce";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { setCrediantials } from "./store/authSlice";

// Material UI Imports
import { Button, Box, Typography, Container, AppBar, Toolbar, Stack, Fade } from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'; 

// Components
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivitiesDetail from "./components/ActivityDetail";

// ==========================================
// 1. PREMIUM LANDING PAGE (Unauthenticated)
// ==========================================
const LandingPage = ({ onLogin }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#004643", // Deep Green
        color: "#F0EDE5", // Off-White
        textAlign: "center",
        px: 3,
      }}
    >
      <Fade in={true} timeout={1000}>
        <Stack spacing={4} alignItems="center" sx={{ maxWidth: 800 }}>
          
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FitnessCenterIcon sx={{ fontSize: 48, color: '#F0EDE5' }} />
            <Typography 
              variant="h3" 
              sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: 2 }}
            >
              FitWithAI
            </Typography>
          </Box>

          {/* Hero Tagline */}
          <Typography 
            variant="h1" 
            sx={{ 
              fontFamily: "'Outfit', sans-serif", 
              fontWeight: 900, 
              fontSize: { xs: '3rem', md: '5rem' }, 
              lineHeight: 1.1 
            }}
          >
            Elevate Your <br />
            Fitness Journey
          </Typography>

          {/* Description */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "'Saira', sans-serif", 
              color: "#F0EDE5", 
              opacity: 0.85, 
              maxWidth: 600, 
              mb: 4, 
              fontWeight: 400, 
              lineHeight: 1.6 
            }}
          >
            Track your workouts, analyze your performance, and unlock AI-powered insights designed to push you past your limits.
          </Typography>

          {/* Action Buttons */}
          {/* Action Buttons */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} width={{ xs: "100%", sm: "auto" }}>
            
            {/* REGISTER BUTTON */}
            <Button
              variant="contained"
              size="large"
              // FIX: Send Keycloak directly to the registration page!
              onClick={() => onLogin(undefined, { kc_action: 'register', prompt: 'create' })} 
              sx={{
                backgroundColor: "#F0EDE5",
                color: "#004643",
                fontFamily: "'Saira', sans-serif",
                px: 5,
                py: 1.5,
                fontSize: "1.2rem",
                fontWeight: 700,
                borderRadius: 1,
                textTransform: "uppercase",
                letterSpacing: 1,
                "&:hover": { backgroundColor: "#dcd9d1", transform: "translateY(-2px)" },
                transition: "all 0.2s ease-in-out"
              }}
            >
              Register / Start
            </Button>
            
            {/* LOGIN BUTTON */}
            <Button
              variant="outlined"
              size="large"
              // Standard login: goes to the normal ID/Password screen
              onClick={() => onLogin()} 
              sx={{
                borderColor: "#F0EDE5",
                color: "#F0EDE5",
                fontFamily: "'Saira', sans-serif",
                px: 5,
                py: 1.5,
                fontSize: "1.2rem",
                fontWeight: 600,
                borderRadius: 1,
                textTransform: "uppercase",
                letterSpacing: 1,
                borderWidth: 2,
                "&:hover": { borderColor: "#F0EDE5", backgroundColor: "rgba(240, 237, 229, 0.1)", borderWidth: 2 }
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Stack>
      </Fade>
    </Box>
  );
};

// ==========================================
// 2. AUTHENTICATED LAYOUT (Nav + Content)
// ==========================================
const AuthenticatedLayout = ({ onLogout, children }) => {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#004643" }}>
      {/* Top Navigation Bar */}
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: "#004643", borderBottom: "1px solid rgba(240, 237, 229, 0.2)" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FitnessCenterIcon sx={{ color: '#F0EDE5' }} />
              <Typography 
                variant="h6" 
                sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: 1, color: '#F0EDE5' }}
              >
                FitWithAI
              </Typography>
            </Box>
            
            <Button 
              onClick={() => onLogout()}
              sx={{ 
                fontFamily: "'Saira', sans-serif", 
                color: "#F0EDE5", 
                opacity: 0.8,
                textTransform: "uppercase", 
                fontWeight: 600, 
                letterSpacing: 1,
                "&:hover": { opacity: 1, backgroundColor: "rgba(240, 237, 229, 0.1)" } 
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

const ActivitiesPage = () => {
  return (
    <Stack spacing={4}>
      <ActivityForm onActivityAdded={() => window.location.reload()} />
      <ActivityList />
    </Stack>
  );
};

// ==========================================
// 3. MAIN APP ROUTER
// ==========================================
function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setCrediantials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <LandingPage onLogin={logIn} />
      ) : (
        <AuthenticatedLayout onLogout={logOut}>
          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivitiesDetail />} />
            <Route 
              path="/" 
              element={token ? <Navigate to="/activities" replace /> : <Navigate to="/" />}
            />
          </Routes>
        </AuthenticatedLayout>
      )}
    </Router>
  );
}

export default App;