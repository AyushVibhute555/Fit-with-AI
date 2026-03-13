import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Grid, CardContent, Typography, Box, Stack, Divider, CircularProgress, Fade } from '@mui/material';

// Icons for a premium feel (Make sure @mui/icons-material is installed)
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { getActivities } from '../services/api';

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  // Grab the token from Redux to authorize the GET request
  const token = useSelector((state) => state.auth.token);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      // Pass the token to the API call
      const response = await getActivities(token);
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchActivities();
    }
  }, [token]);

  // Helper to pick the right icon based on activity type
  const getActivityIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'RUNNING': return <DirectionsRunIcon fontSize="large" sx={{ color: '#F0EDE5' }} />;
      case 'WALKING': return <DirectionsWalkIcon fontSize="large" sx={{ color: '#F0EDE5' }} />;
      case 'CYCLING': return <DirectionsBikeIcon fontSize="large" sx={{ color: '#F0EDE5' }} />;
      default: return <FitnessCenterIcon fontSize="large" sx={{ color: '#F0EDE5' }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress sx={{ color: '#F0EDE5' }} />
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8, p: 4, border: '1px dashed rgba(240, 237, 229, 0.3)', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", color: 'rgba(240, 237, 229, 0.7)' }}>
          No activities logged yet. Start your journey above!
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <Grid container spacing={3}>
        {activities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <Card 
              elevation={0}
              // CRITICAL FIX: Pass the activity state here so the Details page has instant data!
              onClick={() => navigate(`/activities/${activity.id}`, { state: { activity } })}
              sx={{ 
                cursor: 'pointer', 
                height: '100%',
                backgroundColor: "rgba(240, 237, 229, 0.03)", 
                border: "1px solid rgba(240, 237, 229, 0.1)",
                borderRadius: 2,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-6px)",
                  backgroundColor: "rgba(240, 237, 229, 0.08)",
                  borderColor: "rgba(240, 237, 229, 0.3)",
                  boxShadow: "0 12px 24px -10px rgba(0,0,0,0.4)"
                }
              }}
            >
              <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                <Stack spacing={2.5}>
                  
                  {/* Top: Icon and Title */}
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, backgroundColor: "rgba(240, 237, 229, 0.1)", borderRadius: 2, display: 'flex' }}>
                      {getActivityIcon(activity.type)}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#F0EDE5', textTransform: 'capitalize' }}>
                        {activity.type?.toLowerCase() || "Workout"}
                      </Typography>
                      {activity.createdAt && (
                         <Typography variant="caption" sx={{ fontFamily: "'Saira', sans-serif", color: 'rgba(240, 237, 229, 0.5)' }}>
                           {new Date(activity.createdAt).toLocaleDateString()}
                         </Typography>
                      )}
                    </Box>
                    <ArrowForwardIosIcon sx={{ color: 'rgba(240, 237, 229, 0.3)', fontSize: 16 }} />
                  </Stack>

                  <Divider sx={{ borderColor: 'rgba(240, 237, 229, 0.1)' }} />

                  {/* Bottom: Metrics */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AccessTimeIcon sx={{ color: 'rgba(240, 237, 229, 0.6)', fontSize: 20 }} />
                      <Typography variant="body1" sx={{ fontFamily: "'Saira', sans-serif", color: '#F0EDE5', fontWeight: 600 }}>
                        {activity.duration} <span style={{ fontSize: '0.8em', color: 'rgba(240, 237, 229, 0.6)' }}>min</span>
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={1}>
                      <LocalFireDepartmentIcon sx={{ color: 'rgba(240, 237, 229, 0.6)', fontSize: 20 }} />
                      <Typography variant="body1" sx={{ fontFamily: "'Saira', sans-serif", color: '#F0EDE5', fontWeight: 600 }}>
                        {activity.caloriesBurned} <span style={{ fontSize: '0.8em', color: 'rgba(240, 237, 229, 0.6)' }}>kcal</span>
                      </Typography>
                    </Stack>
                  </Stack>

                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Fade>
  );
}

export default ActivityList;