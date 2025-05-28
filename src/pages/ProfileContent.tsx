import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Avatar, IconButton, Fade, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import { keyframes } from '@mui/material/styles';

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
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box sx={{
        width: '100%',
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 59, 48, 0.15)',
      }}>
        {!isAuthenticated ? (
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
                  background: 'rgba(44, 44, 44, 0.82)',
                  backdropFilter: 'blur(24px)',
                  borderRadius: 4,
                  border: '1.5px solid rgba(255,255,255,0.18)',
                  boxShadow: '0 12px 48px 0 rgba(255,59,48,0.10), 0 2px 8px rgba(0,0,0,0.18)',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'box-shadow 0.3s, border 0.3s',
                  '&:hover': {
                    boxShadow: '0 16px 64px 0 rgba(255,59,48,0.18), 0 4px 16px rgba(0,0,0,0.22)',
                    border: '1.5px solid rgba(255,59,48,0.28)',
                  },
                  '::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 4,
                    pointerEvents: 'none',
                    boxShadow: 'inset 0 1.5px 18px 0 rgba(255,255,255,0.10)',
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
              p: 3,
              gap: 3,
            }}>
              {/* Profile Header */}
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 59, 48, 0.15)',
                  boxShadow: '0 4px 24px rgba(255, 59, 48, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Avatar
                    src={mockUser.avatar}
                    sx={{
                      width: 100,
                      height: 100,
                      border: '3px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}
                  />
                  <Box sx={{ ml: 3, flex: 1 }}>
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                      {mockUser.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {mockUser.email}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                      Member since {mockUser.joinDate}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => setIsEditing(!isEditing)}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      '&:hover': { color: '#fff' },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  {Object.entries(mockUser.stats).map(([key, value]) => (
                    <Grid item xs={4} key={key}>
                      <Paper
                        sx={{
                          p: 2,
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: 2,
                          textAlign: 'center',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            background: 'rgba(255,255,255,0.08)',
                          },
                        }}
                      >
                        <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
                          {value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              {/* Recent Activity and Preferences */}
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Paper
                    elevation={6}
                    sx={{
                      p: 3,
                      background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))',
                      backdropFilter: 'blur(12px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 59, 48, 0.15)',
                      boxShadow: '0 4px 24px rgba(255, 59, 48, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
                      height: '100%',
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                      Recent Activity
                    </Typography>
                    {mockUser.recentActivity.map((activity, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                          p: 1.5,
                          borderRadius: 1,
                          background: 'rgba(255,255,255,0.05)',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateX(4px)',
                            background: 'rgba(255,255,255,0.08)',
                          },
                        }}
                      >
                        {activity.type === 'route' && <HistoryIcon sx={{ color: '#4ecdc4', mr: 1.5 }} />}
                        {activity.type === 'location' && <LocationOnIcon sx={{ color: '#ff6b6b', mr: 1.5 }} />}
                        {activity.type === 'task' && <FavoriteIcon sx={{ color: '#ffd93d', mr: 1.5 }} />}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ color: '#fff' }}>
                            {activity.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Paper>
                </Grid>

                <Grid item xs={4}>
                  <Paper
                    elevation={6}
                    sx={{
                      p: 3,
                      background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))',
                      backdropFilter: 'blur(12px)',
                      borderRadius: 3,
                      border: '1px solid rgba(255, 59, 48, 0.15)',
                      boxShadow: '0 4px 24px rgba(255, 59, 48, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
                      height: '100%',
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                      Preferences
                    </Typography>
                    {Object.entries(mockUser.preferences).map(([key, value]) => (
                      <Box
                        key={key}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                          p: 1.5,
                          borderRadius: 1,
                          background: 'rgba(255,255,255,0.05)',
                        }}
                      >
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>
                          {key}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  height: 48,
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  '&:hover': {
                    borderColor: '#ff6b6b',
                    background: 'rgba(255,107,107,0.1)',
                  },
                }}
              >
                Sign Out
              </Button>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default ProfileContent; 