import { useEffect, useRef, useState } from 'react';
import { Box, Paper, TextField, Button, Typography, IconButton, Collapse, Fade, Chip, Tooltip } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrafficIcon from '@mui/icons-material/Traffic';
import SpeedIcon from '@mui/icons-material/Speed';
import InfoIcon from '@mui/icons-material/Info';
import { keyframes } from '@mui/material/styles';
import BreathingWidget from '../components/BreathingWidget';
import DrivingSimulator from '../components/DrivingSimulator';
import NavigationButton from '../components/NavigationButton';
import RouteSummary from '../components/RouteSummary';
import ElectricStationsToggle from '../components/ElectricStationsToggle';
import breathingFullscrMp4 from '../../public/breathing-fullscr.mp4';
import { BreathingControls } from '../components/BreathingWidget';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

// Use environment variable for Mapbox token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiamhhYWEiLCJhIjoiY205bWw1dTN2MGV5ZDJscjd6M2w2ZWplcCJ9.iPq01-kBwTudMOv3IV9h9g';

// Initialize Mapbox with error handling
try {
  mapboxgl.accessToken = MAPBOX_TOKEN;
} catch (error) {
  console.error('Failed to initialize Mapbox:', error);
}

const BRUSSELS_COORDS: [number, number] = [4.3517, 50.8503];
const THOMAS_MORE_COORDS: [number, number] = [4.4697, 51.0285];
const GROTE_MARKT_COORDS: [number, number] = [4.4778, 51.0283];

// Add these after the existing constants
const pulseKeyframes = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

// Add breathing blob animation keyframes
const breatheBlob = keyframes`
  0% { transform: scale(1); opacity: 0.55; }
  40% { transform: scale(1.18); opacity: 0.75; }
  60% { transform: scale(1.22); opacity: 0.82; }
  100% { transform: scale(1); opacity: 0.55; }
`;

// Add at the top, after imports
const speakBreathingPhase = (phase: string) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new window.SpeechSynthesisUtterance(phase);
  utter.rate = 0.7;
  utter.pitch = 1.0;
  utter.volume = 1.0;
  utter.lang = 'en-US';
  // Try to pick a calm, natural voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('natural'));
  if (preferred) utter.voice = preferred;
  window.speechSynthesis.speak(utter);
};

// Styled components for better organization
const LocationInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder 
}: { 
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
      <LocationOnIcon sx={{ color: '#ff3b30', fontSize: '0.8rem', mr: 0.5 }} />
      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem' }}>
        {label}
      </Typography>
    </Box>
    <TextField
      fullWidth
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: <LocationOnIcon sx={{ color: '#ff3b30', mr: 0.5, fontSize: '0.8rem' }} />,
        sx: { 
          borderRadius: 1,
          height: '32px',
          fontSize: '0.75rem',
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#ff3b30',
          },
          '& input': {
            color: '#fff',
            padding: '6px 8px',
          },
        }
      }}
    />
  </Box>
);

const RouteInfo = ({ 
  duration, 
  trafficInfo, 
  onStart 
}: { 
  duration: number;
  trafficInfo: { level: 'low' | 'medium' | 'high'; description: string; bestRoute: string; } | null;
  onStart: () => void;
}) => {
  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#ff3b30';
    }
  };

  return (
    <Box sx={{ 
      px: 1.5,
      py: 1,
      background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.15), rgba(180, 0, 0, 0.15))',
      backdropFilter: 'blur(8px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <AccessTimeIcon sx={{ color: '#ff3b30', fontSize: '0.8rem', mr: 0.5 }} />
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem' }}>
          Estimated arrival
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ color: '#ff3b30', fontWeight: 600, fontSize: '0.85rem' }}>
          {duration} min
        </Typography>
        <Button 
          variant="text" 
          endIcon={<ArrowForwardIcon sx={{ fontSize: '0.8rem' }} />}
          sx={{ 
            color: '#ff3b30',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.75rem',
            minWidth: 'auto',
            p: 0.5,
            '&:hover': {
              background: 'rgba(255, 59, 48, 0.1)',
            },
          }}
          onClick={onStart}
        >
          Start
        </Button>
      </Box>
      
      {trafficInfo && (
        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <TrafficIcon sx={{ color: getTrafficColor(trafficInfo.level), fontSize: '0.8rem', mr: 0.5 }} />
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem' }}>
              Traffic Conditions
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Chip 
              label={trafficInfo.level.charAt(0).toUpperCase() + trafficInfo.level.slice(1)} 
              size="small"
              sx={{ 
                bgcolor: getTrafficColor(trafficInfo.level),
                color: '#fff',
                fontSize: '0.7rem',
                height: '20px',
                '& .MuiChip-label': { px: 1 }
              }}
            />
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', ml: 1, fontSize: '0.7rem' }}>
              {trafficInfo.description}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <SpeedIcon sx={{ color: '#ff3b30', fontSize: '0.8rem', mr: 0.5 }} />
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.7rem' }}>
              Best Route: {trafficInfo.bestRoute}
            </Typography>
            <Tooltip title="Based on current traffic patterns">
              <InfoIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', ml: 0.5, fontSize: '0.7rem' }} />
            </Tooltip>
          </Box>
        </Box>
      )}
    </Box>
  );
};

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

