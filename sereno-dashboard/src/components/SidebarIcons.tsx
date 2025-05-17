import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import appleMapsPng from '../assets/icons/apple-maps.png';
import serenoLogoPng from '../assets/icons/sereno-logo.png';
import appleMusicPng from '../assets/icons/apple-music.png';
import appleMailPng from '../assets/icons/apple-mail.png';
import dashboardPng from '../assets/icons/dashboard.png';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

const iconStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  margin: '4px 0',
  borderRadius: 12,
  transition: 'background 0.2s, transform 0.1s',
  cursor: 'pointer',
  background: 'transparent',
  display: 'block',
};

const iconActiveStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.18)',
  transform: 'scale(0.96)',
};

function useTouchActive() {
  const [active, setActive] = React.useState(false);
  return {
    active,
    onTouchStart: () => setActive(true),
    onTouchEnd: () => setActive(false),
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    onMouseLeave: () => setActive(false),
  };
}

const LiveClock = () => {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <span style={{ 
      color: '#fff', 
      fontWeight: 700, 
      fontSize: 18, 
      textShadow: '0 2px 12px rgba(0,0,0,0.13)',
      textAlign: 'center',
      display: 'block'
    }}>
      {time}
    </span>
  );
};

function SidebarIcons() {
  const navigate = useNavigate();
  const homeTouch = useTouchActive();
  const mapsTouch = useTouchActive();
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      height: '100%',
      p: 2,
      bgcolor: 'transparent'
    }}>
      {/* Clock */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        mt: 1.75,
        mb: -2
      }}>
        <LiveClock />
        <Box sx={{
          width: 20,
          height: 2,
          borderRadius: 1,
          bgcolor: 'rgba(255,255,255,0.2)'
        }} />
      </Box>

      {/* Icons */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1
      }}>
        <HomeIcon 
          sx={{
            ...iconStyle,
            ...(homeTouch.active ? iconActiveStyle : {})
          }}
          onClick={() => navigate('/')}
          {...homeTouch}
        />
        <img
          src={appleMapsPng}
          alt="Apple Maps"
          style={{
            ...iconStyle,
            ...(mapsTouch.active ? iconActiveStyle : {})
          }}
          onClick={() => navigate('/map')}
          {...mapsTouch}
        />
        {[serenoLogoPng, appleMusicPng, appleMailPng, dashboardPng].map((src) => {
          const iconTouch = useTouchActive();
          return (
            <img
              key={src}
              src={src}
              alt="Sidebar icon"
              style={{
                ...iconStyle,
                ...(iconTouch.active ? iconActiveStyle : {}),
              }}
              {...iconTouch}
            />
          );
        })}
      </Box>
    </Box>
  );
}

export default SidebarIcons;