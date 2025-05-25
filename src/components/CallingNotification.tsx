import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, IconButton, Paper, Fade } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import TimerIcon from '@mui/icons-material/Timer';

interface CallingNotificationProps {
  name?: string;
  avatar?: string;
  onAccept?: () => void;
  onReject?: () => void;
}

type CallState = 'incoming' | 'ongoing' | 'ended';

const CallingNotification: React.FC<CallingNotificationProps> = ({
  name = 'John Pork',
  avatar = 'https://randomuser.me/api/portraits/men/32.jpg',
  onAccept,
  onReject,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [callState, setCallState] = useState<CallState>('incoming');
  const [callDuration, setCallDuration] = useState(0);
  const [ringtone] = useState(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  // Show notification after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle ringtone
  useEffect(() => {
    if (showNotification && callState === 'incoming') {
      ringtone.loop = true;
      ringtone.play().catch(() => {
        console.log('Autoplay prevented');
      });
    }

    return () => {
      ringtone.pause();
      ringtone.currentTime = 0;
    };
  }, [ringtone, showNotification, callState]);

  // Handle call duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'ongoing') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callState]);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    ringtone.muted = !isMuted;
  };

  const handleAccept = () => {
    setCallState('ongoing');
    ringtone.pause();
    onAccept?.();
  };

  const handleReject = () => {
    setCallState('ended');
    ringtone.pause();
    onReject?.();
    // Hide notification after animation
    setTimeout(() => {
      setShowNotification(false);
    }, 500);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showNotification) return null;

  return (
    <Fade in={showNotification} timeout={500}>
      <Paper
        elevation={6}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          width: 160,
          p: 1.5,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(24,29,47,0.18)',
          zIndex: 20,
          animation: 'slideUp 0.5s cubic-bezier(.68,-0.55,.27,1.55)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(.68,-0.55,.27,1.55)',
          '@keyframes slideUp': {
            '0%': { transform: 'translateY(20px)', opacity: 0 },
            '100%': { transform: 'translateY(0)', opacity: 1 },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            borderRadius: 'inherit',
            zIndex: -1,
            opacity: isHovered ? 0.15 : 0,
            transition: 'opacity 0.3s ease',
          },
        }}
      >
        <Avatar
          src={avatar}
          sx={{
            width: 48,
            height: 48,
            mb: 0.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            border: '2px solid #fff',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            animation: callState === 'incoming' ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' },
              '50%': { transform: 'scale(1.05)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' },
              '100%': { transform: 'scale(1)', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' },
            },
          }}
        />
        <Typography 
          variant="subtitle2" 
          fontWeight={600} 
          sx={{ 
            mb: 0.5, 
            color: '#222', 
            textAlign: 'center', 
            textShadow: '0 2px 8px rgba(0,0,0,0.08)',
            fontSize: '0.9rem',
          }}
        >
          {name}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#888', 
            mb: 0.5, 
            letterSpacing: 0.5,
            fontSize: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {callState === 'incoming' ? (
            <>
              <Box 
                component="span" 
                sx={{ 
                  width: 6, 
                  height: 6, 
                  borderRadius: '50%', 
                  bgcolor: '#4CAF50',
                  animation: 'blink 1.5s infinite',
                  '@keyframes blink': {
                    '0%': { opacity: 0.3 },
                    '50%': { opacity: 1 },
                    '100%': { opacity: 0.3 },
                  },
                }} 
              />
              Calling…
            </>
          ) : callState === 'ongoing' ? (
            <>
              <TimerIcon sx={{ fontSize: 12, color: '#4CAF50' }} />
              {formatDuration(callDuration)}
            </>
          ) : null}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
          {callState === 'incoming' && (
            <IconButton
              onClick={handleMuteToggle}
              size="small"
              sx={{
                bgcolor: 'rgba(0,0,0,0.05)',
                color: '#666',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' },
                transition: 'all 0.2s',
                transform: 'scale(1)',
                '&:active': { transform: 'scale(0.92)' },
              }}
            >
              {isMuted ? <VolumeOffIcon sx={{ fontSize: 18 }} /> : <VolumeUpIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          )}
          {callState === 'incoming' ? (
            <IconButton
              onClick={handleAccept}
              size="small"
              sx={{
                bgcolor: '#4CAF50',
                color: '#fff',
                '&:hover': { 
                  bgcolor: '#388E3C',
                  transform: 'scale(1.1) rotate(5deg)',
                },
                boxShadow: '0 2px 8px rgba(76,175,80,0.18)',
                transition: 'all 0.2s',
                transform: 'scale(1)',
                '&:active': { transform: 'scale(0.92)' },
              }}
            >
              <PhoneIcon sx={{ fontSize: 18 }} />
            </IconButton>
          ) : null}
          <IconButton
            onClick={handleReject}
            size="small"
            sx={{
              bgcolor: callState === 'ongoing' ? '#F44336' : '#F44336',
              color: '#fff',
              '&:hover': { 
                bgcolor: '#B71C1C',
                transform: 'scale(1.1) rotate(-5deg)',
              },
              boxShadow: '0 2px 8px rgba(244,67,54,0.18)',
              transition: 'all 0.2s',
              transform: 'scale(1)',
              '&:active': { transform: 'scale(0.92)' },
            }}
          >
            <CallEndIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Paper>
    </Fade>
  );
};

export default CallingNotification; 