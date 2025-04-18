import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapRoot = styled(Box)({
  padding: '32px 32px 32px 0', // match Dashboard main content area (top/right/bottom/left)
  height: 420, // match Good Morning Jha container height
  width: '100%',
  overflow: 'auto',
  background: '#F7F8FA',
  boxSizing: 'border-box',
})

const MapContainer = styled('div')({
  width: '100%',
  height: 600,
  borderRadius: 24,
  overflow: 'hidden',
  boxShadow: '0 4px 24px 0 rgba(24,29,47,0.04)',
  background: '#fff',
})

const MapView = () => {
  const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN'
  return (
    <MapRoot>
      <Typography variant="h4" sx={{ mb: 3, color: '#181D2F', fontWeight: 700 }}>Map View</Typography>
      <MapContainer>
        <Map
          initialViewState={{ longitude: -122.4, latitude: 37.8, zoom: 13 }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/dark-v10"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <Marker longitude={-122.4} latitude={37.8} color="red" />
        </Map>
      </MapContainer>
    </MapRoot>
  )
}

export default MapView
