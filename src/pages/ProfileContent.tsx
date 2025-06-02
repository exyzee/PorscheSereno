import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Avatar, IconButton, Fade, Grid, Switch } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import { keyframes } from '@mui/material/styles';
import SpeedIcon from '@mui/icons-material/Speed';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrafficIcon from '@mui/icons-material/Traffic';
import appleMapsPng from '../assets/icons/apple-maps.png';
import serenoLogoPng from '../assets/icons/sereno-logo.png';
import appleMusicPng from '../assets/icons/apple-music.png';
import appleMailPng from '../assets/icons/apple-mail.png';

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  joinDate: 'January 2024',
  stats: {
    completedTasks: 128,
    savedLocations: 24,
    favoriteRoutes: 12
  },
  recentActivity: [
    { type: 'route', title: 'Morning Commute', time: '2 hours ago' },
    { type: 'location', title: 'Added Coffee Shop', time: '5 hours ago' },
    { type: 'task', title: 'Completed Daily Goals', time: 'Yesterday' }
  ],
  preferences: {
    theme: 'Dark',
    notifications: 'Enabled',
    language: 'English'
  }
};

const pulseKeyframes = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const ProfileContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [autoplayBreathing, setAutoplayBreathing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Load autoplay setting from localStorage
  useEffect(() => {
    const savedAutoplay = localStorage.getItem('autoplayBreathing');
    if (savedAutoplay !== null) {
      setAutoplayBreathing(savedAutoplay === 'true');
    }
  }, []);

  // Save autoplay setting to localStorage
  useEffect(() => {
    localStorage.setItem('autoplayBreathing', autoplayBreathing.toString());
  }, [autoplayBreathing]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, we'll just authenticate with any non-empty credentials
    if (formData.email && formData.password) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setFormData({ email: '', password: '' });
  };

  return (
    !isAuthenticated ? (
      <Fade in={true} timeout={500}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}>
          <Paper
            elevation={12}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'stretch',
              width: { xs: '95%', sm: 440, md: 720 },
              minHeight: { xs: 420, md: 340 },
              p: 0,
              background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))',
              backdropFilter: 'blur(12px)',
              borderRadius: 1,
              border: '1px solid rgba(255, 59, 48, 0.15)',
              boxShadow: '0 4px 24px rgba(255, 59, 48, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 32px rgba(255, 59, 48, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            {/* Left Side: Icon and Welcome Text */}
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: { xs: 4, md: 0 },
              px: { xs: 0, md: 5 },
              background: 'linear-gradient(135deg, rgba(255,59,48,0.13) 0%, rgba(44,44,44,0.10) 100%)',
              borderRight: { md: '1.5px solid rgba(255,255,255,0.08)' },
              borderBottom: { xs: '1.5px solid rgba(255,255,255,0.08)', md: 'none' },
              minWidth: { md: 260 },
              minHeight: { xs: 120, md: '100%' },
              textAlign: 'center',
              gap: 2,
            }}>
              <Avatar
                sx={{
                  width: 88,
                  height: 88,
                  mb: 2,
                  background: 'linear-gradient(135deg, #ff3b30 0%, #ff6b6b 100%)',
                  boxShadow: '0 4px 24px 0 rgba(255,59,48,0.18)',
                  border: '2.5px solid rgba(255,255,255,0.18)',
                  animation: `${pulseKeyframes} 2s infinite`,
                }}
              >
                <PersonIcon sx={{ fontSize: 48, color: '#fff' }} />
              </Avatar>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1, letterSpacing: 0.2 }}>
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400, fontSize: '1.08rem' }}>
                Sign in to continue to Sereno
              </Typography>
            </Box>
            {/* Right Side: Fields and Button */}
            <Box sx={{
              flex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              px: { xs: 3, md: 6 },
              py: { xs: 3, md: 0 },
              gap: 2.5,
              minWidth: { md: 320 },
            }}>
              <form onSubmit={handleLogin} style={{ width: '100%' }}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  sx={{
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,59,48,0.28)' },
                      '&.Mui-focused fieldset': { borderColor: '#ff3b30' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    fontWeight: 500,
                    fontSize: '1.05rem',
                  }}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ color: '#ff3b30', mr: 1 }} />,
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  sx={{
                    mb: 3.5,
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 2,
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,59,48,0.28)' },
                      '&.Mui-focused fieldset': { borderColor: '#ff3b30' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                    fontWeight: 500,
                    fontSize: '1.05rem',
                  }}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ color: '#ff3b30', mr: 1 }} />,
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  sx={{
                    height: 52,
                    background: 'linear-gradient(90deg, #ff3b30 0%, #ff6b6b 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    textTransform: 'none',
                    borderRadius: 3,
                    boxShadow: '0 4px 18px 0 rgba(255,59,48,0.18)',
                    letterSpacing: 0.2,
                    transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #ff3b30 0%, #ff6b6b 100%)',
                      opacity: 0.92,
                      boxShadow: '0 8px 32px 0 rgba(255,59,48,0.22)',
                      transform: 'scale(1.03)',
                    },
                    '&:active': {
                      background: 'linear-gradient(90deg, #ff3b30 0%, #ff6b6b 100%)',
                      opacity: 1,
                      transform: 'scale(0.98)',
                    },
                  }}
                >
                  Sign In
                </Button>
              </form>
            </Box>
          </Paper>
        </Box>
      </Fade>
    ) : (
      <Fade in={true} timeout={500}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          p: 0,
          overflow: 'auto',
          bgcolor: 'transparent',
          gap: 0,
          alignItems: 'center',
          justifyContent: 'flex-start',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          borderRadius: 0,
          boxShadow: 'none',
          border: 'none',
          backdropFilter: 'none',
        }}>
          {/* Profile Header */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))',
              backdropFilter: 'blur(12px)',
              borderRadius: 1,
              boxShadow: '0 4px 24px rgba(255, 59, 48, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
              mb: 3,
              width: { xs: '98%', sm: '98%', md: '98%' },
              maxWidth: 900,
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, md: 5 },
              border: '1px solid rgba(255, 59, 48, 0.15)',
              position: 'relative',
              '::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 4,
                pointerEvents: 'none',
                border: '2.5px solid rgba(255,59,48,0.13)',
              },
              mx: 'auto',
            }}
          >
            <Avatar
              src={mockUser.avatar}
              sx={{
                width: 120,
                height: 120,
                border: '3px solid rgba(255,59,48,0.25)',
                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)',
                mr: { xs: 0, md: 2 },
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700, mb: 0.5, letterSpacing: 0.2, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                {mockUser.name}
              </Typography>
              <Typography variant="body1" sx={{ color: '#e0e0e0', fontSize: '1.1rem', fontWeight: 500 }}>
                {mockUser.email}
              </Typography>
              <Typography variant="body2" sx={{ color: '#aaa', mt: 0.5 }}>
                Member since {mockUser.joinDate}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Paper sx={{ px: 2.5, py: 1.2, borderRadius: 2, background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))', color: '#fff', fontWeight: 600, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.13)', border: '1px solid rgba(255, 59, 48, 0.13)' }}>
                  <HistoryIcon sx={{ color: '#ff3b30', fontSize: 22 }} /> 1,245 km driven
                </Paper>
                <Paper sx={{ px: 2.5, py: 1.2, borderRadius: 2, background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))', color: '#fff', fontWeight: 600, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1, boxShadow: '0 1px 4px 0 rgba(0,0,0,0.13)', border: '1px solid rgba(255, 59, 48, 0.13)' }}>
                  <FavoriteIcon sx={{ color: '#ffd93d', fontSize: 22 }} /> 18 favorite places
                </Paper>
              </Box>
            </Box>
            <IconButton
              onClick={() => setIsEditing(!isEditing)}
              sx={{
                color: '#aaa',
                '&:hover': { color: '#ff3b30', bgcolor: 'rgba(255,59,48,0.07)' },
                transition: 'all 0.18s',
              }}
            >
              <EditIcon />
            </IconButton>
          </Paper>

          {/* Stats Cards Row */}
          <Grid container spacing={3} sx={{ maxWidth: 900, mx: 'auto', width: '100%', mb: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))', boxShadow: '0 1px 8px 0 rgba(0,0,0,0.13)', border: '1px solid rgba(255, 59, 48, 0.10)', display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 900, width: '100%', mx: 'auto' }}>
                <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700, mb: 0.5, letterSpacing: 0.1 }}>
                  Driving Stats
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SpeedIcon sx={{ color: '#4ecdc4', fontSize: 20 }} />
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Avg. Speed: <b>54 km/h</b></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon sx={{ color: '#ff3b30', fontSize: 20 }} />
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Total Drive Time: <b>72h 15m</b></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrafficIcon sx={{ color: '#ffd93d', fontSize: 20 }} />
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Traffic Jams Avoided: <b>34</b></Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))', boxShadow: '0 1px 8px 0 rgba(0,0,0,0.13)', border: '1px solid rgba(255, 59, 48, 0.10)', display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 900, width: '100%', mx: 'auto' }}>
                <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700, mb: 0.5, letterSpacing: 0.1 }}>
                  Favorite Locations
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: '#ff3b30', fontSize: 20 }} />
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Home: <b>123 Serenity Ave</b></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: '#4ecdc4', fontSize: 20 }} />
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Work: <b>Sereno HQ</b></Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: '#ffd93d', fontSize: 20 }} />
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Coffee Spot: <b>Beanery</b></Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))', boxShadow: '0 1px 8px 0 rgba(0,0,0,0.13)', border: '1px solid rgba(255, 59, 48, 0.10)', display: 'flex', flexDirection: 'column', gap: 1.5, maxWidth: 900, width: '100%', mx: 'auto' }}>
                <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700, mb: 0.5, letterSpacing: 0.1 }}>
                  Connected Services
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                  <img src={appleMusicPng} alt="Apple Music" style={{ width: 32, borderRadius: 8, boxShadow: '0 1px 4px #ff3b3022' }} />
                  <img src={serenoLogoPng} alt="Sereno" style={{ width: 32, borderRadius: 8, boxShadow: '0 1px 4px #ffd93d22' }} />
                  <img src={appleMailPng} alt="Apple Mail" style={{ width: 32, borderRadius: 8, boxShadow: '0 1px 4px #4ecdc422' }} />
                  <img src={appleMapsPng} alt="Apple Maps" style={{ width: 32, borderRadius: 8, boxShadow: '0 1px 4px #8882' }} />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Preferences */}
          <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))', boxShadow: '0 1px 8px 0 rgba(0,0,0,0.13)', border: '1px solid rgba(255, 59, 48, 0.10)', maxWidth: 900, width: '100%', mx: 'auto', mb: 2, mt: 1 }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700, mb: 1, letterSpacing: 0.1 }}>
              Preferences
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FavoriteIcon sx={{ color: '#ffd93d', fontSize: 20 }} />
                <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Theme: <b>Dark</b></Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ color: '#4ecdc4', fontSize: 20 }} />
                <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Notifications: <b>Enabled</b></Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ color: '#ff3b30', fontSize: 20 }} />
                <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Language: <b>English</b></Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span role="img" aria-label="breathing" style={{ fontSize: 20 }}>🧘‍♂️</span>
                <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>Autoplay Breathing: <b>{autoplayBreathing ? 'Enabled' : 'Disabled'}</b></Typography>
                <Switch
                  checked={autoplayBreathing}
                  onChange={(e) => setAutoplayBreathing(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase': {
                      '&.Mui-checked': {
                        color: '#ff3b30',
                        '& + .MuiSwitch-track': {
                          backgroundColor: '#ff3b30',
                        },
                      },
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* Activity Feed */}
          <Paper sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.13)', maxWidth: 900, width: '100%', mx: 'auto', mb: 3, mt: 1, border: '1px solid rgba(255, 59, 48, 0.10)' }}>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 2, letterSpacing: 0.1 }}>
              Activity Feed
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { icon: <SpeedIcon sx={{ color: '#4ecdc4', fontSize: 20 }} />, label: 'Reached 100km/h', time: 'Today, 09:12' },
                { icon: <FavoriteIcon sx={{ color: '#ffd93d', fontSize: 20 }} />, label: 'Added Beanery to favorites', time: 'Yesterday, 18:22' },
                { icon: <LocationOnIcon sx={{ color: '#ff3b30', fontSize: 20 }} />, label: 'Visited Sereno HQ', time: 'Yesterday, 08:10' },
                { icon: <TrafficIcon sx={{ color: '#ffd93d', fontSize: 20 }} />, label: 'Avoided heavy traffic', time: '2 days ago, 17:44' },
                { icon: <EmailIcon sx={{ color: '#4ecdc4', fontSize: 20 }} />, label: 'Received trip summary email', time: '2 days ago, 20:01' },
                { icon: <PersonIcon sx={{ color: '#ff3b30', fontSize: 20 }} />, label: 'Profile updated', time: '3 days ago, 14:33' },
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 2, background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))', boxShadow: '0 1px 4px 0 rgba(0,0,0,0.10)', transition: 'box-shadow 0.18s', '&:hover': { boxShadow: '0 4px 16px 0 rgba(255,59,48,0.13)', background: 'rgba(32,32,38,0.92)' } }}>
                  {item.icon}
                  <Box>
                    <Typography sx={{ color: '#fff', fontWeight: 600 }}>{item.label}</Typography>
                    <Typography variant="caption" sx={{ color: '#aaa' }}>{item.time}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleLogout}
            sx={{
              height: 48,
              borderColor: 'rgba(255,59,48,0.18)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.08rem',
              borderRadius: 3,
              letterSpacing: 0.1,
              mb: 2,
              background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))',
              boxShadow: '0 1px 4px 0 rgba(0,0,0,0.10)',
              transition: 'all 0.18s',
              maxWidth: 900,
              mx: 'auto',
              '&:hover': {
                borderColor: '#ff3b30',
                background: 'rgba(32,32,38,0.92)',
                color: '#ff3b30',
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Fade>
    )
  );
};

export default ProfileContent; 