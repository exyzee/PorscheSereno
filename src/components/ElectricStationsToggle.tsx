import { useState } from 'react';
import { IconButton, Box, Fade } from '@mui/material';
import EvStationIcon from '@mui/icons-material/EvStation';
import { keyframes } from '@mui/material/styles';

const pulseKeyframes = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

interface ElectricStationsToggleProps {
  onToggle: (isActive: boolean) => void;
}

const ElectricStationsToggle = ({ onToggle }: ElectricStationsToggleProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
    onToggle(!isActive);
  };

  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={handleToggle}
          sx={{
            backgroundColor: isActive 
              ? 'rgba(76, 175, 80, 0.95)' 
              : 'rgba(38, 20, 23, 0.92)',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: isActive
              ? '0 4px 24px rgba(76, 175, 80, 0.3)'
              : '0 4px 24px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: isActive 
                ? 'rgba(76, 175, 80, 0.98)' 
                : 'rgba(38, 20, 23, 0.95)',
            },
          }}
        >
          <EvStationIcon 
            sx={{
              fontSize: '1.5rem',
              animation: isActive 
                ? `${pulseKeyframes} 2s ease-in-out infinite` 
                : 'none',
              filter: isActive 
                ? 'drop-shadow(0 0 8px rgba(76, 175, 80, 0.5))'
                : 'none',
            }}
          />
        </IconButton>
      </Box>
    </Fade>
  );
};

export default ElectricStationsToggle; 