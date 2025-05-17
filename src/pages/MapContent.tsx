import { useEffect, useRef, useState } from 'react';
import { Box, Paper, TextField, Button, Typography, IconButton, Collapse, Fade, Chip, Tooltip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import mapboxgl, { MapboxOptions } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DirectionsIcon from '@mui/icons-material/Directions';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import TrafficIcon from '@mui/icons-material/Traffic';
import SpeedIcon from '@mui/icons-material/Speed';
import InfoIcon from '@mui/icons-material/Info';
import RouteIcon from '@mui/icons-material/Route';
import EditIcon from '@mui/icons-material/Edit';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EvStationIcon from '@mui/icons-material/EvStation';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HotelIcon from '@mui/icons-material/Hotel';
import LayersIcon from '@mui/icons-material/Layers';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CompassCalibrationIcon from '@mui/icons-material/CompassCalibration';
import TerrainIcon from '@mui/icons-material/Terrain';
import SatelliteIcon from '@mui/icons-material/Satellite';
import NightlightIcon from '@mui/icons-material/Nightlight';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import AirIcon from '@mui/icons-material/Air';
import carNavIcon from '../assets/car-nav.png';
import { keyframes } from '@mui/material/styles';
import RainIcon from '@mui/icons-material/Grain';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import FogIcon from '@mui/icons-material/Cloud';
import SnowIcon from '@mui/icons-material/AcUnit';
import BreathingWidget from '../components/BreathingWidget';
import DrivingSimulator from '../components/DrivingSimulator';
import NavigationButton from '../components/NavigationButton';
import RouteSummary from '../components/RouteSummary';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiamhhYWEiLCJhIjoiY205bWw1dTN2MGV5ZDJscjd6M2w2ZWplcCJ9.iPq01-kBwTudMOv3IV9h9g';
const BRUSSELS_COORDS: [number, number] = [4.3517, 50.8503];
const THOMAS_MORE_COORDS: [number, number] = [4.4697, 51.0285];
const GROTE_MARKT_COORDS: [number, number] = [4.4778, 51.0283];

// Add these after the existing constants
const pulseKeyframes = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const floatKeyframes = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
`;

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

export const MapContent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showRouteSummary, setShowRouteSummary] = useState(false);
  const [isRouteVisible, setIsRouteVisible] = useState(false);
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
  const [weatherInfo, setWeatherInfo] = useState<{ condition: string; temp: number } | null>(null);
  const [weatherDetails, setWeatherDetails] = useState<{
    feels_like: number;
    humidity: number;
    wind_speed: number;
    description: string;
  } | null>(null);
  const [airQuality, setAirQuality] = useState<number | null>(null);
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);
  const [currentRouteCoords, setCurrentRouteCoords] = useState<number[][]>([]);
  const [trafficStartIndex, setTrafficStartIndex] = useState<number>(0);
  const navigationMarker = useRef<mapboxgl.Marker | null>(null);
  const navigationGlowLayer = useRef<string | null>(null);
  const [simSpeed, setSimSpeed] = useState(15);
  const [carIndex, setCarIndex] = useState<number | null>(null);
  const carAnimationRef = useRef<NodeJS.Timeout | null>(null);
  const [hasTriggeredBreathing, setHasTriggeredBreathing] = useState(false);
  const carShouldMove = useRef(true);

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

        // Add a marker for Grote Markt
        const marker = new mapboxgl.Marker({
          color: '#ff3b30',
          scale: 0.8
        })
          .setLngLat(GROTE_MARKT_COORDS)
          .setPopup(new mapboxgl.Popup({ offset: 25 })
            .setHTML('<h3>Grote Markt</h3><p>Mechelen</p>'))
          .addTo(map.current);
        
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

  const debugRouteLayers = () => {
    if (!map.current) return;
    
    console.log('Debugging route layers:');
    
    // Check if layers exist and their visibility
    ['route-start', 'route-traffic', 'route-end'].forEach(layerId => {
      const layerExists = map.current?.getLayer(layerId) !== undefined;
      const glowLayerExists = map.current?.getLayer(`${layerId}-glow`) !== undefined;
      
      console.log(`${layerId}: ${layerExists ? 'exists' : 'missing'}`);
      console.log(`${layerId}-glow: ${glowLayerExists ? 'exists' : 'missing'}`);
      
      if (layerExists) {
        const visibility = map.current?.getLayoutProperty(layerId, 'visibility');
        console.log(`${layerId} visibility: ${visibility}`);
      }
      
      if (glowLayerExists) {
        const visibility = map.current?.getLayoutProperty(`${layerId}-glow`, 'visibility');
        console.log(`${layerId}-glow visibility: ${visibility}`);
      }
    });
    
    // Force all layers to be visible
    ['route-start', 'route-traffic', 'route-end'].forEach(layerId => {
      if (map.current?.getLayer(layerId)) {
        map.current.setLayoutProperty(layerId, 'visibility', 'visible');
      }
      if (map.current?.getLayer(`${layerId}-glow`)) {
        map.current.setLayoutProperty(`${layerId}-glow`, 'visibility', 'visible');
      }
    });
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

    // Split the route into three segments
    const totalPoints = coordinates.length;
    const startIndex = Math.floor(totalPoints * 0.3);  // First 30%
    const endIndex = Math.floor(totalPoints * 0.7);    // Last 30%
    
    // Store the traffic start index for later use
    setTrafficStartIndex(startIndex);
    setHasTriggeredBreathing(false);

    const startCoords = coordinates.slice(0, startIndex);
    const trafficCoords = coordinates.slice(startIndex, endIndex);
    const finalCoords = coordinates.slice(endIndex);

    // Add sources and layers for each segment
    const segments = [
      { id: 'route-start', coords: startCoords, color: '#4caf50' },
      { id: 'route-traffic', coords: trafficCoords, color: '#f44336' },
      { id: 'route-end', coords: finalCoords, color: '#4caf50' }
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

    // Set traffic information with hardcoded 20-minute delay
    const baseTime = Math.round(route.duration / 60);
    const trafficDelay = 20;
    const totalDuration = baseTime + trafficDelay;

    setTrafficInfo({
      level: 'high',
      description: 'Heavy traffic on E19 between Mechelen and Brussels (+ 20 min delay)',
      bestRoute: 'Via E19 (Recommended despite traffic)'
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
      // Show breathing prompt if not already shown
      if (!hasTriggeredBreathing) {
        setShowBreathingWidget(true);
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
    const carElement = document.createElement('div');
    carElement.style.width = '40px';
    carElement.style.height = '40px';
    carElement.style.backgroundImage = `url(${carNavIcon})`;
    carElement.style.backgroundSize = 'contain';
    carElement.style.backgroundRepeat = 'no-repeat';
    carElement.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    navigationMarker.current = new mapboxgl.Marker({
      element: carElement,
      anchor: 'center'
    })
      .setLngLat(currentRouteCoords[0] as [number, number])
      .addTo(map.current);
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
        setWeatherInfo({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main.toLowerCase()
        });
        setWeatherDetails({
          feels_like: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          description: data.weather[0].description
        });
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
        // OpenWeather AQI is 1-5, convert to 0-100 scale
        const aqiMap: { [key: number]: number } = {
          1: 25,  // Good
          2: 50,  // Fair
          3: 75,  // Moderate
          4: 90,  // Poor
          5: 100  // Very Poor
        };
        const aqi = data.list[0].main.aqi as number;
        setAirQuality(aqiMap[aqi] || 50);
      }
    } catch (error) {
      console.error('Error fetching air quality data:', error);
    }
  };

  // Helper function to get weather icon
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear':
        return <WbSunnyIcon sx={{ 
          color: '#ff9800', 
          fontSize: '1.1rem',
          filter: 'drop-shadow(0 2px 4px rgba(255, 152, 0, 0.3))',
          animation: `${floatKeyframes} 3s ease-in-out infinite`
        }} />;
      case 'clouds':
        return <WbCloudyIcon sx={{ 
          color: '#90caf9', 
          fontSize: '1.1rem',
          filter: 'drop-shadow(0 2px 4px rgba(144, 202, 249, 0.3))',
          animation: `${floatKeyframes} 3s ease-in-out infinite`
        }} />;
      case 'rain':
        return <RainIcon sx={{ 
          color: '#64b5f6', 
          fontSize: '1.1rem',
          filter: 'drop-shadow(0 2px 4px rgba(100, 181, 246, 0.3))',
          animation: `${floatKeyframes} 3s ease-in-out infinite`
        }} />;
      case 'thunderstorm':
        return <ThunderstormIcon sx={{ 
          color: '#ffd740', 
          fontSize: '1.1rem',
          filter: 'drop-shadow(0 2px 4px rgba(255, 215, 64, 0.3))',
          animation: `${floatKeyframes} 3s ease-in-out infinite`
        }} />;
      case 'snow':
        return <SnowIcon sx={{ 
          color: '#e1f5fe', 
          fontSize: '1.1rem',
          filter: 'drop-shadow(0 2px 4px rgba(225, 245, 254, 0.3))',
          animation: `${floatKeyframes} 3s ease-in-out infinite`
        }} />;
      case 'mist':
      case 'fog':
        return <FogIcon sx={{ 
          color: '#b0bec5', 
          fontSize: '1.1rem',
          filter: 'drop-shadow(0 2px 4px rgba(176, 190, 197, 0.3))',
          animation: `${floatKeyframes} 3s ease-in-out infinite`
        }} />;
      default:
        return <WbSunnyIcon sx={{ 
          color: '#ff9800', 
          fontSize: '1.1rem',
          filter: 'drop-shadow(0 2px 4px rgba(255, 152, 0, 0.3))',
          animation: `${floatKeyframes} 3s ease-in-out infinite`
        }} />;
    }
  };

  // Get AQI description and color
  const getAQIInfo = (aqi: number) => {
    if (aqi <= 25) return { text: 'Excellent', color: '#4caf50' };
    if (aqi <= 50) return { text: 'Good', color: '#8bc34a' };
    if (aqi <= 75) return { text: 'Moderate', color: '#ff9800' };
    if (aqi <= 90) return { text: 'Poor', color: '#f44336' };
    return { text: 'Very Poor', color: '#d32f2f' };
  };

  const handleBreathingTrigger = () => {
    setShowBreathingWidget(true);
  };

  return (
    <Box sx={{ 
      display: 'flex',
      height: '100%',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
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
          zIndex: 999,
          width: 280,
        }}>
          <Paper 
            elevation={6} 
            sx={{
              width: '100%',
              background: 'linear-gradient(135deg, rgba(44, 44, 44, 0.85), rgba(68, 34, 34, 0.95))',
              backdropFilter: 'blur(12px)',
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid rgba(255, 59, 48, 0.15)',
              boxShadow: '0 4px 24px rgba(255, 59, 48, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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

              {/* Only show the form if not showing the route summary */}
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

              {/* Show summary and start button after traffic is checked */}
              {showRouteSummary && (
                <Box sx={{ mt: 2 }}>
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
      {showBreathingWidget && (
        <BreathingWidget 
          onClose={() => setShowBreathingWidget(false)} 
          showSimulator={showSimulator}
          setShowSimulator={setShowSimulator}
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
      <Fade in={!showSimulator}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            zIndex: 1200,
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
    </Box>
  );
};

export default MapContent; 