export const MapContent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showRouteSummary, setShowRouteSummary] = useState(false);
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [showBreathingPrompt, setShowBreathingPrompt] = useState(false);
  const [showBreathingWidget, setShowBreathingWidget] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [from, setFrom] = useState('Thomas More De Ham, Mechelen');
  const [to, setTo] = useState('');
  const [trafficDuration, setTrafficDuration] = useState(0);
  const [trafficInfo, setTrafficInfo] = useState<{
    level: 'low' | 'medium' | 'high';
    description: string;
    bestRoute: string;
  } | null>(null);
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);
  const [currentRouteCoords, setCurrentRouteCoords] = useState<number[][]>([]);
  const [trafficStartIndex, setTrafficStartIndex] = useState<number>(0);
  const navigationMarker = useRef<mapboxgl.Marker | null>(null);
  const [simSpeed, setSimSpeed] = useState(15);
  const [carIndex, setCarIndex] = useState<number | null>(null);
  const carAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const [hasTriggeredBreathing, setHasTriggeredBreathing] = useState(false);
  const carShouldMove = useRef(true);
  const [showElectricStations, setShowElectricStations] = useState(false);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const [isBreathingFullscreen, setIsBreathingFullscreen] = useState(false);
  const [fsPaused, setFsPaused] = useState(false);
  const [fsMuted, setFsMuted] = useState(false);
  const [fsVolume, setFsVolume] = useState(0.5);
  const [fsSessionTime, setFsSessionTime] = useState(0);
  const fsTimerRef = useRef<NodeJS.Timeout>();
  const fsVideoRef = useRef<HTMLVideoElement>(null);
  const [fsPhase, setFsPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const waterAudioRef = useRef<HTMLAudioElement>(null);
  const [autoplayBreathing, setAutoplayBreathing] = useState(false);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    if (mapContainer.current) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: GROTE_MARKT_COORDS,
        zoom: 16,
        attributionControl: false,
        pitch: 65,
        bearing: -30
      });
      
      // Remove the Mapbox logo
      const mapboxLogo = document.querySelector('.mapboxgl-ctrl-logo');
      if (mapboxLogo) {
        mapboxLogo.remove();
      }

      // Wait for the map to load before adding layers
      map.current?.on('load', () => {
        if (!map.current) return;
        
        // Add terrain source
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        } as mapboxgl.RasterDEMSourceSpecification);

        // Add sky layer
        map.current.addLayer({
          id: 'sky',
          type: 'sky',
          paint: {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 90.0],
            'sky-atmosphere-sun-intensity': 15,
          },
        } as mapboxgl.SkyLayerSpecification);

        // Add 3D buildings
        map.current.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 12,
          paint: {
            'fill-extrusion-color': '#242424',
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.8,
            'fill-extrusion-vertical-gradient': true,
          },
        } as mapboxgl.FillExtrusionLayerSpecification);

        // Add a source for the route
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        } as mapboxgl.GeoJSONSourceSpecification);

        // Add a layer for the route with adjusted elevation
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ff3b30',
            'line-width': 3,
            'line-opacity': 0.8,
            'line-blur': 0.5
          }
        } as mapboxgl.LineLayerSpecification);

        // Add a glowing effect layer with adjusted elevation
        map.current.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ff3b30',
            'line-width': 6,
            'line-opacity': 0.3,
            'line-blur': 1
          }
        } as mapboxgl.LineLayerSpecification);

        // Add weather and air quality data
        fetchWeatherData();
        fetchAirQualityData();
        
        // Ensure route layers are visible
        ensureRouteLayersVisible();
      });
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !showElectricStations) return;

    // Mock charging stations in Mechelen
    const mockStations = [
      {
        id: '1',
        name: 'Mechelen Centrum Charging',
        coordinates: [4.4778, 51.0283] as [number, number],
        availableSpots: 3,
        totalSpots: 5,
        power: '50 kW',
        distance: '0.2 km',
        estimatedTime: '5 min',
        address: 'Grote Markt 1, Mechelen'
      },
      {
        id: '2',
        name: 'Thomas More Charging',
        coordinates: [4.4697, 51.0285] as [number, number],
        availableSpots: 2,
        totalSpots: 4,
        power: '75 kW',
        distance: '0.5 km',
        estimatedTime: '8 min',
        address: 'Thomas More Campus, Mechelen'
      },
      {
        id: '3',
        name: 'Mechelen Station Charging',
        coordinates: [4.4812, 51.0178] as [number, number],
        availableSpots: 4,
        totalSpots: 6,
        power: '100 kW',
        distance: '0.8 km',
        estimatedTime: '10 min',
        address: 'Stationstraat 1, Mechelen'
      },
      {
        id: '4',
        name: 'Mechelen Shopping Charging',
        coordinates: [4.4723, 51.0221] as [number, number],
        availableSpots: 2,
        totalSpots: 3,
        power: '50 kW',
        distance: '0.6 km',
        estimatedTime: '7 min',
        address: 'Shopping Center, Mechelen'
      }
    ];

    // Add electric stations source
    map.current.addSource('electric-stations', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: mockStations.map(station => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: station.coordinates
          },
          properties: station
        }))
      }
    });

    // Add station markers layer
    map.current.addLayer({
      id: 'electric-stations',
      type: 'circle',
      source: 'electric-stations',
      paint: {
        'circle-radius': 8,
        'circle-color': '#4caf50',
        'circle-opacity': 0.8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff',
        'circle-stroke-opacity': 0.8
      }
    });

    // Add glow effect
    map.current.addLayer({
      id: 'electric-stations-glow',
      type: 'circle',
      source: 'electric-stations',
      paint: {
        'circle-radius': 12,
        'circle-color': '#4caf50',
        'circle-opacity': 0.3,
        'circle-blur': 1
      }
    });

    // Add click handler
    const handleClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (!e.features || !e.features[0] || !map.current) return;
      
      const feature = e.features[0];
      const station = feature.properties as ChargingStation;

      if (!station) return;

      // Create popup container with pointer-events enabled
      const popupNode = document.createElement('div');
      popupNode.className = 'charging-station-popup';
      popupNode.style.cssText = `
        background: linear-gradient(135deg, rgba(44, 44, 44, 0.95), rgba(68, 34, 34, 0.95));
        backdrop-filter: blur(12px);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        padding: 16px;
        min-width: 280px;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        animation: popupFadeIn 0.3s ease-out;
        pointer-events: auto;
        z-index: 1000;
      `;

      // Create popup content
      popupNode.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <svg class="station-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77zM12 10H6V5h6v5zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fill="#4caf50"/>
          </svg>
          <div class="station-name">${station.name}</div>
        </div>
        <div class="info-row">
          <svg class="info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4caf50"/>
          </svg>
          <span>${station.address}</span>
        </div>
        <div class="info-row">
          <svg class="info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.77 7.23l.01-.01-3.72-3.72L15 4.56l2.11 2.11c-.94.36-1.61 1.26-1.61 2.33 0 1.38 1.12 2.5 2.5 2.5.36 0 .69-.08 1-.21v7.21c0 .55-.45 1-1 1s-1-.45-1-1V14c0-1.1-.9-2-2-2h-1V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v16h10v-7.5h1.5v5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V9c0-.69-.28-1.32-.73-1.77z" fill="#4caf50"/>
          </svg>
          <span>${station.availableSpots} of ${station.totalSpots} spots available</span>
        </div>
        <div class="info-row">
          <svg class="info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5 8H12v5h4.75l-1.38-1.38c.75-1.12 1.13-2.5 1.13-3.87 0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.37 0 2.75-.38 3.87-1.13L19.75 19l1.38-1.38-7.88-7.88c.38-.75.63-1.62.63-2.5 0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c.88 0 1.75-.25 2.5-.63V13.5c-1.12.38-2.37.63-3.5.63-4.14 0-7.5-3.36-7.5-7.5S7.86 1.5 12 1.5s7.5 3.36 7.5 7.5c0 1.13-.25 2.38-.63 3.5H13.5V8z" fill="#4caf50"/>
          </svg>
          <span>Power: ${station.power}</span>
        </div>
        <div class="info-row">
          <svg class="info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#4caf50"/>
          </svg>
          <span>Est. time: ${station.estimatedTime}</span>
        </div>
        <div class="popup-footer">
          <div class="status-chip">${station.availableSpots} spots available</div>
          <button class="navigate-button" onclick="window.navigateToStation()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.43 10.59l-9.01-9.01c-.75-.75-2.07-.76-2.83 0l-9 9c-.78.78-.78 2.04 0 2.82l9 9c.39.39.9.58 1.41.58.51 0 1.02-.19 1.41-.58l8.99-8.99c.79-.76.8-2.02.03-2.82zm-10.42 10.4l-9-9 9-9 9 9-9 9z" fill="white"/>
              <path d="M8 11v4h2v-3h4v2.5l3.5-3.5L14 7.5V10H9c-.55 0-1 .45-1 1z" fill="white"/>
            </svg>
            Navigate
          </button>
        </div>
      `;

      // Add navigation function to window
      (window as any).navigateToStation = () => {
        if (map.current) {
          const start = Array.isArray(currentRouteCoords[0]) && currentRouteCoords[0].length === 2 ? [currentRouteCoords[0][0], currentRouteCoords[0][1]] as [number, number] : THOMAS_MORE_COORDS;
          const end = Array.isArray(station.coordinates) && station.coordinates.length === 2 ? [station.coordinates[0], station.coordinates[1]] as [number, number] : THOMAS_MORE_COORDS;
          fetchDirections(start, end).then(data => {
            if (data && data.routes && data.routes[0]) {
              const route = data.routes[0];
              const routeCoordinates = route.geometry.coordinates.map((coord: number[]) => 
                [coord[0], coord[1]] as [number, number]
              );
              setCurrentRouteCoords(routeCoordinates);
              setIsRouteVisible(true);
              setShowRouteSummary(true);
              setFrom('Current Location');
              setTo(station.name);
              popupRef.current?.remove();
            }
          });
        }
      };

      // Create and add popup to map with updated configuration
      popupRef.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
        maxWidth: '300px',
        focusAfterOpen: false,
        anchor: 'bottom',
        className: 'custom-popup'
      })
        .setLngLat(station.coordinates)
        .setDOMContent(popupNode)
        .addTo(map.current);

      // Add custom CSS to prevent popup from affecting other elements
      const style = document.createElement('style');
      style.textContent = `
        .custom-popup {
          pointer-events: auto !important;
          z-index: 1000 !important;
        }
        .custom-popup .mapboxgl-popup-content {
          pointer-events: auto !important;
        }
        .custom-popup .mapboxgl-popup-tip {
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);

      // Prevent event propagation
      e.preventDefault();
      (e as unknown as Event).stopPropagation?.();
    };

    // Add hover effects
    const handleMouseEnter = () => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = 'pointer';
    };

    const handleMouseLeave = () => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = '';
    };

    // Add event listeners
    map.current.on('click', 'electric-stations', handleClick);
    map.current.on('mouseenter', 'electric-stations', handleMouseEnter);
    map.current.on('mouseleave', 'electric-stations', handleMouseLeave);

    // Center the map on Mechelen
    map.current.flyTo({
      center: GROTE_MARKT_COORDS,
      zoom: 14,
      duration: 2000
    });

    return () => {
      if (map.current) {
        map.current.off('click', 'electric-stations', handleClick);
        map.current.off('mouseenter', 'electric-stations', handleMouseEnter);
        map.current.off('mouseleave', 'electric-stations', handleMouseLeave);
        if (popupRef.current) {
          popupRef.current.remove();
        }
        if (map.current.getLayer('electric-stations-glow')) {
          map.current.removeLayer('electric-stations-glow');
        }
        if (map.current.getLayer('electric-stations')) {
          map.current.removeLayer('electric-stations');
        }
        if (map.current.getSource('electric-stations')) {
          map.current.removeSource('electric-stations');
        }
      }
    };
  }, [showElectricStations, currentRouteCoords]);

  const fetchDirections = async (start: [number, number], end: [number, number]) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}&overview=full&annotations=congestion,duration`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching directions:', error);
      return null;
    }
  };

  const handleCheckTraffic = async () => {
    if (!map.current) return;

    // Use Brussels coordinates if no destination is entered
    const destinationCoords = to ? await geocodeAddress(to) : BRUSSELS_COORDS;
    if (!destinationCoords) {
      console.error('Could not find coordinates for destination');
      return;
    }

    const directionsData = await fetchDirections(THOMAS_MORE_COORDS, destinationCoords);
    if (!directionsData || !directionsData.routes || !directionsData.routes[0]) {
      console.error('No route found');
      return;
    }

    const route = directionsData.routes[0];
    const coordinates = route.geometry.coordinates;
    
    // Store the coordinates for later use
    setCurrentRouteCoords(coordinates);

    // Wait for the map style to be loaded
    if (!map.current.isStyleLoaded()) {
      await new Promise(resolve => map.current?.once('style.load', resolve));
    }

    // Remove existing layers and sources if they exist
    ['route-start', 'route-traffic', 'route-end', 'route-glow-outer', 'route-glow-middle', 'route-glow-inner'].forEach(layerId => {
      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId);
      }
    });

    ['route-start', 'route-traffic', 'route-end', 'route-glow'].forEach(sourceId => {
      if (map.current?.getSource(sourceId)) {
        map.current.removeSource(sourceId);
      }
    });

    // Analyze traffic congestion from the route data
    const congestion = route.legs[0].annotation?.congestion || [];
    const totalPoints = coordinates.length;
    const startIndex = Math.floor(totalPoints * 0.3);
    const endIndex = Math.floor(totalPoints * 0.7);
    
    // Calculate traffic level based on congestion data
    const trafficLevels = congestion.slice(startIndex, endIndex);
    const avgCongestion = trafficLevels.reduce((sum: number, level: number) => sum + level, 0) / trafficLevels.length;
    
    let trafficLevel: 'low' | 'medium' | 'high';
    let trafficDescription: string;
    let trafficDelay: number;

    if (avgCongestion <= 0.3) {
      trafficLevel = 'low';
      trafficDescription = 'Light traffic, smooth flow';
      trafficDelay = 0;
    } else if (avgCongestion <= 0.7) {
      trafficLevel = 'medium';
      trafficDescription = 'Moderate traffic, expect some delays';
      trafficDelay = Math.round(route.duration * 0.2 / 60); // 20% delay
    } else {
      trafficLevel = 'high';
      trafficDescription = 'Heavy traffic, significant delays expected';
      trafficDelay = Math.round(route.duration * 0.4 / 60); // 40% delay
    }

    // Store the traffic start index for later use
    setTrafficStartIndex(startIndex);
    setHasTriggeredBreathing(false);

    const startCoords = coordinates.slice(0, startIndex);
    const trafficCoords = coordinates.slice(startIndex, endIndex);
    const finalCoords = coordinates.slice(endIndex);

    // Add sources and layers for each segment with appropriate colors
    const segments = [
      { 
        id: 'route-start', 
        coords: startCoords, 
        color: trafficLevel === 'low' ? '#4caf50' : '#ff9800' 
      },
      { 
        id: 'route-traffic', 
        coords: trafficCoords, 
        color: trafficLevel === 'low' ? '#4caf50' : trafficLevel === 'medium' ? '#ff9800' : '#f44336' 
      },
      { 
        id: 'route-end', 
        coords: finalCoords, 
        color: trafficLevel === 'low' ? '#4caf50' : '#ff9800' 
      }
    ];

    segments.forEach(segment => {
      // Add source
      map.current?.addSource(segment.id, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: segment.coords
          }
        }
      });

      // Add line layer
      map.current?.addLayer({
        id: segment.id,
        type: 'line',
        source: segment.id,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: 'visible'
        },
        paint: {
          'line-color': segment.color,
          'line-width': 6,
          'line-opacity': 0.8
        }
      });

      // Add glow layer
      map.current?.addLayer({
        id: `${segment.id}-glow`,
        type: 'line',
        source: segment.id,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: 'visible'
        },
        paint: {
          'line-color': segment.color,
          'line-width': 12,
          'line-opacity': 0.2,
          'line-blur': 3
        }
      });
    });

    // Calculate total duration with traffic delay
    const baseTime = Math.round(route.duration / 60);
    const totalDuration = baseTime + trafficDelay;

    // Get the best route based on current conditions
    const bestRoute = trafficLevel === 'low' ? 
      'Current route is optimal' : 
      trafficLevel === 'medium' ? 
        'Consider alternative routes' : 
        'Heavy traffic, consider delaying trip';

    setTrafficInfo({
      level: trafficLevel,
      description: trafficDescription,
      bestRoute: bestRoute
    });

    setTrafficDuration(totalDuration);
    setIsRouteVisible(true);
    setShowRouteSummary(true);

    // Fit the map to show the entire route
    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach((coord: number[]) => {
      bounds.extend(coord as [number, number]);
    });
    
    map.current.fitBounds(bounds, {
      padding: 50,
      duration: 2000
    });
  };

  const ensureRouteLayersVisible = () => {
    if (!map.current) return;
    
    // Ensure all route layers are visible
    ['route-start', 'route-traffic', 'route-end'].forEach(layerId => {
      if (map.current?.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, 'visibility', 'visible');
      }
      if (map.current?.getLayer(`${layerId}-glow`)) {
        map.current.setLayoutProperty(`${layerId}-glow`, 'visibility', 'visible');
      }
    });
  };

  // Calculate bearing between two points
  const calculateBearing = (start: [number, number], end: [number, number]): number => {
    const startLng = start[0] * Math.PI / 180;
    const startLat = start[1] * Math.PI / 180;
    const endLng = end[0] * Math.PI / 180;
    const endLat = end[1] * Math.PI / 180;

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
              Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;
    return bearing;
  };

  // Car animation effect
  useEffect(() => {
    if (carIndex === null || !currentRouteCoords.length) return;
    if (!map.current || !navigationMarker.current) return;
    if (carIndex >= currentRouteCoords.length - 1) return;

    // If speed <= 10, stop car and move to red line start
    if (simSpeed <= 10 && typeof trafficStartIndex === 'number') {
      carShouldMove.current = false;
      setCarIndex(trafficStartIndex);
      // Center and zoom to the transition point (overview style)
      map.current.flyTo({
        center: currentRouteCoords[trafficStartIndex] as [number, number],
        zoom: 16,
        pitch: 65,
        bearing: -30,
        duration: 1200,
        essential: true
      });
      // Show breathing prompt if not already shown and both criteria are met
      if (!hasTriggeredBreathing && simSpeed <= 10 && trafficInfo?.level === 'high') {
        setShowBreathingPrompt(true);
        setHasTriggeredBreathing(true);
      }
      return;
    } else {
      carShouldMove.current = true;
    }

    // Only animate if carShouldMove is true
    if (!carShouldMove.current) return;

    // Calculate interval based on simSpeed (higher speed = shorter interval)
    const speed = Math.max(1, Math.min(simSpeed, 50));
    const minInterval = 80;
    const maxInterval = 1200;
    const interval = maxInterval - ((speed - 1) / 49) * (maxInterval - minInterval);

    carAnimationRef.current && clearTimeout(carAnimationRef.current);
    carAnimationRef.current = setTimeout(() => {
      setCarIndex(idx => (idx !== null && idx < currentRouteCoords.length - 1) ? idx + 1 : idx);
    }, interval);

    return () => {
      carAnimationRef.current && clearTimeout(carAnimationRef.current);
    };
  }, [carIndex, simSpeed, currentRouteCoords, trafficStartIndex, hasTriggeredBreathing]);

  // Update car marker position and rotation as carIndex changes
  useEffect(() => {
    if (carIndex === null || !currentRouteCoords.length) return;
    if (!map.current || !navigationMarker.current) return;
    if (carIndex >= currentRouteCoords.length - 1) return;
    const currentPoint = currentRouteCoords[carIndex] as [number, number];
    const nextPoint = currentRouteCoords[carIndex + 1] as [number, number];
    const bearing = calculateBearing(currentPoint, nextPoint);
    navigationMarker.current.setLngLat(currentPoint);
    const carElement = navigationMarker.current.getElement();
    carElement.style.transform = `rotate(${bearing}deg)`;
  }, [carIndex, currentRouteCoords]);

  // Start navigation: place car and start animation
  const handleStartNavigation = () => {
    if (!map.current || !currentRouteCoords.length) return;
    if (navigationMarker.current) {
      navigationMarker.current.remove();
    }
    const navElement = document.createElement('div');
    navElement.style.width = '24px';
    navElement.style.height = '24px';
    navElement.style.display = 'flex';
    navElement.style.alignItems = 'center';
    navElement.style.justifyContent = 'center';
    navElement.style.background = 'rgba(0, 122, 255, 0.95)';
    navElement.style.borderRadius = '50%';
    navElement.style.boxShadow = '0 2px 8px rgba(0, 122, 255, 0.3)';
    navElement.style.border = '2px solid rgba(255, 255, 255, 0.9)';
    navElement.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    navElement.style.animation = `${pulseKeyframes} 2s ease-in-out infinite`;
    navElement.innerHTML = `
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        .pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(0, 122, 255, 0.3);
          animation: pulse 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      </style>
      <div class="pulse-ring"></div>
    `;
    navigationMarker.current = new mapboxgl.Marker({
      element: navElement,
      anchor: 'center',
      rotationAlignment: 'map',
      pitchAlignment: 'map'
    })
      .setLngLat(currentRouteCoords[0] as [number, number])
      .addTo(map.current);

    // Ensure the marker stays on the route
    map.current.on('move', () => {
      if (navigationMarker.current && carIndex !== null) {
        const currentPoint = currentRouteCoords[carIndex] as [number, number];
        navigationMarker.current.setLngLat(currentPoint);
      }
    });

    ensureRouteLayersVisible();
    map.current.flyTo({
      center: currentRouteCoords[0] as [number, number],
      zoom: 16,
      pitch: 65,
      bearing: -30,
      duration: 1200,
      essential: true
    });
    setCarIndex(0);
    carShouldMove.current = true;
  };

  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&country=BE`
      );
      const data = await response.json();
      if (data.features && data.features[0]) {
        const [lng, lat] = data.features[0].center;
        return [lng, lat];
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

  // Fetch weather data
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${THOMAS_MORE_COORDS[1]}&lon=${THOMAS_MORE_COORDS[0]}&appid=0f5c13cbb8dacd08f0cd71bc89836fb5&units=metric`
      );
      const data = await response.json();
      if (data && data.main && data.weather && data.weather[0]) {
        // Data fetched, but not setting state
        console.log('Weather data:', data);
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  
  // Fetch air quality data
  const fetchAirQualityData = async () => {
    try {
      // Use Thomas More coordinates for air quality data
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${THOMAS_MORE_COORDS[1]}&lon=${THOMAS_MORE_COORDS[0]}&appid=0f5c13cbb8dacd08f0cd71bc89836fb5`
      );
      const data = await response.json();
      if (data && data.list && data.list[0] && data.list[0].main) {
        // Data fetched, but not setting state
        console.log('Air quality data:', data);
      }
    } catch (error) {
      console.error('Error fetching air quality data:', error);
    }
  };

  const handleBreathingTrigger = () => {
    setShowBreathingPrompt(false);
    setShowBreathingWidget(true);
  };

  useEffect(() => {
    if (showBreathingWidget && isBreathingFullscreen && !fsPaused) {
      fsTimerRef.current = setInterval(() => {
        setFsSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(fsTimerRef.current);
    }
    return () => clearInterval(fsTimerRef.current);
  }, [showBreathingWidget, isBreathingFullscreen, fsPaused]);

  useEffect(() => {
    if (fsVideoRef.current) {
      fsVideoRef.current.volume = fsVolume;
    }
  }, [fsVolume]);

  useEffect(() => {
    if (!(showBreathingWidget && isBreathingFullscreen)) return;
    let phaseTimeout: NodeJS.Timeout;
    const phaseDurations = { inhale: 4000, hold: 4000, exhale: 4000, rest: 2000 };
    function nextPhase(phase: typeof fsPhase) {
      let next: typeof fsPhase;
      if (phase === 'inhale') next = 'hold';
      else if (phase === 'hold') next = 'exhale';
      else if (phase === 'exhale') next = 'rest';
      else next = 'inhale';
      setFsPhase(next);
      speakBreathingPhase(
        next === 'inhale' ? 'Inhale' :
        next === 'hold' ? 'Hold' :
        next === 'exhale' ? 'Exhale' : 'Rest'
      );
      phaseTimeout = setTimeout(() => nextPhase(next), phaseDurations[next]);
    }
    setFsPhase('inhale');
    speakBreathingPhase('Inhale');
    phaseTimeout = setTimeout(() => nextPhase('inhale'), phaseDurations['inhale']);
    return () => {
      clearTimeout(phaseTimeout);
      window.speechSynthesis && window.speechSynthesis.cancel();
    };
  }, [showBreathingWidget, isBreathingFullscreen]);

  useEffect(() => {
    if (showBreathingWidget && isBreathingFullscreen) {
      if (waterAudioRef.current) {
        waterAudioRef.current.currentTime = 0;
        waterAudioRef.current.volume = 0.18;
        waterAudioRef.current.loop = true;
        waterAudioRef.current.play().catch(() => {});
      }
    } else {
      if (waterAudioRef.current) {
        waterAudioRef.current.pause();
        waterAudioRef.current.currentTime = 0;
      }
    }
  }, [showBreathingWidget, isBreathingFullscreen]);

  const handleGoFullscreen = () => {
    setIsBreathingFullscreen(true);
    setTimeout(() => {
      waterAudioRef.current?.play().catch(() => {});
    }, 0);
  };

  // Add effect to load autoplay setting from localStorage
  useEffect(() => {
    const savedAutoplay = localStorage.getItem('autoplayBreathing');
    if (savedAutoplay !== null) {
      setAutoplayBreathing(savedAutoplay === 'true');
    }
  }, []);

  // Add effect to save autoplay setting to localStorage
  useEffect(() => {
    localStorage.setItem('autoplayBreathing', autoplayBreathing.toString());
  }, [autoplayBreathing]);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box
        ref={mapContainer}
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      />
      
      {/* Weather and Air Quality Info */}
      <Paper 
        sx={{
          position: 'absolute',
          top: 16,
          right: 320,
          background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 1,
          border: '1px solid rgba(255, 59, 48, 0.15)',
          boxShadow: '0 4px 24px rgba(255, 59, 48, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 32px rgba(255, 59, 48, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)',
          },
        }}
        onClick={() => setShowWeatherDetails(!showWeatherDetails)}
      >
        {/* ... existing weather and air quality content ... */}
      </Paper>
      
      {/* Navigation Button */}
      <Fade in={!isPanelOpen}>
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
          <NavigationButton onClick={() => setIsPanelOpen(true)} />
        </Box>
      </Fade>
      
      {/* Navigation Panel */}
      <Collapse in={isPanelOpen} orientation="horizontal" timeout={300}>
        <Box sx={{
          position: 'absolute',
          top: 8,
          right: 16,
          bottom: showRouteSummary ? 8 : 'auto',
          zIndex: 999,
          width: 280,
        }}>
          <Paper
            elevation={6} 
            sx={{
              width: '100%',
              height: showRouteSummary ? '100%' : 'auto',
              background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))',
              backdropFilter: 'blur(12px)',
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid rgba(255, 59, 48, 0.15)',
              boxShadow: '0 4px 24px rgba(255, 59, 48, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ 
              p: 2,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              flexShrink: 0,
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                  Navigation
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => setIsPanelOpen(false)}
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ 
              p: 2,
              overflowY: showRouteSummary ? 'auto' : 'visible',
              flex: showRouteSummary ? 1 : 'none',
              '::-webkit-scrollbar': { 
                width: '4px',
              },
              '::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.05)',
              },
              '::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '2px',
              },
            }}>
              {!showRouteSummary && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <LocationInput
                      label="From"
                      value={from}
                      onChange={setFrom}
                      placeholder="Enter starting location"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <LocationInput
                      label="To"
                      value={to}
                      onChange={setTo}
                      placeholder="Enter destination"
                    />
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCheckTraffic}
                    sx={{
                      bgcolor: '#ff3b30',
                      color: '#fff',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#ff3b30',
                        opacity: 0.9,
                      },
                    }}
                  >
                    Check Traffic
                  </Button>
                </>
              )}

              {showRouteSummary && (
                <Box>
                  <RouteSummary
                    from={from}
                    to={to}
                    onEdit={() => {
                      setIsPanelOpen(true);
                      setShowRouteSummary(false);
                    }}
                  />
                </Box>
              )}

              {isRouteVisible && trafficInfo && (
                <Box sx={{ mt: 2 }}>
                  <RouteInfo
                    duration={trafficDuration}
                    trafficInfo={trafficInfo}
                    onStart={handleStartNavigation}
                  />
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Collapse>

      {/* Breathing Widget */}
      {showBreathingWidget && !isBreathingFullscreen && (
        <BreathingWidget
          onClose={() => { setShowBreathingWidget(false); setShowSimulator(false); setIsBreathingFullscreen(false); }}
          setShowSimulator={setShowSimulator}
          onRequestFullscreen={handleGoFullscreen}
          isFullscreen={false}
          autoplay={autoplayBreathing}
        />
      )}

      {/* Simulator Panel */}
      <Collapse in={showSimulator} timeout={300}>
        <Box
          sx={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
          }}
        >
          <DrivingSimulator 
            onBreathingTrigger={handleBreathingTrigger}
            onClose={() => setShowSimulator(false)}
            speed={simSpeed}
            setSpeed={setSimSpeed}
          />
        </Box>
      </Collapse>

      {/* Driving Simulator Toggle Button */}
      <Fade in={!showSimulator && !showBreathingWidget} timeout={300}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            zIndex: 999,
          }}
        >
          <IconButton
            onClick={() => setShowSimulator(true)}
            sx={{
              backgroundColor: 'rgba(38, 20, 23, 0.92)',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(38, 20, 23, 0.95)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <SpeedIcon />
          </IconButton>
        </Box>
      </Fade>

      {/* Add Electric Stations Toggle */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1000,
        }}
      >
        <ElectricStationsToggle onToggle={setShowElectricStations} />
      </Box>

      {/* Breathing Widget Fullscreen Overlay */}
      {showBreathingWidget && isBreathingFullscreen && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2000,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            p: 0,
            m: 0,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Water sound audio */}
          <audio ref={waterAudioRef} src="/water-calm.mp3" preload="auto" style={{ display: 'none' }} />
          {/* Video background with error handling */}
          <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <video
              ref={fsVideoRef}
              src={breathingFullscrMp4}
              autoPlay
              loop
              muted={fsMuted}
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                background: '#222',
                display: 'block',
              }}
              onError={e => {
                e.currentTarget.style.display = 'none';
                const fallback = document.getElementById('breathing-fallback-bg');
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <Box id="breathing-fallback-bg" sx={{ display: 'none', width: '100%', height: '100%', background: 'linear-gradient(120deg, #222 0%, #444 100%)', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
          </Box>
          {/* Centered breathing phase text and animated blob */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            pointerEvents: 'none',
          }}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: { xs: 220, sm: 320, md: 400 }, height: { xs: 220, sm: 320, md: 400 } }}>
              {/* Animated blob/circle, zIndex 1 */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: fsPhase === 'inhale' ? 'linear-gradient(135deg, #ffe0ec 0%, #b39ddb 100%)' :
                              fsPhase === 'exhale' ? 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)' :
                              'linear-gradient(135deg, #f3e5f5 0%, #b2ebf2 100%)',
                  filter: 'blur(8px)',
                  opacity: 0.7,
                  animation: `${breatheBlob} ${fsPhase === 'inhale' ? '4s' : fsPhase === 'hold' ? '4s' : fsPhase === 'exhale' ? '4s' : '2s'} cubic-bezier(0.4,0,0.2,1) infinite`,
                  boxShadow: '0 0 64px 0 #b39ddb44',
                  transition: 'background 0.5s',
                  zIndex: 1,
                }}
              />
              {/* Animated phase text, zIndex 2 */}
              <Typography
                key={fsPhase}
                variant="h2"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  letterSpacing: 2,
                  textShadow: '0 4px 32px rgba(0,0,0,0.25)',
                  opacity: 0.92,
                  fontSize: { xs: '2.2rem', sm: '3.2rem', md: '4.2rem' },
                  textAlign: 'center',
                  userSelect: 'none',
                  transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                  animation: `${keyframes`
                    0% { opacity: 0; transform: scale(0.92); }
                    20% { opacity: 1; transform: scale(1.04); }
                    80% { opacity: 1; transform: scale(1.04); }
                    100% { opacity: 0; transform: scale(0.92); }
                  `} ${fsPhase === 'inhale' ? '4s' : fsPhase === 'hold' ? '4s' : fsPhase === 'exhale' ? '4s' : '2s'} cubic-bezier(0.4,0,0.2,1) infinite`,
                  zIndex: 2,
                }}
              >
                {fsPhase === 'inhale' && 'Inhale'}
                {fsPhase === 'hold' && 'Hold'}
                {fsPhase === 'exhale' && 'Exhale'}
                {fsPhase === 'rest' && 'Rest'}
              </Typography>
            </Box>
          </Box>
          {/* Top right close session */}
          <IconButton
            onClick={() => {
              setShowBreathingWidget(false);
              setIsBreathingFullscreen(false);
              setShowSimulator(false);
            }}
            sx={{
              position: 'absolute',
              top: 24,
              right: 24,
              zIndex: 10,
              color: '#fff',
              background: 'rgba(38,20,23,0.85)',
              '&:hover': { background: 'rgba(38,20,23,1)' },
              width: 40,
              height: 40,
            }}
          >
            <CloseIcon fontSize="medium" />
          </IconButton>
          {/* Controls row with exit fullscreen button to the right */}
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 5 }}>
            <Box
              sx={{
                width: { xs: '96%', sm: 420 },
                borderRadius: 3,
                background: 'rgba(30, 30, 40, 0.55)',
                boxShadow: '0 8px 32px 0 rgba(24,29,47,0.18)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 0,
                zIndex: 3,
                border: '1.5px solid rgba(255,255,255,0.10)',
                minHeight: 64,
                height: 64,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ flex: 1, px: 3, display: 'flex', alignItems: 'center', height: '100%' }}>
                <BreathingControls
                  sessionTime={fsSessionTime}
                  isPaused={fsPaused}
                  isMuted={fsMuted}
                  volume={fsVolume}
                  onPauseToggle={() => setFsPaused(p => !p)}
                  onMuteToggle={() => setFsMuted(m => !m)}
                  onVolumeChange={setFsVolume}
                  variant="fullscreen"
                />
              </Box>
            </Box>
            <IconButton
              onClick={() => setIsBreathingFullscreen(false)}
              sx={{
                color: '#fff',
                background: 'rgba(38,20,23,0.65)',
                borderRadius: 3,
                height: 64,
                width: 64,
                minWidth: 64,
                maxWidth: 64,
                boxShadow: '0 2px 8px 0 rgba(24,29,47,0.10)',
                border: '1.5px solid rgba(255,255,255,0.10)',
                borderLeft: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0,
                m: 0,
                ml: 2,
                '&:hover': {
                  background: 'rgba(38,20,23,0.92)',
                  color: '#ffe0ec',
                },
                transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <FullscreenIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MapContent; 