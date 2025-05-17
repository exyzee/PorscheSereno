import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MailIcon from '@mui/icons-material/Mail';
import MapIcon from '@mui/icons-material/Map';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon sx={{ fontSize: 28, color: '#181D2F' }} />, path: '/' },
  { text: 'Music', icon: <MusicNoteIcon sx={{ fontSize: 28, color: '#181D2F' }} />, path: '/music' },
  { text: 'Mail', icon: <MailIcon sx={{ fontSize: 28, color: '#181D2F' }} />, path: '/mail' },
  { text: 'Maps', icon: <MapIcon sx={{ fontSize: 28, color: '#181D2F' }} />, path: '/maps' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ 
      width: 240,
      bgcolor: '#fff',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#181D2F' }}>
          Sereno
        </Typography>
      </Box>
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              bgcolor: location.pathname === item.path ? 'rgba(0,0,0,0.05)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
