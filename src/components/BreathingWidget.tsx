import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Slider, Fade, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SpeedIcon from '@mui/icons-material/Speed';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import breathingVideo from '../assets/breathing.mov';

const placeholderVideo = breathingVideo;

interface BreathingWidgetProps {
  onClose: () => void;
  showSimulator: boolean;
  setShowSimulator: React.Dispatch<React.SetStateAction<boolean>>;
}

const BreathingWidget: React.FC<BreathingWidgetProps> = ({ onClose, showSimulator, setShowSimulator }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPaused]);

  const handleStartBreathing = () => {
    setIsBreathing(true);
    setIsPaused(false);
  };

  const handleEndSession = () => {
    onClose();
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const toggleExpand = () => {
    if (!isExpanded) {
      setShowSimulator(false);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'absolute',
        ...(isExpanded ? {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        } : {
          bottom: '18px',
          left: '24px',
        }),
        width: isExpanded ? 'calc(100% - 48px)' : '240px',
        height: isExpanded ? 'calc(100% - 36px)' : 'auto',
        borderRadius: isExpanded ? '24px' : '13px',
        overflow: 'hidden',
        background: isExpanded 
          ? 'linear-gradient(135deg, rgba(38, 20, 23, 0.98), rgba(68, 34, 34, 0.98))'
          : 'rgba(38, 20, 23, 0.92)',
        border: isExpanded 
          ? '1px solid rgba(255, 183, 197, 0.2)'
          : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isExpanded
          ? '0 8px 32px 0 rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 183, 197, 0.1)'
          : '0 4px 24px 0 rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isExpanded
            ? 'radial-gradient(circle at 50% 50%, rgba(255, 183, 197, 0.15) 0%, rgba(255, 183, 197, 0) 70%), linear-gradient(135deg, rgba(255, 183, 197, 0.1) 0%, rgba(255, 183, 197, 0) 50%)'
            : 'radial-gradient(circle at 50% 50%, rgba(255, 183, 197, 0.15) 0%, rgba(255, 183, 197, 0) 70%)',
          animation: isExpanded
            ? 'pulse 8s ease-in-out infinite, rotate 20s linear infinite'
            : 'pulse 8s ease-in-out infinite',
          zIndex: 0,
        },
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)', opacity: 0.5 },
          '50%': { transform: 'scale(1.2)', opacity: 0.8 },
          '100%': { transform: 'scale(1)', opacity: 0.5 },
        },
        '@keyframes rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      }}
    >
      <Box sx={{ position: 'relative', height: '100%', zIndex: 1 }}>
        <Box sx={{ 
          position: 'absolute',
          top: 8,
          right: 8,
          display: 'flex',
          gap: 1,
          zIndex: 2,
        }}>
          <IconButton
            onClick={toggleExpand}
            sx={{
              color: 'rgba(255, 183, 197, 0.7)',
              padding: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 183, 197, 0.1)',
              },
            }}
          >
            {isExpanded ? <FullscreenExitIcon sx={{ fontSize: 18 }} /> : <FullscreenIcon sx={{ fontSize: 18 }} />}
          </IconButton>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'rgba(255, 183, 197, 0.7)',
              padding: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 183, 197, 0.1)',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {!isBreathing ? (
          <Box sx={{ 
            p: 2, 
            textAlign: 'center',
            height: isExpanded ? '100%' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Box
              sx={{
                width: isExpanded ? '200px' : '88px',
                height: isExpanded ? '200px' : '88px',
                margin: '0 auto 20px',
                borderRadius: isExpanded ? '40px' : '24px',
                background: isExpanded
                  ? 'linear-gradient(135deg, rgba(255, 183, 197, 0.15) 0%, rgba(255, 183, 197, 0.25) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 183, 197, 0.12) 0%, rgba(255, 183, 197, 0.18) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isExpanded
                  ? '0 12px 24px -4px rgba(255, 183, 197, 0.2), 0 0 0 1px rgba(255, 183, 197, 0.1)'
                  : '0 8px 16px -4px rgba(255, 183, 197, 0.12)',
                transition: 'all 0.3s ease-in-out',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-10px)' },
                  '100%': { transform: 'translateY(0px)' },
                },
              }}
            >
              <svg width={isExpanded ? '100px' : '44px'} height={isExpanded ? '100px' : '44px'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 9.5C4 9.5 5.5 8 8 8C10.5 8 12 9.5 12 9.5C12 9.5 13.5 8 16 8C18.5 8 20 9.5 20 9.5M4 14.5C4 14.5 5.5 13 8 13C10.5 13 12 14.5 12 14.5C12 14.5 13.5 13 16 13C18.5 13 20 14.5 20 14.5" 
                  stroke="#FFB7C5" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontSize: isExpanded ? '2.5rem' : '1.35rem',
                fontWeight: 600,
                mb: isExpanded ? 5 : 3.5,
                letterSpacing: '0.02em',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.12)',
              }}
            >
              Let's take a calming breath
            </Typography>
            <Button
              variant="contained"
              onClick={handleStartBreathing}
              sx={{
                backgroundColor: '#FFB7C5',
                color: 'white',
                borderRadius: isExpanded ? '16px' : '12px',
                py: isExpanded ? 2.5 : 1.75,
                px: isExpanded ? 8 : 5,
                textTransform: 'none',
                fontSize: isExpanded ? '1.4rem' : '1rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                boxShadow: isExpanded
                  ? '0 12px 24px -4px rgba(255, 183, 197, 0.3), 0 0 0 1px rgba(255, 183, 197, 0.1)'
                  : '0 8px 16px -4px rgba(255, 183, 197, 0.25)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#FFC0CB',
                  transform: 'translateY(-2px)',
                  boxShadow: isExpanded
                    ? '0 16px 32px -4px rgba(255, 183, 197, 0.4), 0 0 0 1px rgba(255, 183, 197, 0.2)'
                    : '0 12px 20px -4px rgba(255, 183, 197, 0.3)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              Start Breathing
            </Button>
          </Box>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: isExpanded ? 'calc(100% - 100px)' : '220px',
                backgroundColor: 'rgba(38, 20, 23, 0.92)',
                padding: isExpanded ? '60px' : '20px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '200%',
                  height: '200%',
                  background: isExpanded
                    ? 'radial-gradient(circle at center, rgba(255, 183, 197, 0.15) 0%, rgba(255, 183, 197, 0) 70%), linear-gradient(135deg, rgba(255, 183, 197, 0.1) 0%, rgba(255, 183, 197, 0) 50%)'
                    : 'radial-gradient(circle at center, rgba(255, 183, 197, 0.1) 0%, rgba(255, 183, 197, 0) 70%)',
                  transform: 'translate(-50%, -50%)',
                  animation: isExpanded
                    ? 'breathe 8s ease-in-out infinite, rotate 20s linear infinite'
                    : 'breathe 8s ease-in-out infinite',
                  zIndex: 0,
                },
                '@keyframes breathe': {
                  '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.3 },
                  '50%': { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0.6 },
                  '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.3 },
                },
              }}
            >
              <Box
                sx={{
                  width: isExpanded ? '90%' : '180px',
                  height: isExpanded ? '90%' : '180px',
                  overflow: 'hidden',
                  borderRadius: isExpanded ? '24px' : '12px',
                  boxShadow: isExpanded
                    ? '0 12px 32px 0 rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 183, 197, 0.1)'
                    : '0 4px 24px 0 rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isExpanded
                      ? 'linear-gradient(135deg, rgba(255, 183, 197, 0.15) 0%, rgba(255, 183, 197, 0) 50%), linear-gradient(45deg, rgba(255, 183, 197, 0.1) 0%, rgba(255, 183, 197, 0) 50%)'
                      : 'linear-gradient(135deg, rgba(255, 183, 197, 0.1) 0%, rgba(255, 183, 197, 0) 50%)',
                    animation: isExpanded
                      ? 'rotate 20s linear infinite, pulse 8s ease-in-out infinite'
                      : 'rotate 20s linear infinite',
                    zIndex: 1,
                  },
                }}
              >
                <video
                  ref={videoRef}
                  src={placeholderVideo}
                  autoPlay={!isPaused}
                  loop
                  muted={isMuted}
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ 
              p: isExpanded ? 6 : 2.5,
              background: isExpanded
                ? 'linear-gradient(180deg, rgba(38, 20, 23, 0.95) 0%, rgba(38, 20, 23, 0.98) 100%)'
                : 'rgba(38, 20, 23, 0.95)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: isExpanded
                  ? 'linear-gradient(90deg, rgba(255, 183, 197, 0) 0%, rgba(255, 183, 197, 0.4) 50%, rgba(255, 183, 197, 0) 100%)'
                  : 'linear-gradient(90deg, rgba(255, 183, 197, 0) 0%, rgba(255, 183, 197, 0.3) 50%, rgba(255, 183, 197, 0) 100%)',
              },
            }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: isExpanded ? 3 : 2,
                }}
              >
                <IconButton
                  onClick={handleMuteToggle}
                  sx={{
                    color: 'white',
                    padding: isExpanded ? '8px' : '4px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 183, 197, 0.1)',
                    },
                  }}
                >
                  {isMuted ? <VolumeOffIcon sx={{ fontSize: isExpanded ? 24 : 18 }} /> : <VolumeUpIcon sx={{ fontSize: isExpanded ? 24 : 18 }} />}
                </IconButton>
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.1}
                  disabled={isMuted}
                  sx={{
                    color: '#FFB7C5',
                    height: isExpanded ? 4 : 3,
                    '& .MuiSlider-thumb': {
                      width: isExpanded ? 14 : 10,
                      height: isExpanded ? 14 : 10,
                      backgroundColor: '#fff',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 6px rgba(255, 183, 197, 0.16)',
                      },
                    },
                    '& .MuiSlider-rail': {
                      opacity: 0.3,
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={handlePauseToggle}
                  sx={{
                    backgroundColor: 'rgba(255, 183, 197, 0.12)',
                    minWidth: isExpanded ? '56px' : '42px',
                    width: isExpanded ? '56px' : '42px',
                    height: isExpanded ? '56px' : '42px',
                    padding: 0,
                    color: '#FFB7C5',
                    borderRadius: isExpanded ? '12px' : '6px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 183, 197, 0.2)',
                    },
                  }}
                >
                  {isPaused ? <PlayArrowIcon sx={{ fontSize: isExpanded ? 28 : 24 }} /> : <PauseIcon sx={{ fontSize: isExpanded ? 28 : 24 }} />}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleEndSession}
                  sx={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 183, 197, 0.12)',
                    color: '#FFB7C5',
                    borderRadius: isExpanded ? '12px' : '6px',
                    py: isExpanded ? 1.5 : 1,
                    textTransform: 'none',
                    fontSize: isExpanded ? '1.1rem' : '0.875rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 183, 197, 0.2)',
                    },
                  }}
                >
                  End Session
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BreathingWidget; 