import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import widgetBg from '../assets/widget-bg.mp4';

// Placeholder widgets (replace with real ones as needed)
const MusicWidget = () => (
  <Paper elevation={0} sx={{
    borderRadius: 4,
    p: 1.5,
    background: 'linear-gradient(135deg, #fa233b 0%, #fd5c63 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    minHeight: 180,
    maxHeight: 160,
    minWidth: 290,
    maxWidth: 290,
    boxShadow: '0 4px 24px 0 rgba(250,35,59,0.10)',
    mb: 1.2,
    position: 'relative',
    overflow: 'hidden',
  }}>
    <Box sx={{ width: 88, height: 88, borderRadius: 2, bgcolor: '#fff', mr: 1, boxShadow: '0 2px 10px 0 rgba(24,29,47,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <img src="../src/assets/foo-fighters-times-like-these.jpg" alt="Album Art" style={{ width: 88, height: 88, borderRadius: 12, objectFit: 'cover', display: 'block' }} />
    </Box>
    <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff', overflow: 'visible', pl: 1.5, pr: 0.5, gap: 0.2 }}>
      <Typography sx={{ color: '#fff', opacity: 0.8, fontWeight: 600, letterSpacing: 1.1, fontSize: 10, mb: 0.2, textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
        Recently Played
      </Typography>
      <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 17, mb: 0.3, lineHeight: 1.15 }}>Times Like These</Typography>
      <Typography sx={{ color: '#fff', fontWeight: 400, opacity: 0.9, fontSize: 13, mb: 1.5 }}>Foo Fighters</Typography>
      <Box sx={{ mt: 0.7 }}>
        <Box sx={{
          px: 2.5,
          height: 36,
          borderRadius: '163.039px',
          background: 'var(--light-music-small-medium-widget-button, #FF4F65)',
          backgroundBlendMode: 'luminosity',
          color: '#fff',
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: 0.2,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px 0 rgba(250,35,59,0.08)',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.2s',
          '&:hover': { background: '#FF6A7A' }
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6, display: 'block' }}>
            <circle cx="9" cy="9" r="8" fill="#fff" fillOpacity="0.12" />
            <path d="M6 4.5V13.5L14 9L6 4.5Z" fill="#ffff"/>
          </svg>
          Play
        </Box>
      </Box>
    </Box>
  </Paper>
);

const StocksWidget = () => {
  const [stocks, setStocks] = useState<any[]>([]);
  useEffect(() => {
    fetch('https://financialmodelingprep.com/api/v3/stock/actives?apikey=k4emN5jCByTtk38GOknQ6Ygs7uMYwvar')
      .then(res => res.json())
      .then(data => setStocks(data.mostActiveStock || []));
  }, []);

  return (
    <Paper elevation={0} sx={{
      borderRadius: 4,
      p: 1.2,
      bgcolor: '#181D2F',
      color: '#fff',
      minWidth: 145,
      maxWidth: 145,
      minHeight: 190,
      maxHeight: 190,
      boxShadow: '0 2px 12px 0 rgba(24,29,47,0.18)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: 0.5,
      overflow: 'hidden',
    }}>
      <Box sx={{ flex: 1, overflowY: 'auto', '::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {stocks.slice(0, 18).map((stock, idx) => (
          <Box key={stock.ticker + idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.2 }}>
            <Box sx={{ color: stock.changes > 0 ? '#39e17a' : '#fa233b', fontSize: 13, mr: 0.6 }}>{stock.changes > 0 ? '▲' : '▼'}</Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#fff', display: 'inline' }}>{stock.ticker}</Typography>
              <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 500, ml: 0.6, display: 'inline' }}>{stock.price}</Typography>
              <Typography sx={{ color: stock.changes > 0 ? '#39e17a' : '#fa233b', fontWeight: 600, fontSize: 10, ml: 0.6, display: 'inline' }}>{stock.changes > 0 ? '+' : ''}{stock.changes}</Typography>
              <Typography sx={{ color: '#b0b0b0', fontSize: 9, ml: 1.2, display: 'block', fontWeight: 400 }}>{stock.companyName}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

const CalendarWidget = () => (
  <Paper elevation={0} sx={{
    borderRadius: 4,
    p: 1.2,
    bgcolor: '#fff',
    minWidth: 145,
    maxWidth: 145,
    minHeight: 190,
    maxHeight: 190,
    boxShadow: '0 2px 12px 0 rgba(24,29,47,0.10)',
    display: 'flex',
    flexDirection: 'column',
    mb: 1.2,
    overflow: 'hidden',
  }}>
    <Box sx={{ position: 'sticky', top: 0, zIndex: 2, bgcolor: '#fff', pb: 0.2 }}>
      <Typography sx={{ color: '#fa233b', fontWeight: 700, fontSize: 10, mb: 0.3, letterSpacing: 0.7, textTransform: 'uppercase' }}>TUESDAY</Typography>
      <Typography sx={{ color: '#181D2F', fontWeight: 700, mb: 0.7, fontSize: 28, lineHeight: 1 }}>{23}</Typography>
    </Box>
    <Box sx={{ flex: 1, overflowY: 'auto', width: '100%', pr: 0.5, '::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
      {/* Fake Events */}
      <Box sx={{ bgcolor: '#f7f3e8', borderRadius: 1, p: 0.5, mb: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: '#b59a3b', fontWeight: 700, fontSize: 10 }}>Due Diligence</Typography>
        <Typography sx={{ color: '#b59a3b', fontWeight: 500, fontSize: 8 }}>9:45–11:00AM</Typography>
      </Box>
      <Box sx={{ bgcolor: '#e8f7f3', borderRadius: 1, p: 0.5, mb: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: '#3bb59a', fontWeight: 700, fontSize: 10 }}>Design Sync</Typography>
        <Typography sx={{ color: '#3bb59a', fontWeight: 500, fontSize: 8 }}>11:30–12:00PM</Typography>
      </Box>
      <Box sx={{ bgcolor: '#f3e8f7', borderRadius: 1, p: 0.5, mb: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: '#b53bb5', fontWeight: 700, fontSize: 10 }}>Lunch with Sam</Typography>
        <Typography sx={{ color: '#b53bb5', fontWeight: 500, fontSize: 8 }}>12:30–1:30PM</Typography>
      </Box>
      <Box sx={{ bgcolor: '#f7e8e8', borderRadius: 1, p: 0.5, mb: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: '#b53b3b', fontWeight: 700, fontSize: 10 }}>1:1 with Manager</Typography>
        <Typography sx={{ color: '#b53b3b', fontWeight: 500, fontSize: 8 }}>2:00–2:30PM</Typography>
      </Box>
      <Box sx={{ bgcolor: '#e8f7e8', borderRadius: 1, p: 0.5, mb: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: '#3bb53b', fontWeight: 700, fontSize: 10 }}>Code Review</Typography>
        <Typography sx={{ color: '#3bb53b', fontWeight: 500, fontSize: 8 }}>3:00–4:00PM</Typography>
      </Box>
      <Box sx={{ bgcolor: '#e8eaf7', borderRadius: 1, p: 0.5, mb: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: '#3b3bb5', fontWeight: 700, fontSize: 10 }}>Demo Prep</Typography>
        <Typography sx={{ color: '#3b3bb5', fontWeight: 500, fontSize: 8 }}>4:30–5:00PM</Typography>
      </Box>
      <Box sx={{ bgcolor: '#f7f3e8', borderRadius: 1, p: 0.5, mb: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: '#b59a3b', fontWeight: 700, fontSize: 10 }}>Team Standup</Typography>
        <Typography sx={{ color: '#b59a3b', fontWeight: 500, fontSize: 8 }}>5:30–6:00PM</Typography>
      </Box>
      <Box sx={{ bgcolor: '#f7e8f3', borderRadius: 1, p: 0.5, mb: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: '#b53b9a', fontWeight: 700, fontSize: 10 }}>Wrap Up</Typography>
        <Typography sx={{ color: '#b53b9a', fontWeight: 500, fontSize: 8 }}>6:30–7:00PM</Typography>
      </Box>
      <Box sx={{ bgcolor: '#e7fbe7', borderRadius: 1, p: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: '#39e17a', fontWeight: 700, fontSize: 10 }}>Sequoia Pitch</Typography>
        <Typography sx={{ color: '#39e17a', fontWeight: 500, fontSize: 8 }}>2:15–4:00PM</Typography>
      </Box>
      <Box sx={{ bgcolor: '#f7f3e8', borderRadius: 1, p: 0.5, display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ color: '#b59a3b', fontWeight: 700, fontSize: 10 }}>Lawyers Briefing</Typography>
        <Typography sx={{ color: '#b59a3b', fontWeight: 500, fontSize: 8 }}>11:00–1:30PM</Typography>
      </Box>
    </Box>
  </Paper>
);

const WeatherWidget = () => {
  const [weather, setWeather] = useState<any>(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=0f5c13cbb8dacd08f0cd71bc89836fb5&units=metric`)
            .then(res => res.json())
            .then(data => {
              if (data && data.main && data.name && data.weather && data.weather[0]) {
                setWeather({
                  temperature: data.main.temp,
                  city: data.name,
                  icon: data.weather[0].icon,
                  description: data.weather[0].description
                });
              } else {
                setWeather(null);
              }
            })
            .catch(() => setWeather(null));
        },
        (error) => {
          // If denied or error, fallback to Paris
          fetch('https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=0f5c13cbb8dacd08f0cd71bc89836fb5&units=metric')
            .then(res => res.json())
            .then(data => {
              if (data && data.main && data.name && data.weather && data.weather[0]) {
                setWeather({
                  temperature: data.main.temp,
                  city: data.name,
                  icon: data.weather[0].icon,
                  description: data.weather[0].description
                });
              } else {
                setWeather(null);
              }
            })
            .catch(() => setWeather(null));
        }
      );
    } else {
      // No geolocation support, fallback to Paris
      fetch('https://api.openweathermap.org/data/2.5/weather?q=Paris&appid=0f5c13cbb8dacd08f0cd71bc89836fb5&units=metric')
        .then(res => res.json())
        .then(data => {
          if (data && data.main && data.name && data.weather && data.weather[0]) {
            setWeather({
              temperature: data.main.temp,
              city: data.name,
              icon: data.weather[0].icon,
              description: data.weather[0].description
            });
          } else {
            setWeather(null);
          }
        })
        .catch(() => setWeather(null));
    }
  }, []);
  return (
    <Box sx={{ minWidth: 120, px: 2, py: 1.5, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, bgcolor: 'transparent', boxShadow: 'none' }}>
      {weather ? (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {weather.icon && (
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description || 'weather icon'}
                style={{ width: 36, height: 36, marginRight: 4, filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.18))' }}
              />
            )}
            <Typography sx={{ fontWeight: 800, fontSize: 28, color: '#fff', lineHeight: 1 }}>
              {weather.temperature ? `${Math.round(weather.temperature)}°C` : '--'}
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#fff', opacity: 0.98, mt: 0.3, lineHeight: 1.1 }}>
            {weather.city || '—'}
          </Typography>
        </>
      ) : (
        <Typography sx={{ fontWeight: 500, fontSize: 12, color: '#fff', opacity: 0.95 }}>Weather unavailable</Typography>
      )}
    </Box>
  );
};

const HomeContent = () => {
  // Use latest time from user context
  const now = new Date('2025-04-17T17:01:12+02:00');
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <Box sx={{ display: 'flex', height: '100%', minHeight: 200, gap: 2 }}>
      {/* Main Card: Greetings, Date, Background */}
      <Paper elevation={3} sx={{
        flex: 1.6,
        borderRadius: 4,
        bgcolor: '#fff',
        boxShadow: '0 4px 32px 0 rgba(24,29,47,0.13)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        p: 0,
        minWidth: 580,
        overflow: 'hidden',
      }}>
        {/* Video BG */}
        <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src={widgetBg} type="video/mp4" />
        </video>

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 2, p: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', height: '100%' }}>
          {/* Left: Day and Welcome */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: 1.1, mb: 0.3, textShadow: '0 2px 8px rgba(0,0,0,0.28)' }}>
    {now.toLocaleDateString([], { weekday: 'long' })}, {now.toLocaleDateString([], { month: 'short', day: 'numeric' })}
  </Typography>
  <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1, textShadow: '0 2px 16px rgba(0,0,0,0.30)' }}>
    Welcome, Max!
  </Typography>
</Box>
          {/* Right: Weather */}
          <WeatherWidget />
        </Box>
      </Paper>

      {/* Right Column: Music, Stocks, Calendar */}
      <Box sx={{ flex: 2.2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Music Widget */}
        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 290, maxWidth: 290 }}>
          <MusicWidget />
          <Box sx={{ height: 8 }} />
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.8 }}>
            <StocksWidget />
            <CalendarWidget />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomeContent;
