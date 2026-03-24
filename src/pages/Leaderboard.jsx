import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLeaderboard } from '../utils/storage';

const RANK_STYLES = [
  { emoji: '🥇', color: '#FFD700', bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.3)' },
  { emoji: '🥈', color: '#C0C0C0', bg: 'rgba(192,192,192,0.08)', border: 'rgba(192,192,192,0.2)' },
  { emoji: '🥉', color: '#CD7F32', bg: 'rgba(205,127,50,0.08)', border: 'rgba(205,127,50,0.2)' },
];

function getRankStyle(index) {
  if (index < 3) return RANK_STYLES[index];
  return { emoji: `${index + 1}`, color: 'rgba(255,248,231,0.5)', bg: 'transparent', border: 'rgba(255,248,231,0.08)' };
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

export default function Leaderboard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    setScores(getLeaderboard());
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
      {/* Back */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute', top: '1.5rem', left: '1.5rem',
          background: 'rgba(255,248,231,0.1)',
          border: '1px solid rgba(255,248,231,0.15)',
          color: '#FFF8E7', borderRadius: 12,
          padding: '0.5rem 1rem', cursor: 'pointer',
          fontSize: '0.9rem', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
        }}
        whileTap={{ scale: 0.95 }}
      >
        ← Home
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '2rem' }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
        <h1 style={{
          fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #FFD700, #F5A623)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.25rem',
        }}>
          Leaderboard
        </h1>
        <p style={{ color: 'rgba(255,248,231,0.5)', fontSize: '0.85rem' }}>
          Top 10 Avurudu Champions 🥊
        </p>
      </motion.div>

      {/* Scores */}
      {scores.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card"
          style={{ padding: '3rem 2rem', textAlign: 'center' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
          <p style={{ color: 'rgba(255,248,231,0.6)', fontSize: '1rem', marginBottom: '0.5rem' }}>
            No scores yet!
          </p>
          <p style={{ color: 'rgba(255,248,231,0.35)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Be the first Avurudu Champion!
          </p>
          <motion.button
            className="btn-gold"
            style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/games')}
          >
            🎮 Play Now!
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
        >
          {scores.map((entry, index) => {
            const rankStyle = getRankStyle(index);
            return (
              <motion.div
                key={`${entry.name}-${entry.score}-${index}`}
                variants={rowVariants}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 14,
                  background: rankStyle.bg,
                  border: `1px solid ${rankStyle.border}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Rank */}
                <div style={{
                  minWidth: 36, textAlign: 'center',
                  fontSize: index < 3 ? '1.5rem' : '1rem',
                  fontWeight: 800,
                  color: rankStyle.color,
                }}>
                  {rankStyle.emoji}
                </div>

                {/* Name */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontWeight: 700,
                    color: index === 0 ? '#FFD700' : '#FFF8E7',
                    fontSize: index === 0 ? '1.05rem' : '0.95rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {entry.name}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,248,231,0.35)', marginTop: '1px' }}>
                    {entry.date}
                  </p>
                </div>

                {/* Score */}
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    color: rankStyle.color,
                    lineHeight: 1,
                  }}>
                    {entry.score}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,248,231,0.35)' }}>taps</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* CTA */}
      {scores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}
        >
          <motion.button
            className="btn-gold"
            style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/games')}
          >
            🎮 Play Again
          </motion.button>
        </motion.div>
      )}

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '1.2rem', letterSpacing: '0.5rem' }}>
        🌺 🪔 🌺
      </div>
    </div>
  );
}
