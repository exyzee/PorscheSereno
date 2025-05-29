import { Box, Typography, Button, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import DirectionsIcon from '@mui/icons-material/Directions';
import EvStationIcon from '@mui/icons-material/EvStation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SpeedIcon from '@mui/icons-material/Speed';
import { keyframes } from '@mui/material/styles';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const PopupContainer = styled(Box)({
  padding: '16px',
  minWidth: '280px',
  background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.95), rgba(68, 34, 34, 0.95))',
  backdropFilter: 'blur(12px)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  animation: `${fadeIn} 0.3s ease-out`,
  color: '#fff',
});

const StationHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px',
  gap: '8px',
});

const StationIcon = styled(EvStationIcon)({
  color: '#4caf50',
  animation: `${pulse} 2s infinite`,
});

const StationInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '16px',
});

const InfoRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: 'rgba(255, 255, 255, 0.8)',
});

const StatusChip = styled(Chip)({
  backgroundColor: 'rgba(76, 175, 80, 0.2)',
  color: '#4caf50',
  border: '1px solid rgba(76, 175, 80, 0.3)',
  '& .MuiChip-label': {
    fontWeight: 500,
  },
});

interface ChargingStation {
  id: string;
  name: string;
  coordinates: [number, number];
  availableSpots: number;
  totalSpots: number;
  power: string;
  distance: string;
  estimatedTime: string;
  address: string;
}

interface ChargingStationPopupProps {
  station: ChargingStation;
  onNavigate: () => void;
}

const ChargingStationPopup = ({ station, onNavigate }: ChargingStationPopupProps) => {
  return (
    <PopupContainer>
      <StationHeader>
        <StationIcon />
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          background: 'linear-gradient(45deg, #fff, rgba(255, 255, 255, 0.8))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {station.name}
        </Typography>
      </StationHeader>

      <StationInfo>
        <InfoRow>
          <LocationOnIcon sx={{ color: '#4caf50', fontSize: '1.1rem' }} />
          <Typography variant="body2">{station.address}</Typography>
        </InfoRow>

        <InfoRow>
          <EvStationIcon sx={{ color: '#4caf50', fontSize: '1.1rem' }} />
          <Typography variant="body2">
            {station.availableSpots} of {station.totalSpots} spots available
          </Typography>
        </InfoRow>

        <InfoRow>
          <SpeedIcon sx={{ color: '#4caf50', fontSize: '1.1rem' }} />
          <Typography variant="body2">Power: {station.power}</Typography>
        </InfoRow>

        <InfoRow>
          <AccessTimeIcon sx={{ color: '#4caf50', fontSize: '1.1rem' }} />
          <Typography variant="body2">Est. time: {station.estimatedTime}</Typography>
        </InfoRow>
      </StationInfo>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <StatusChip 
          label={`${station.availableSpots} spots available`}
          size="small"
        />
        <Button
          variant="contained"
          startIcon={<DirectionsIcon />}
          onClick={onNavigate}
          sx={{
            bgcolor: '#4caf50',
            color: '#fff',
            textTransform: 'none',
            borderRadius: '8px',
            px: 2,
            '&:hover': {
              bgcolor: '#43a047',
            },
          }}
        >
          Navigate
        </Button>
      </Box>
    </PopupContainer>
  );
};

export default ChargingStationPopup; 