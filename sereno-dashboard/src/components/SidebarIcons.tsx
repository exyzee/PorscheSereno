
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import appleMapsPng from '../assets/icons/apple-maps.png';
import serenoLogoPng from '../assets/icons/sereno-logo.png';
import appleMusicPng from '../assets/icons/apple-music.png';
import appleMailPng from '../assets/icons/apple-mail.png';
import dashboardPng from '../assets/icons/dashboard.png';
import { useNavigate } from 'react-router-dom';

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

const LiveClock = ({ showTime = true, showDate = true }: { showTime?: boolean; showDate?: boolean }) => {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
      {showTime && (
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, textShadow: '0 2px 12px rgba(0,0,0,0.13)' }}>{time}</span>
      )}
      {showDate && (
        <span style={{ color: '#fff', fontWeight: 400, fontSize: 13, opacity: 0.75, textShadow: '0 2px 12px rgba(0,0,0,0.10)' }}>{date}</span>
      )}
    </div>
  );
};

function SidebarIcons() {
  const navigate = useNavigate();
  const homeTouch = useTouchActive();
  return (
    <>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 6 }}>
        <LiveClock showTime={true} showDate={false} />
      </div>
      <div
        style={{
          borderRadius: 14,
          padding: 8,
          background: homeTouch.active ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.10)',
          transition: 'background 0.2s',
          margin: '4px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onTouchStart={homeTouch.onTouchStart}
        onTouchEnd={homeTouch.onTouchEnd}
        onMouseDown={homeTouch.onMouseDown}
        onMouseUp={homeTouch.onMouseUp}
        onMouseLeave={homeTouch.onMouseLeave}
        onClick={() => navigate('/')}
      >
        <HomeIcon style={{ fontSize: 36, color: '#fff' }} />
      </div>
      <img
        src={appleMapsPng}
        alt="Apple Maps"
        style={iconStyle}
        onClick={() => navigate('/map')}
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
    </>
  );
}

export default SidebarIcons;