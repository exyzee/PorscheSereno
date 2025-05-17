import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Slider, Fade } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SpeedIcon from '@mui/icons-material/Speed';
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
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: '18px',
        left: '24px',
        width: '240px',
        borderRadius: '13px',
        overflow: 'hidden',
        background: 'rgba(38, 20, 23, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        mt: 4,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'rgba(255, 157, 157, 0.7)',
            padding: '4px',
            zIndex: 2,
            '&:hover': {
              backgroundColor: 'rgba(229, 57, 53, 0.1)',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>

        {!isBreathing ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Box
              sx={{
                width: '88px',
                height: '88px',
                margin: '0 auto 20px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(229, 57, 53, 0.12) 0%, rgba(229, 57, 53, 0.18) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px -4px rgba(229, 57, 53, 0.12)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.59 4.59A2 2 0 1 1 11 8H2M19.59 8.59A2 2 0 1 0 21 12H8m7.59 7.59A2 2 0 1 0 17 16H2" 
                  stroke="#E53935" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: '#fff',
                fontSize: '1.35rem',
                fontWeight: 600,
                mb: 3.5,
                letterSpacing: '0.02em',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.12)',
              }}
            >
              Let's take a calming breath!
            </Typography>
            <Button
              variant="contained"
              onClick={handleStartBreathing}
              sx={{
                backgroundColor: '#E53935',
                color: 'white',
                borderRadius: '12px',
                py: 1.75,
                px: 5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                boxShadow: '0 8px 16px -4px rgba(229, 57, 53, 0.25)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#F44336',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 20px -4px rgba(229, 57, 53, 0.3)',
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
          <Box>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '220px',
                backgroundColor: 'rgba(38, 20, 23, 0.92)',
                padding: '20px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: '180px',
                  height: '180px',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.2)',
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
            <Box sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                }}
              >
                <IconButton
                  onClick={handleMuteToggle}
                  sx={{
                    color: 'white',
                    padding: '4px',
                    '&:hover': {
                      backgroundColor: 'rgba(229, 57, 53, 0.1)',
                    },
                  }}
                >
                  {isMuted ? <VolumeOffIcon sx={{ fontSize: 18 }} /> : <VolumeUpIcon sx={{ fontSize: 18 }} />}
                </IconButton>
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.1}
                  disabled={isMuted}
                  sx={{
                    color: '#E53935',
                    height: 3,
                    '& .MuiSlider-thumb': {
                      width: 10,
                      height: 10,
                      backgroundColor: '#fff',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 6px rgba(229, 57, 53, 0.16)',
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
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  onClick={handlePauseToggle}
                  sx={{
                    backgroundColor: 'rgba(229, 57, 53, 0.12)',
                    minWidth: '42px',
                    width: '42px',
                    height: '42px',
                    padding: 0,
                    color: '#E53935',
                    borderRadius: '6px',
                    '&:hover': {
                      backgroundColor: 'rgba(229, 57, 53, 0.2)',
                    },
                  }}
                >
                  {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleEndSession}
                  sx={{
                    flex: 1,
                    backgroundColor: 'rgba(229, 57, 53, 0.12)',
                    color: '#E53935',
                    borderRadius: '6px',
                    py: 1,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'rgba(229, 57, 53, 0.2)',
                    },
                  }}
                >
                  End Session
                </Button>
              </Box>
            </Box>
          </Box>
        )}

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
    </Box>
  );
};

export default BreathingWidget; 