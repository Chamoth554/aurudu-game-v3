import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Simple drum sound generator
const playDrumSound = (frequency = 150) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    console.log('Audio context error:', e);
  }
};

export default function RabanGahmu() {
  const navigate = useNavigate();
  const [tapCount, setTapCount] = useState(0);
  const [drumHit, setDrumHit] = useState(false);
  const drumRef = useRef();

  const handleRabanTap = useCallback(() => {
    setTapCount(prev => prev + 1);
    setDrumHit(true);
    
    // Play drum sound
    playDrumSound(150 + Math.random() * 50); // Random pitch variation

    setTimeout(() => setDrumHit(false), 200);
  }, []);

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      zIndex: 1,
    }}>
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/games')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          background: 'rgba(255,248,231,0.1)',
          border: '1px solid rgba(255,248,231,0.15)',
          color: '#FFF8E7',
          borderRadius: 12,
          padding: '0.75rem 1.5rem',
          cursor: 'pointer',
          fontSize: '0.95rem',
          fontFamily: 'inherit',
          fontWeight: 600,
        }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </motion.button>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}
      >
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 3.5rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #FFD700, #D2691E)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 1rem',
          letterSpacing: '-0.02em',
        }}>
          🥁 Raban Gahmu 🥁
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(255,248,231,0.7)',
          margin: 0,
        }}>
          Beat the Traditional Sinhala Drum
        </p>
      </motion.div>

      {/* Tap Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,165,116,0.2), rgba(200,148,100,0.15))',
          border: '2px solid rgba(212,165,116,0.4)',
          borderRadius: 16,
          padding: '1.5rem 3rem',
          minWidth: 200,
        }}>
          <p style={{
            margin: '0 0 0.5rem',
            color: 'rgba(255,248,231,0.6)',
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Total Beats
          </p>
          <motion.p
            key={tapCount}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            style={{
              margin: 0,
              color: '#FFD700',
              fontSize: '3.5rem',
              fontWeight: 900,
            }}
          >
            {tapCount}
          </motion.p>
        </div>
      </motion.div>

      {/* Big Circular Drum */}
      <motion.div
        ref={drumRef}
        onClick={handleRabanTap}
        animate={{
          scale: drumHit ? 0.85 : 1,
          rotateZ: drumHit ? (Math.random() > 0.5 ? -8 : 8) : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        style={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, #CD853F, #8B4513, #654321)',
          boxShadow: drumHit 
            ? '0 0 60px rgba(255,215,0,0.8), inset -10px -10px 30px rgba(0,0,0,0.5)' 
            : '0 20px 60px rgba(0,0,0,0.4), inset -15px -15px 40px rgba(0,0,0,0.6)',
          cursor: 'pointer',
          userSelect: 'none',
          position: 'relative',
          border: '5px solid #654321',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Drum head center detail */}
        <div style={{
          position: 'absolute',
          width: '80%',
          height: '80%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(255,200,100,0.3), transparent)',
          pointerEvents: 'none',
        }} />
        
        {/* Drum pattern */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `
            conic-gradient(
              from 0deg,
              rgba(139,69,19,0.3) 0deg 30deg,
              transparent 30deg 60deg,
              rgba(139,69,19,0.3) 60deg 90deg,
              transparent 90deg 120deg,
              rgba(139,69,19,0.3) 120deg 150deg,
              transparent 150deg 180deg,
              rgba(139,69,19,0.3) 180deg 210deg,
              transparent 210deg 240deg,
              rgba(139,69,19,0.3) 240deg 270deg,
              transparent 270deg 300deg,
              rgba(139,69,19,0.3) 300deg 330deg,
              transparent 330deg
            )
          `,
          pointerEvents: 'none',
        }} />
      </motion.div>

      {/* Tap Indicator */}
      {drumHit && (
        <motion.div
          initial={{ opacity: 1, scale: 1, y: 0 }}
          animate={{ opacity: 0, scale: 1.8, y: -80 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '4rem',
            fontWeight: 900,
            color: '#FFD700',
            textShadow: '0 0 20px rgba(255,215,0,0.9)',
            pointerEvents: 'none',
          }}
        >
          ✨
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          marginTop: '4rem',
          textAlign: 'center',
          color: 'rgba(255,248,231,0.6)',
          fontSize: '1rem',
          maxWidth: 500,
        }}
      >
        <p style={{ margin: '0 0 1rem' }}>
          🎯 Tap the drum to play the traditional Sinhala drum sound!
        </p>
        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
          🥁 Enjoy the rhythm of Avurudu! 🎉
        </p>
      </motion.div>
    </div>
  );
}
