import React from 'react';
import { Box } from '@mui/material';

interface SmartRouteAssistantProps {
  route?: number[][] | null;
}

const SmartRouteAssistant: React.FC<SmartRouteAssistantProps> = ({ route }) => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Route visualization will be implemented later */}
    </Box>
  );
};

export default SmartRouteAssistant; 