import React from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouteIcon from '@mui/icons-material/Route';
import EditIcon from '@mui/icons-material/Edit';

interface RouteSummaryProps {
  from: string;
  to: string;
  onEdit: () => void;
}

const RouteSummary: React.FC<RouteSummaryProps> = ({ from, to, onEdit }) => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
      <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
        Route Summary
      </Typography>
      <IconButton size="small" onClick={onEdit} sx={{ color: '#ff3b30', p: 0.25 }}>
        <EditIcon fontSize="small" />
      </IconButton>
    </Box>
    <Paper sx={{ 
      p: 1,
      borderRadius: 1,
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
        <MyLocationIcon sx={{ color: '#ff3b30', fontSize: '0.8rem', mr: 0.5 }} />
        <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.75rem' }}>
          {from}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 0.25 }}>
        <RouteIcon sx={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.5)' }} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <LocationOnIcon sx={{ color: '#ff3b30', fontSize: '0.8rem', mr: 0.5 }} />
        <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.75rem' }}>
          {to || 'Brussels'}
        </Typography>
      </Box>
    </Paper>
  </Box>
);

export default RouteSummary; 