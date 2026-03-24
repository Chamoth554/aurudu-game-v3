import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPlayerName, clearPlayerName } from '../utils/storage';
import NekathModal from '../components/NekathModal';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

function NavButton({ icon, label, onClick, disabled, variant = 'gold', badge }) {
  return (
    <motion.button
      variants={itemVariants}
      className={`btn-${variant}`}
      style={{
        width: '100%', padding: '1.2rem 1.5rem',
        fontSize: '1.1rem', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        gap: '0.75rem', position: 'relative',
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      onClick={disabled ? undefined : onClick}
    >
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <span style={{ fontWeight: 800 }}>{label}</span>
      {badge && (
        <span style={{
          position: 'absolute', top: -8, right: 12,
          background: '#C0392B', color: 'white',
          fontSize: '0.65rem', fontWeight: 700,
          padding: '2px 8px', borderRadius: 20,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {badge}
        </span>
      )}
    </motion.button>
  );
}

function CountdownTimer() {
  const targetDate = new Date('2026-04-14T09:32:00').getTime();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);

    // Defer initial update to satisfy React Compiler's purity rules
    const handle = requestAnimationFrame(() => {
      setTimeLeft(targetDate - Date.now());
    });

    return () => {
      clearInterval(timer);
      cancelAnimationFrame(handle);
    };
  }, [targetDate]);

  if (timeLeft <= 0) return null;

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const stats = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Min', value: minutes },
    { label: 'Sec', value: seconds },
  ];

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      justifyContent: 'center',
      marginBottom: '1.5rem',
      width: '100%'
    }}>
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card"
          style={{
            flex: '1 1 60px',
            aspectRatio: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,248,231,0.05)',
            padding: '0.5rem',
            minWidth: 60,
            border: '1px solid rgba(255,215,0,0.1)'
          }}
        >
          <span style={{
            fontSize: '1.2rem',
            fontWeight: 900,
            color: '#FFD700',
            fontVariantNumeric: 'tabular-nums'
          }}>
            {String(s.value).padStart(2, '0')}
          </span>
          <span style={{ fontSize: '0.6rem', color: 'rgba(255,248,231,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {s.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const playerName = getPlayerName();
  const [showNekath, setShowNekath] = useState(false);

  const handleLogout = () => {
    clearPlayerName();
    navigate('/setup', { replace: true });
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
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}
      >
        {/* Flag & emoji row */}
        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', fontSize: '2rem', marginBottom: '1rem' }}
        >
          {['🌺', '🇱🇰', '🪔', '🇱🇰', '🌺'].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
            >
              {e}
            </motion.span>
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: 'clamp(2rem, 8vw, 3rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #FFD700 0%, #F5A623 40%, #C0392B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '0.25rem',
          }}
        >
          Avurudu Games
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            color: 'rgba(255,248,231,0.55)',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
          }}
        >
          Sinhala & Tamil New Year Festival
        </motion.p>

        <motion.div
          variants={itemVariants}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
        >
          <p style={{ color: '#F5A623', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            COUNTDOWN TO NEW YEAR
          </p>
          <CountdownTimer />
        </motion.div>

        {/* Player greeting */}
        <motion.div
          variants={itemVariants}
          className="glass-card"
          style={{ padding: '0.75rem 1.25rem', marginBottom: '1.5rem', display: 'inline-block' }}
        >
          <p style={{ color: '#F5A623', fontWeight: 600, fontSize: '0.95rem' }}>
            🙏 Ayubowan, <span style={{ color: '#FFD700' }}>{playerName}</span>!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <NavButton
            icon="🎮"
            label="Play Game"
            variant="gold"
            onClick={() => navigate('/games')}
          />
          <NavButton
            icon="🏆"
            label="Leaderboard"
            variant="green"
            onClick={() => navigate('/leaderboard')}
          />
          <NavButton
            icon="🪔"
            label="Aurudu Nekath"
            variant="gold"
            onClick={() => setShowNekath(true)}
          />
          <NavButton
            icon="🍛"
            label="Aurudu Recipes"
            variant="gold"
            onClick={() => navigate('/recipes')}
          />
          <NavButton
            icon="🏆"
            label="Event Mode"
            variant="red"
            disabled
            badge="Soon"
          />
        </div>

        <NekathModal show={showNekath} onClose={() => setShowNekath(false)} />

        {/* Footer / logout */}
        <motion.button
          variants={itemVariants}
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,248,231,0.15)',
            color: 'rgba(255,248,231,0.4)',
            padding: '0.6rem 1.5rem',
            borderRadius: 10,
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
          whileHover={{ borderColor: 'rgba(255,248,231,0.3)', color: 'rgba(255,248,231,0.7)' }}
        >
          Change Player
        </motion.button>
      </motion.div>
    </div>
  );
}
