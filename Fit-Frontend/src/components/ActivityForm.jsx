import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Paper, Grid } from '@mui/material';
import { addActivity } from '../services/api';

const ActivityForm = ({ onActivityAdded }) => {
  // Grab the token from Redux to authorize the POST request
  const token = useSelector((state) => state.auth.token);

  const [activity, setActivity] = useState({
    type: "RUNNING",
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {}
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pass the token along with the activity data
      await addActivity(activity, token);
      onActivityAdded();
      // Reset form on success
      setActivity({ type: "RUNNING", duration: '', caloriesBurned: '', additionalMetrics: {} });
    } catch (error) {
      console.error("Error adding activity:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reusable style object for inputs to match the dark theme
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      color: '#F0EDE5',
      fontFamily: "'Saira', sans-serif",
      '& fieldset': { borderColor: 'rgba(240, 237, 229, 0.3)' },
      '&:hover fieldset': { borderColor: 'rgba(240, 237, 229, 0.6)' },
      '&.Mui-focused fieldset': { borderColor: '#F0EDE5' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(240, 237, 229, 0.7)', fontFamily: "'Saira', sans-serif" },
    '& .MuiInputLabel-root.Mui-focused': { color: '#F0EDE5' },
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 3, md: 4 }, 
        mb: 4, 
        borderRadius: 2, 
        backgroundColor: "rgba(240, 237, 229, 0.03)", 
        border: "1px solid rgba(240, 237, 229, 0.2)" 
      }}
    >
      <Typography variant="h5" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "#F0EDE5", mb: 3, textTransform: "uppercase", letterSpacing: 1 }}>
        Log New Activity
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 3, ...inputStyles }}>
          <InputLabel id="activity-type-label">Activity Type</InputLabel>
          <Select
            labelId="activity-type-label"
            value={activity.type}
            label="Activity Type"
            onChange={(e) => setActivity({ ...activity, type: e.target.value })}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: '#004643',
                  color: '#F0EDE5',
                  border: '1px solid rgba(240, 237, 229, 0.2)',
                }
              }
            }}
          >
            <MenuItem value="RUNNING">Running</MenuItem>
            <MenuItem value="WALKING">Walking</MenuItem>
            <MenuItem value="CYCLING">Cycling</MenuItem>
          </Select>
        </FormControl>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth
              label="Duration (Minutes)"
              type="number"
              required
              value={activity.duration}
              onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
              sx={inputStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth
              label="Calories Burned"
              type="number"
              required
              value={activity.caloriesBurned}
              onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
              sx={inputStyles}
            />
          </Grid>
        </Grid>

        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
          fullWidth
          sx={{
            backgroundColor: "#F0EDE5",
            color: "#004643",
            fontFamily: "'Saira', sans-serif",
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 700,
            borderRadius: 1,
            textTransform: "uppercase",
            letterSpacing: 1,
            "&:hover": { backgroundColor: "#dcd9d1", transform: "translateY(-2px)" },
            "&:disabled": { backgroundColor: "rgba(240, 237, 229, 0.3)", color: "rgba(0, 70, 67, 0.5)" },
            transition: "all 0.2s ease-in-out"
          }}
        >
          {loading ? "Saving..." : "Add Activity"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ActivityForm;