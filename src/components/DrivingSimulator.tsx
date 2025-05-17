import React, { useEffect } from 'react';
import { Box, Typography, Slider, Paper, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SpeedIcon from '@mui/icons-material/Speed';
import TrafficIcon from '@mui/icons-material/Traffic';
import SettingsIcon from '@mui/icons-material/Settings';

interface DrivingSimulatorProps {
  onBreathingTrigger: () => void;
  onClose: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
}

const DrivingSimulator: React.FC<DrivingSimulatorProps> = ({ onBreathingTrigger, onClose, speed, setSpeed }) => {
  const [hasTriggered, setHasTriggered] = React.useState<boolean>(false);
  const trafficAhead = true; // Hardcoded for now

  useEffect(() => {
    const isSlowSpeed = speed < 10;
    const shouldTrigger = isSlowSpeed && trafficAhead && !hasTriggered;

    if (shouldTrigger) {
      onBreathingTrigger();
      setHasTriggered(true);
    }
  }, [speed, trafficAhead, hasTriggered, onBreathingTrigger]);

  return (
    <Paper
      elevation={0}
      sx={{
        width: '320px',
        borderRadius: '16px',
        background: 'rgba(38, 20, 23, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SpeedIcon sx={{ color: '#E53935' }} />
          <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 600 }}>
            Driving Simulator
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {/* Speed Control */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            Speed: {speed} km/h
          </Typography>
          <Slider
            value={speed}
            onChange={(_, newValue) => setSpeed(newValue as number)}
            min={0}
            max={50}
            step={1}
            sx={{
              color: '#E53935',
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                backgroundColor: '#fff',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 6px rgba(229, 57, 53, 0.16)',
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.3,
              },
            }}
          />
        </Box>

        {/* Conditions */}
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
            Current Conditions
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              p: 1.5,
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SpeedIcon sx={{ color: speed < 10 ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)' }} />
                <Typography
                  variant="body2"
                  sx={{ color: speed < 10 ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)' }}
                >
                  Speed below 10 km/h
                </Typography>
              </Box>
              <Typography sx={{ color: speed < 10 ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)' }}>
                {speed < 10 ? '✅' : '❌'}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrafficIcon sx={{ color: trafficAhead ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)' }} />
                <Typography
                  variant="body2"
                  sx={{ color: trafficAhead ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)' }}
                >
                  Traffic ahead
                </Typography>
              </Box>
              <Typography sx={{ color: trafficAhead ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)' }}>
                {trafficAhead ? '✅' : '❌'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default DrivingSimulator; 