import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getActivityDetail } from "../services/api";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  Typography,
  CircularProgress,
  Fade
} from "@mui/material";

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);

  const passedActivity = location.state?.activity;
  const [activity, setActivity] = useState(passedActivity || null);
  const [loadingAI, setLoadingAI] = useState(!activity?.recommendation);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await getActivityDetail(id, token);
        setActivity((prev) => ({
          ...prev,
          ...response.data,
          duration: prev?.duration || response.data.duration,
          caloriesBurned: prev?.caloriesBurned || response.data.caloriesBurned,
        }));
      } catch (error) {
        console.error("Failed to fetch activity recommendation:", error);
      } finally {
        setLoadingAI(false);
      }
    };

    if (token) {
      fetchRecommendation();
    }
  }, [id, token]);

  if (!activity) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#F0EDE5' }} />
      </Box>
    );
  }

  const createdAt = activity.createdAt ? new Date(activity.createdAt) : null;

  return (
    <Fade in={true} timeout={500}>
      <Stack spacing={4} sx={{ maxWidth: 960, mx: "auto", mt: 4, px: 2, pb: 6 }}>
        
        {/* TOP OVERVIEW CARD */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            backgroundColor: "rgba(240, 237, 229, 0.03)", // Very subtle off-white tint
            border: "1px solid rgba(240, 237, 229, 0.2)", // Off-white border
          }}
        >
          <Stack spacing={4}>
            {/* Header Section */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
              <Stack spacing={0.5}>
                <Typography variant="overline" sx={{ fontFamily: "'Outfit', sans-serif", color: "rgba(240, 237, 229, 0.7)", letterSpacing: 2, fontWeight: 600 }}>
                  Activity Overview
                </Typography>
                <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, textTransform: "capitalize", color: '#F0EDE5' }}>
                  {activity.type?.toLowerCase() || "Fitness Session"}
                </Typography>
              </Stack>
              
              <Stack alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1}>
                <ButtonLike onClick={() => navigate(-1)}>
                  ← Back to stream
                </ButtonLike>
                {createdAt && (
                  <Typography variant="caption" sx={{ fontFamily: "'Saira', sans-serif", color: "rgba(240, 237, 229, 0.6)", mt: 1 }}>
                    Logged {createdAt.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </Typography>
                )}
              </Stack>
            </Stack>

            {/* Metrics Grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <MetricCard 
                  label="Duration" 
                  value={activity.duration} 
                  suffix="min" 
                  description="Total time spent in this session" 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MetricCard 
                  label="Calories" 
                  value={activity.caloriesBurned} 
                  suffix="kcal" 
                  description="Energy expended during activity" 
                />
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        {/* AI INSIGHTS CARD */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            backgroundColor: "rgba(240, 237, 229, 0.03)",
            border: "1px solid rgba(240, 237, 229, 0.2)",
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h4" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "#F0EDE5" }}>
                AI Insights
              </Typography>
              {loadingAI && <CircularProgress size={20} sx={{ color: '#F0EDE5' }} />}
            </Stack>

            {loadingAI ? (
              <Typography variant="body1" sx={{ fontFamily: "'Saira', sans-serif", color: "rgba(240, 237, 229, 0.6)", fontStyle: "italic" }}>
                Analyzing your session and generating personalized recommendations...
              </Typography>
            ) : (
              <>
                {activity.recommendation && (
                  <Box sx={{ background: 'rgba(240, 237, 229, 0.05)', p: 3, borderRadius: 1, borderLeft: '4px solid #F0EDE5' }}>
                    <Typography variant="body1" sx={{ fontFamily: "'Saira', sans-serif", color: "#F0EDE5", whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                      {activity.recommendation}
                    </Typography>
                  </Box>
                )}

                <Grid container spacing={4}>
                  {activity.improvements?.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <InsightSection title="Areas for Improvement" items={activity.improvements} />
                    </Grid>
                  )}
                  {activity.suggestions?.length > 0 && (
                    <Grid item xs={12} md={6}>
                      <InsightSection title="Next Steps" items={activity.suggestions} />
                    </Grid>
                  )}
                  {activity.safety?.length > 0 && (
                    <Grid item xs={12}>
                      <InsightSection title="Safety Guidelines" items={activity.safety} />
                    </Grid>
                  )}
                </Grid>
              </>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Fade>
  );
};

// --- Reusable Sub-Components ---

const InsightSection = ({ title, items }) => (
  <Stack spacing={2}>
    <Typography variant="h6" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: "#F0EDE5", textTransform: "uppercase", letterSpacing: 1 }}>
      {title}
    </Typography>
    <Stack component="ul" spacing={1.5} sx={{ listStyle: "none", p: 0, m: 0 }}>
      {items.map((item, index) => (
        <Typography key={index} component="li" variant="body1" sx={{ fontFamily: "'Saira', sans-serif", color: "rgba(240, 237, 229, 0.8)", display: 'flex', gap: 1.5, lineHeight: 1.6 }}>
          <Box component="span" sx={{ color: '#F0EDE5', fontWeight: 'bold' }}>•</Box> 
          {item}
        </Typography>
      ))}
    </Stack>
  </Stack>
);

const ButtonLike = ({ onClick, children }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      appearance: "none",
      border: "1px solid rgba(240, 237, 229, 0.3)",
      borderRadius: 1,
      background: "transparent",
      color: "#F0EDE5",
      fontFamily: "'Saira', sans-serif",
      textTransform: "uppercase",
      letterSpacing: 1,
      fontWeight: 600,
      cursor: "pointer",
      px: 3,
      py: 1.25,
      transition: "all 0.2s ease",
      ":hover": {
        background: "rgba(240, 237, 229, 0.1)",
        transform: "translateY(-2px)"
      },
    }}
  >
    {children}
  </Box>
);

const MetricCard = ({ label, value, suffix, description }) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      background: "rgba(240, 237, 229, 0.05)", // Light transparent off-white
      border: "1px solid rgba(240, 237, 229, 0.1)",
      borderRadius: 1,
      transition: "transform 0.2s ease",
      ":hover": { transform: "translateY(-2px)", background: "rgba(240, 237, 229, 0.08)" }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="overline" sx={{ fontFamily: "'Outfit', sans-serif", color: "rgba(240, 237, 229, 0.7)", letterSpacing: 1.5, fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography variant="h2" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#F0EDE5', display: "flex", alignItems: "baseline", gap: 1 }}>
          {value ?? "--"}
          {suffix && (
            <Typography component="span" variant="h5" sx={{ fontFamily: "'Saira', sans-serif", color: "rgba(240, 237, 229, 0.7)", fontWeight: 600 }}>
              {suffix}
            </Typography>
          )}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ fontFamily: "'Saira', sans-serif", color: "rgba(240, 237, 229, 0.6)", mt: 1 }}>
            {description}
          </Typography>
        )}
      </Stack>
    </CardContent>
  </Card>
);

export default ActivityDetail;