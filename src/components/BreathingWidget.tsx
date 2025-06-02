import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Slider, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { keyframes } from '@mui/material/styles';

interface BreathingWidgetProps {
  onClose: () => void;
  setShowSimulator: (show: boolean) => void;
  onRequestFullscreen?: () => void;
  isFullscreen?: boolean;
  autoplay?: boolean;
}

// Handles the controls for the breathing session (timer, pause, mute, etc.)
export interface BreathingControlsProps {
  sessionTime: number;
  isPaused: boolean;
  isMuted: boolean;
  volume: number;
  onPauseToggle: () => void;
  onMuteToggle: () => void;
  onVolumeChange: (v: number) => void;
  variant?: 'compact' | 'fullscreen';
}

export const BreathingControls: React.FC<BreathingControlsProps> = ({
  sessionTime,
  isPaused,
  isMuted,
  volume,
  onPauseToggle,
  onMuteToggle,
  onVolumeChange,
  variant = 'compact',
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100%',
        ...(variant === 'fullscreen' && {
          gap: 3,
          py: 2,
        }),
      }}
    >
      <Typography
        variant={variant === 'fullscreen' ? 'h5' : 'caption'}
        sx={{
          color: variant === 'fullscreen' ? '#fff' : '#a188a6',
          fontWeight: 600,
          minWidth: 56,
          textAlign: 'center',
          fontSize: variant === 'fullscreen' ? '1.5rem' : '1rem',
        }}
      >
        {formatTime(sessionTime)}
      </Typography>
      <IconButton
        onClick={onPauseToggle}
        sx={{
          color: variant === 'fullscreen' ? '#fff' : '#b39ddb',
          '&:hover': {
            color: '#7b5e6e',
          },
        }}
        size={variant === 'fullscreen' ? 'large' : 'small'}
      >
        {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
      </IconButton>
      <IconButton
        onClick={onMuteToggle}
        sx={{
          color: variant === 'fullscreen' ? '#fff' : '#b39ddb',
          '&:hover': {
            color: '#7b5e6e',
          },
        }}
        size={variant === 'fullscreen' ? 'large' : 'small'}
      >
        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
      <Slider
        value={volume}
        onChange={(_event: Event, newValue: number | number[]) => onVolumeChange(newValue as number)}
        min={0}
        max={1}
        step={0.1}
        sx={{
          color: variant === 'fullscreen' ? '#fff' : '#b39ddb',
          width: variant === 'fullscreen' ? 120 : 60,
          mx: 1,
          '& .MuiSlider-thumb': { width: 16, height: 16 },
        }}
      />
    </Box>
  );
};

