import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const MEDALS = ['🥇', '🥈', '🥉'];

function getMotivation(score, targetScore, isLevelComplete) {
  if (isLevelComplete) {
    if (score >= targetScore * 2) return { text: 'PERFECT! ⭐', sub: 'You absolutely crushed it!' };
    if (score >= targetScore * 1.5) return { text: 'AMAZING! 🎉', sub: 'Level unlocked! Well done!' };
    return { text: 'LEVEL UP! 🌟', sub: 'Next level is now available!' };
  }
  
  if (score >= targetScore * 0.75) return { text: 'SO CLOSE! 😊', sub: 'Try again for the next level!' };
  if (score >= targetScore * 0.5) return { text: 'GOOD TRY! 💪', sub: 'You\'re getting there!' };
  return { text: 'KEEP GOING! 🌟', sub: 'Practice makes perfect!' };
}

export default function ResultModal({ 
  score, 
  playerName, 
  targetScore = 30,
  isLevelComplete = false,
  levelMessage = '',
  currentLevel = 1,
  onPlayAgain, 
  onPlayNext,
  onLeaderboard, 
  onShare, 
  show 
}) {
  const hasLaunched = useRef(false);
  const { text, sub } = getMotivation(score, targetScore, isLevelComplete);

  useEffect(() => {
    if (show && !hasLaunched.current) {
      hasLaunched.current = true;
      
      // More confetti for level complete
      const duration = isLevelComplete ? 4000 : 3000;
      const particleMultiplier = isLevelComplete ? 2 : 1;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4 * particleMultiplier,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: isLevelComplete ? ['#FFD700', '#22C55E', '#F5A623'] : ['#F5A623', '#FFD700', '#C0392B', '#1A7A4A'],
        });
        confetti({
          particleCount: 4 * particleMultiplier,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: isLevelComplete ? ['#FFD700', '#22C55E', '#F5A623'] : ['#F5A623', '#FFD700', '#C0392B', '#1A7A4A'],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
    return () => { hasLaunched.current = false; };
  }, [show, isLevelComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card"
            initial={{ scale: 0.5, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{ width: '100%', maxWidth: 400, padding: '2.5rem 2rem', textAlign: 'center' }}
          >
            {/* Trophy */}
            <motion.div
              style={{
                fontSize: '4rem',
                marginBottom: '0.5rem',
              }}
              animate={isLevelComplete ? 
                { rotate: [-10, 10, -10, 10, -10], scale: [1, 1.15, 1, 1.15, 1] } :
                { rotate: [-10, 10, -10], scale: [1, 1.1, 1] }
              }
              transition={{ duration: isLevelComplete ? 2 : 1.5, repeat: Infinity }}
            >
              {isLevelComplete ? '⭐' : '🏆'}
            </motion.div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F5A623', marginBottom: '0.25rem' }}>
              {text}
            </h2>
            <p style={{ color: 'rgba(255,248,231,0.7)', marginBottom: '1rem', fontSize: '0.9rem' }}>{sub}</p>

            {/* Level Up Message */}
            {levelMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(76, 175, 80, 0.1))',
                  border: '2px solid #22C55E',
                  borderRadius: 12,
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#22C55E',
                }}
              >
                {levelMessage}
              </motion.div>
            )}

            {/* Score display */}
            <div style={{
              background: 'rgba(245,166,35,0.15)',
              border: '2px solid rgba(245,166,35,0.4)',
              borderRadius: 16,
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <p style={{ color: 'rgba(255,248,231,0.6)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    Level
                  </p>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#FFD700' }}>
                    {currentLevel}
                  </div>
                </div>
                <div>
                  <p style={{ color: 'rgba(255,248,231,0.6)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    Target
                  </p>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: isLevelComplete ? '#22C55E' : '#FF8C00' }}>
                    {targetScore}
                  </div>
                </div>
              </div>
              <p style={{ color: 'rgba(255,248,231,0.6)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                {playerName}'s Score
              </p>
              <motion.p
                style={{ fontSize: '4rem', fontWeight: 900, color: '#FFD700', lineHeight: 1 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                {score}
              </motion.p>
              <p style={{ color: 'rgba(255,248,231,0.5)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {isLevelComplete ? '✅ Level Complete!' : 'taps needed'}
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <motion.button
                className={isLevelComplete ? 'btn-green' : 'btn-gold'}
                style={{ 
                  padding: '1rem', 
                  fontSize: '1.1rem', 
                  width: '100%',
                  background: isLevelComplete ? 'linear-gradient(135deg, #22C55E, #16A34A)' : undefined,
                }}
                whileTap={{ scale: 0.96 }}
                onClick={isLevelComplete ? (onPlayNext || onPlayAgain) : onPlayAgain}
              >
                {isLevelComplete ? '⏭️ Play Next Level' : '🔄 Play Again'}
              </motion.button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <motion.button
                  className="btn-blue"
                  style={{ padding: '0.85rem', fontSize: '0.95rem' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onShare}
                >
                  📤 Share
                </motion.button>
                <motion.button
                  className="btn-red"
                  style={{ padding: '0.85rem', fontSize: '0.95rem' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onLeaderboard}
                >
                  🏆 Board
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
