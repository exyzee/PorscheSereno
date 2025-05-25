import { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import widgetBg from '../assets/widget-bg.mp4';
import { getRandomTrack } from '../utils/spotifyAuth';
import CallingNotification from '../components/CallingNotification';

// Placeholder widgets (replace with real ones as needed)
const MusicWidget = () => {
  const [track, setTrack] = useState<{
    name: string;
    artist: string;
    albumArt: string;
    spotifyUrl: string;
    playlistUrl: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrack = async () => {
    try {
      setIsLoading(true);
      const newTrack = await getRandomTrack();
      setTrack(newTrack);
    } catch (error) {
      console.error('Error fetching track:', error);
      setTrack(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrack();
  }, []);

  const handlePlay = () => {
    if (track?.playlistUrl) {
      window.open(track.playlistUrl, '_blank');
    }
  };

  const handleRefresh = () => {
    if (!isLoading) {
      fetchTrack();
    }
  };

  return (
    <Paper elevation={0} sx={{
      borderRadius: 4,
      p: 1.2,
      bgcolor: 'rgba(24,29,47,0.92)',
      color: '#fff',
      width: '100%',
      height: 190,
      boxShadow: '0 2px 12px 0 rgba(24,29,47,0.18)',
      display: 'flex',
      flexDirection: 'row',
      gap: 1.5,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
        borderRadius: 'inherit',
        pointerEvents: 'none'
      }
    }}>
      {/* Album Art */}
      <Box sx={{
        width: 160,
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative'
      }}>
        <Box sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {track?.albumArt ? (
            <img
              src={track.albumArt}
              alt={track.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isLoading ? 0.5 : 1,
                transition: 'opacity 0.3s ease'
              }}
            />
          ) : (
            <Box sx={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {isLoading ? (
                <ReplayIcon 
                  sx={{ 
                    fontSize: 32,
                    color: 'rgba(255,255,255,0.3)',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }} 
                />
              ) : (
                <Box sx={{ 
                  width: 32, 
                  height: 32, 
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PlayArrowIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.3)' }} />
                </Box>
              )}
            </Box>
          )}
        </Box>
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          p: 1
        }}>
          <PlayArrowIcon
            sx={{
              fontSize: 28,
              cursor: track ? 'pointer' : 'default',
              transition: 'transform 0.2s',
              opacity: track && !isLoading ? 1 : 0.5,
              '&:hover': {
                transform: track && !isLoading ? 'scale(1.1)' : 'none'
              }
            }}
            onClick={track ? handlePlay : undefined}
          />
          <ReplayIcon
            sx={{
              fontSize: 20,
              cursor: isLoading ? 'default' : 'pointer',
              transition: 'all 0.2s',
              opacity: isLoading ? 0.5 : 1,
              animation: isLoading ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              },
              '&:hover': {
                transform: isLoading ? 'none' : 'scale(1.1)'
              }
            }}
            onClick={handleRefresh}
          />
        </Box>
      </Box>

      {/* Track Info */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        flex: 1
      }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 14,
            mb: 0.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.2,
            opacity: isLoading ? 0.5 : 1,
            transition: 'opacity 0.3s ease'
          }}
        >
          {track?.name || 'Loading...'}
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 12,
            fontWeight: 500,
            opacity: isLoading ? 0.5 : 1,
            transition: 'opacity 0.3s ease'
          }}
        >
          {track?.artist || 'Loading...'}
        </Typography>
      </Box>
    </Paper>
  );
};

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
      bgcolor: 'rgba(24,29,47,0.92)',
      color: '#fff',
      width: '100%',
      height: 190,
      boxShadow: '0 2px 12px 0 rgba(24,29,47,0.18)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: 0.5,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.12)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
        borderRadius: 'inherit',
        pointerEvents: 'none'
      },
      position: 'relative'
    }}>
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        '::-webkit-scrollbar': { display: 'none' }, 
        msOverflowStyle: 'none', 
        scrollbarWidth: 'none',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
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
    bgcolor: 'rgba(255,255,255,0.98)',
    width: '100%',
    height: 190,
    boxShadow: '0 2px 12px 0 rgba(24,29,47,0.10)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
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
        },
        () => {
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
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Box sx={{ 
      display: 'flex',
      p: 2,
      height: '100%',
      width: '100%',
      gap: 2,
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Main Card: Greetings, Date, Background */}
      <Paper elevation={3} sx={{
        flex: 1,
        borderRadius: 4,
        bgcolor: '#fff',
        boxShadow: '0 4px 32px 0 rgba(24,29,47,0.13)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        p: 0,
        height: '100%',
        minWidth: 480,
        maxWidth: 520,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        {/* Video BG */}
        <video autoPlay loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src={widgetBg} type="video/mp4" />
        </video>

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 2, p: 4, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', height: '100%' }}>
          {/* Left: Day and Welcome */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: 1.1, mb: 0.3, textShadow: '0 2px 8px rgba(0,0,0,0.28)' }}>
              {now.toLocaleDateString([], { weekday: 'long' })}, {now.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1, textShadow: '0 2px 16px rgba(0,0,0,0.30)' }}>
              {getGreeting()}, Jha
            </Typography>
          </Box>
          {/* Right: Weather */}
          <WeatherWidget />
        </Box>
        {/* Calling Notification - always on top, bottom left */}
        <CallingNotification />
      </Paper>

      {/* Right Column: Music, Stocks, Calendar */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        maxWidth: 290,
        minWidth: 290,
        overflowY: 'auto',
        '::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}>
        <MusicWidget />
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
          <StocksWidget />
          <CalendarWidget />
        </Box>
      </Box>
    </Box>
  );
};

export default HomeContent;
