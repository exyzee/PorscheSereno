import React from 'react';
import { Box } from '@mui/material';
import dashboardWallpaper from '../assets/dashboard-wallpaper.jpg';
import SidebarIcons from '../components/SidebarIcons';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <Box
    sx={{
      width: 1024,
      height: 420,
      borderRadius: 8,
      boxShadow: '0 8px 40px 0 rgba(24,29,47,0.25)',
      border: '2px solid #fff',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'stretch',
      backgroundImage: `url(${dashboardWallpaper})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      fontFamily: 'SF Pro, San Francisco, Segoe UI, Roboto, Arial, sans-serif',
    }}
  >
    {/* Sidebar inside the main container */}
    <Box
      sx={{
        width: 96,
        minWidth: 96,
        height: '100%',
        background: 'rgba(24, 29, 47, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        gap: 2,
        borderTopLeftRadius: 24,
        borderBottomLeftRadius: 24,
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: 0,
          margin: 0,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <SidebarIcons />
      </Box>
    </Box>
    {/* Main content area */}
    <Box sx={{ flex: 1, height: '100%', p: 2, overflow: 'hidden' }}>
      {children}
    </Box>
  </Box>
);

export default DashboardLayout;