// This is the main breathing widget. Handles video, state, and breathing logic.
const BreathingWidget: React.FC<BreathingWidgetProps> = (props) => {
  const { onClose, setShowSimulator, onRequestFullscreen, isFullscreen, autoplay = false } = props;
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoError, setVideoError] = useState<string | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();

  // Used for the animated circle in fullscreen mode
  const breatheAnimation = keyframes`
    0% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 0.6; }
    100% { transform: scale(1); opacity: 0.3; }
  `;

  // Grab the video URL from the backend (only runs once)
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/breathing.php');
        const data = await response.json();
        if (data.success) {
          const baseUrl = 'http://localhost:8000';
          const compactPath = data.videoUrl.replace('.mov', '.mp4');
          setVideoUrl(`${baseUrl}${compactPath}`);
          setVideoError(null);
        } else {
          setVideoError('Failed to load breathing video');
        }
      } catch (error) {
        setVideoError('Could not connect to video server or fetch video path');
      }
    };
    fetchVideo();
  }, []);

  // Play/pause/mute logic for the video element
  useEffect(() => {
    if (videoRef.current) {
      if (isStarted && !isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      videoRef.current.muted = isMuted;
    }
  }, [isStarted, isPaused, isMuted]);

  // Keep the video volume in sync with the slider
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  // Timer for the session
  useEffect(() => {
    if (isStarted && !isPaused) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isStarted, isPaused]);

  // Handles the breathing phase animation/timing
  useEffect(() => {
    if (isStarted && !isPaused) {
      const breathingCycle = () => {
        setBreathingPhase('inhale');
        setTimeout(() => {
          setBreathingPhase('hold');
          setTimeout(() => {
            setBreathingPhase('exhale');
            setTimeout(() => {
              setBreathingPhase('rest');
              setTimeout(breathingCycle, 2000);
            }, 4000);
          }, 4000);
        }, 4000);
      };
      breathingCycle();
    } else {
      setBreathingPhase('inhale');
    }
  }, [isStarted, isPaused]);

  // Handle autoplay countdown
  useEffect(() => {
    if (autoplay && !isStarted && countdown === null) {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setIsStarted(true);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      countdownRef.current = interval;
    }
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [autoplay, isStarted]);

  // Reset countdown when autoplay changes
  useEffect(() => {
    if (!autoplay) {
      setCountdown(null);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    }
  }, [autoplay]);

  const handleEndSession = () => {
    onClose();
    setShowSimulator(false);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const renderControls = () => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        mt: 1,
      }}
    >
      <IconButton
        onClick={handlePauseToggle}
        sx={{
          color: '#b39ddb',
          '&:hover': {
            color: '#7b5e6e',
          },
        }}
        size="small"
      >
        {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
      </IconButton>
      <IconButton
        onClick={handleMuteToggle}
        sx={{
          color: '#b39ddb',
           '&:hover': {
            color: '#7b5e6e',
          },
        }}
        size="small"
      >
        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
      <Slider
        value={volume}
        onChange={(_event: Event, newValue: number | number[]) => setVolume(newValue as number)}
        min={0}
        max={1}
        step={0.1}
        sx={{
          color: '#b39ddb',
          width: 60,
          mx: 0.5,
          '& .MuiSlider-thumb': { width: 12, height: 12, background: undefined, boxShadow: undefined },
          '& .MuiSlider-track': { border: 'none', background: undefined  },
          '& .MuiSlider-rail': { opacity: 0.3, color: undefined },
        }}
      />
    </Box>
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If in fullscreen mode, render nothing (parent will render overlay)
  if (isFullscreen) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 24,
        left: 24,
        width: 220, // Uniform compact width
        minHeight: 'auto', // Hug height in compact mode
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(120deg, #ffe0ec 0%, #e0f7fa 100%)',
        border: 'none',
        boxShadow: '0 4px 24px 0 rgba(255, 183, 197, 0.18)',
        zIndex: 10,
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        p: 2, // Padding in compact mode
      }}
    >
      {/* Close Button at top-right */}
      <IconButton
        onClick={handleEndSession}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1300,
          color: '#7b5e6e',
          background: 'rgba(255,255,255,0.8)',
          '&:hover': {
            background: 'rgba(255,255,255,1)',
          },
          boxShadow: '0 1px 4px rgba(0, 183, 197, 0.18)',
          width: 32,
          height: 32,
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      {
        // Compact (Prompt or Active) View
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          justifyContent: 'center', // Center content vertically
          p: 0, // Padding handled by outer box
        }}>
          {!isStarted ? (
            // Initial Prompt (reverted style) - Adjusting size and spacing
            <Box sx={{ width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2 }}>
              {/* Icon - Increased Size */}
              <Box sx={{
                width: 64,
                height: 64,
                background: 'linear-gradient(135deg, #e0f7fa 0%, #ffe0ec 100%)',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px 0 rgba(255, 183, 197, 0.18)',
                mb: 2,
              }}>
                <span role="img" aria-label="wave" style={{ fontSize: 38 }}>🌊</span>
              </Box>
              {/* Text - Heading Type */}
              <Typography
                variant="h6"
                sx={{
                  color: '#7b5e6e',
                  fontWeight: 600,
                  mb: 2,
                  letterSpacing: 0.1,
                  textAlign: 'center',
                  fontSize: countdown !== null ? '1.5rem' : '1.25rem',
                  transition: 'all 0.3s ease',
                }}
              >
                {countdown !== null ? `Starting in ${countdown}...` : 'Take a moment to breathe'}
              </Typography>
              {!autoplay && !isStarted && countdown === null && (
                <Button
                  variant="contained"
                  onClick={() => setIsStarted(true)}
                  sx={{
                    background: 'linear-gradient(120deg, #ffe0ec 0%, #e0f7fa 100%)',
                    color: '#7b5e6e',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px 0 rgba(255, 183, 197, 0.10)',
                    fontWeight: 500,
                    px: 2,
                    py: 0.7,
                    fontSize: '0.97rem',
                    textTransform: 'none',
                    transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
                    '&:hover': {
                      background: 'linear-gradient(120deg, #ffd0e0 0%, #d0e7ea 100%)',
                      color: '#5e3b4b',
                      transform: 'scale(1.03)',
                      boxShadow: '0 4px 16px 0 rgba(255, 183, 197, 0.16)',
                    },
                    '&:active': {
                      background: 'linear-gradient(120deg, #ffe0ec 0%, #e0f7fa 100%)',
                      color: '#7b5e6e',
                      transform: 'scale(0.98)',
                    },
                  }}
                >
                  Start breathing
                </Button>
              )}
            </Box>
          ) : (
            // Active Breathing View - Adjusting layout
            <Box sx={{
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              height: '100%',
              pt: 1,
              pb: 1, // Reduced padding bottom
            }}>
              {/* Video at the top - Increased Size */}
              {videoUrl && (
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 140,
                      height: 140,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px 0 rgba(255, 183, 197, 0.18)',
                      background: '#fff',
                    }}
                  >
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>
                </Box>
              )}
              {/* Timer beneath the video */}
              <BreathingControls
                sessionTime={sessionTime}
                isPaused={isPaused}
                isMuted={isMuted}
                volume={volume}
                onPauseToggle={handlePauseToggle}
                onMuteToggle={handleMuteToggle}
                onVolumeChange={(v) => setVolume(v)}
                variant="compact"
              />
              {/* Controls beneath the timer */}
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                <Button
                  variant="outlined"
                  sx={{
                    color: '#7b5e6e',
                    borderColor: '#b39ddb',
                    borderRadius: '12px',
                    px: 1.5,
                    py: 0.5,
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    minWidth: 'unset',
                    minHeight: 'unset',
                    background: 'rgba(255,255,255,0.85)',
                    boxShadow: '0 1px 4px 0 rgba(255, 183, 197, 0.10)',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.2,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 1,
                    '& .MuiButton-startIcon': {
                      marginRight: 0.5,
                    },
                    '&:hover': {
                      background: 'rgba(255,255,255,1)',
                      borderColor: '#7b5e6e',
                    },
                  }}
                  startIcon={<FullscreenIcon sx={{ fontSize: 18 }} />}
                  onClick={onRequestFullscreen}
                >
                  Go fullscreen
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      }
    </Box>
  );
};

export default BreathingWidget; 