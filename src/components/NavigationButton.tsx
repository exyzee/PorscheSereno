import React from 'react';
import { IconButton } from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';

interface NavigationButtonProps {
  onClick: () => void;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ onClick }) => (
  <IconButton 
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: 16,
      right: 16,
      bgcolor: 'rgba(255, 59, 48, 0.85)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      '&:hover': {
        bgcolor: 'rgba(255, 59, 48, 0.95)',
        transform: 'scale(1.05)',
        transition: 'all 0.2s ease-in-out',
      },
      zIndex: 1000,
      width: 40,
      height: 40,
      borderRadius: '50%',
    }}
  >
    <DirectionsIcon sx={{ color: '#fff', fontSize: '1.2rem' }} />
  </IconButton>
);

export default NavigationButton; 