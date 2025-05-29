import React, { useRef } from 'react';
import introLogoMp4 from '../assets/intro-logo.mp4';

interface IntroLogoProps {
  onFinish: () => void;
}

const IntroLogo: React.FC<IntroLogoProps> = ({ onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    let fallbackTimer: NodeJS.Timeout | undefined;
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => onFinish();
    video.addEventListener('ended', handleEnded);
    // Fallback: if video doesn't play or is black, auto-finish after 5s
    fallbackTimer = setTimeout(() => {
      if (!video.paused && !video.ended) return; // playing
      onFinish();
    }, 5000);
    return () => {
      video.removeEventListener('ended', handleEnded);
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  }, [onFinish]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: 'rgba(0,0,0,0.02)',
      }}
    >
      <video
        ref={videoRef}
        src={introLogoMp4}
        autoPlay
        playsInline
        controls={false}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 8,
          boxShadow: '0 4px 32px 0 rgba(0,0,0,0.13)',
          background: '#000',
          display: 'block',
        }}
        onEnded={onFinish}
      />
      {/* Unmute button overlay */}
      {videoRef.current && videoRef.current.muted && (
        <button
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              videoRef.current.play();
            }
          }}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 28px',
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            zIndex: 10,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease',
          }}
        >
          Unmute
        </button>
      )}
    </div>
  );
};

export default IntroLogo;
