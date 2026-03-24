import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { savePlayerName } from '../utils/storage';

export default function PlayerSetup() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }
    if (trimmed.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }
    savePlayerName(trimmed);
    navigate('/', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      zIndex: 1,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}
      >
        {/* Logo / Icon */}
        <motion.div
          style={{ fontSize: '5rem', marginBottom: '1rem', display: 'block' }}
          animate={{ rotate: [-5, 5, -5], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🎊
        </motion.div>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #FFD700, #F5A623)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem',
        }}>
          Avurudu Games
        </h1>
        <p style={{ color: 'rgba(255,248,231,0.6)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
          🇱🇰 Sinhala & Tamil New Year
        </p>

        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ color: '#F5A623', fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            Enter Your Name
          </h2>
          <p style={{ color: 'rgba(255,248,231,0.5)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Your name will appear on the leaderboard
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your name..."
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              maxLength={20}
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                fontSize: '1.1rem',
                borderRadius: 12,
                border: `2px solid ${error ? '#C0392B' : 'rgba(245,166,35,0.3)'}`,
                background: 'rgba(255,248,231,0.05)',
                color: '#FFF8E7',
                outline: 'none',
                marginBottom: '0.75rem',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#F5A623'; }}
              onBlur={(e) => { e.target.style.borderColor = error ? '#C0392B' : 'rgba(245,166,35,0.3)'; }}
              autoFocus
            />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#FF6B6B', fontSize: '0.85rem', marginBottom: '0.75rem', textAlign: 'left' }}
              >
                ⚠️ {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              className="btn-gold"
              style={{ width: '100%', padding: '1.1rem', fontSize: '1.1rem' }}
              whileTap={{ scale: 0.97 }}
              disabled={!name.trim()}
            >
              Let's Play! 🎉
            </motion.button>
          </form>
        </div>

        {/* Decorative */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', fontSize: '1.5rem' }}>
          {['🌺', '⭐', '🪔', '⭐', '🌺'].map((em, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            >
              {em}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
