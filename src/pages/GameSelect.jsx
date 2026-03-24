import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { getGameProgress, initializeLevelProgress } from '../utils/storage';

const games = [
  {
    id: 'kotta-pora',
    emoji: '🥊',
    name: 'Kotta Pora',
    nameSi: 'කොට්ට පොර',
    desc: 'Tap as fast as you can in 10 seconds!',
    status: 'active',
    path: '/play/kotta-pora',
    color: '#F5A623',
    glowColor: 'rgba(245,166,35,0.3)',
  },
  {
    id: 'kana-mutti',
    emoji: '🏺',
    name: 'Kana Mutti',
    nameSi: 'කන මුට්ටිය',
    desc: 'Break the pot! Timing is everything.',
    status: 'active',
    path: '/play/kana-mutti',
    color: '#C0392B',
    glowColor: 'rgba(192, 57, 43, 0.3)',
  },
  {
    id: 'aliyata-aha',
    emoji: '🐘',
    name: 'Aliyata Aha',
    nameSi: 'අලියාට ඇස තැබීම',
    desc: 'Pin the eye on the elephant!',
    status: 'active',
    path: '/play/aliyata-aha',
    color: '#3498DB',
    glowColor: 'rgba(52, 152, 219, 0.3)',
  },
  {
    id: 'lissana-gaha',
    emoji: '🧗‍♂️',
    name: 'Lissana Gaha',
    nameSi: 'ලිස්සන ගහ',
    desc: 'Climb the greasy pole! Tap rapidly!',
    status: 'active',
    path: '/play/lissana-gaha',
    color: '#1A7A4A',
    glowColor: 'rgba(26, 122, 74, 0.3)',
  },
  {
    id: 'banis-kaema',
    emoji: '🥯',
    name: 'Banis Kaema',
    nameSi: 'බනිස් කෑම',
    desc: 'Eat as many buns as you can!',
    status: 'active',
    path: '/play/banis-kaema',
    color: '#F1C40F',
    glowColor: 'rgba(241, 196, 15, 0.3)',
  },
  {
    id: 'kamba-adeema',
    emoji: '🤝',
    name: 'Kamba Adeema',
    nameSi: 'කඹ ඇදීම',
    desc: 'Tug of war! Pull for victory!',
    status: 'active',
    path: '/play/kamba-adeema',
    color: '#E67E22',
    glowColor: 'rgba(230, 126, 34, 0.3)',
  },
  {
    id: 'raban-gahmu',
    emoji: '🥁',
    name: 'Raban Gahmu',
    nameSi: 'රටබණ ගහමු',
    desc: 'Beat the traditional drum faster!',
    status: 'active',
    path: '/play/raban-gahmu',
    color: '#D2691E',
    glowColor: 'rgba(210, 105, 30, 0.3)',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

export default function GameSelect() {
  const navigate = useNavigate();
  
  // Initialize level progress on mount
  useEffect(() => {
    initializeLevelProgress();
  }, []);

  return (
    <div style={{
      minHeight: '100dvh',
      padding: '1.5rem',
      paddingTop: '3.5rem',
      position: 'relative',
      zIndex: 1,
      maxWidth: 500,
      margin: '0 auto',
    }}>
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          background: 'rgba(255,248,231,0.1)',
          border: '1px solid rgba(255,248,231,0.15)',
          color: '#FFF8E7',
          borderRadius: 12,
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '2rem' }}
      >
        <h1 style={{
          fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #FFD700, #F5A623)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.25rem',
        }}>
          Choose a Game
        </h1>
        <p style={{ color: 'rgba(255,248,231,0.5)', fontSize: '0.9rem' }}>
          Select your Avurudu game 🎊
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {games.map((game) => {
          const isActive = game.status === 'active';
          const isSoon = game.status === 'soon';
          const isLocked = game.status === 'locked';
          
          // Get level progress for this game
          const progress = getGameProgress(game.id);
          const unlockedLevel = progress?.unlockedLevel || 1;

          return (
            <motion.div
              key={game.id}
              variants={cardVariants}
              className="glass-card"
              style={{
                padding: '1.5rem',
                cursor: isActive ? 'pointer' : 'not-allowed',
                borderColor: `1px solid ${game.color}40`,
                opacity: isLocked ? 0.5 : 1,
                position: 'relative',
                overflow: 'hidden',
              }}
              whileHover={isActive ? { scale: 1.02, boxShadow: `0 8px 40px ${game.glowColor}` } : {}}
              whileTap={isActive ? { scale: 0.98 } : {}}
              onClick={() => isActive && navigate(game.path)}
            >
              {/* Glow background */}
              {isActive && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(circle at 20% 50%, ${game.glowColor} 0%, transparent 60%)`,
                  pointerEvents: 'none',
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
                <motion.div
                  style={{ fontSize: '3rem', flexShrink: 0 }}
                  animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {game.emoji}
                </motion.div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <h3 style={{ fontWeight: 800, color: '#FFF8E7', fontSize: '1.1rem' }}>{game.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,248,231,0.4)' }}>{game.nameSi}</span>
                  </div>
                  <p style={{ color: 'rgba(255,248,231,0.6)', fontSize: '0.85rem' }}>{game.desc}</p>
                  
                  {/* Level Progress Bar */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      color: 'rgba(255,248,231,0.5)',
                    }}>
                      <span>📊 Level {unlockedLevel}/10</span>
                    </div>
                    <div style={{
                      height: 4,
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      overflow: 'hidden',
                      marginTop: '0.25rem',
                    }}>
                      <motion.div
                        style={{
                          height: '100%',
                          background: `linear-gradient(90deg, ${game.color}, ${game.color}88)`,
                          borderRadius: 2,
                        }}
                        animate={{ width: `${(unlockedLevel / 10) * 100}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <div style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: 20,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  flexShrink: 0,
                  ...(isActive
                    ? { background: 'rgba(26,122,74,0.3)', color: '#4CAF50', border: '1px solid rgba(76,175,80,0.4)' }
                    : isSoon
                    ? { background: 'rgba(245,166,35,0.2)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.1)' }
                  ),
                }}>
                  {isActive ? '▶ Play' : isSoon ? 'Soon' : '🔒'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Decorative row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.4rem', letterSpacing: '0.5rem' }}
      >
        🌺 🪔 ⭐ 🪔 🌺
      </motion.div>
    </div>
  );
}
