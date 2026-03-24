import { motion } from 'framer-motion';
import { getGameProgress } from '../utils/storage';
import { getLevelConfig } from '../utils/gameLevels';

export default function LevelSelector({ gameId, onSelectLevel }) {
  const progress = getGameProgress(gameId);
  const levelConfig = getLevelConfig(gameId, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 16,
        padding: '1.5rem',
        marginBottom: '1.5rem',
        backdropFilter: 'blur(8px)',
      }}
    >
      <h3 style={{
        color: '#FFD700',
        fontSize: '1rem',
        fontWeight: 700,
        marginBottom: '1rem',
      }}>
        🎯 Select Level
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '0.75rem',
      }}>
        {Array.from({ length: 10 }).map((_, idx) => {
          const level = idx + 1;
          const isUnlocked = level <= progress.unlockedLevel;
          const bestScore = progress.levelScores[level] || 0;

          return (
            <motion.button
              key={level}
              whileHover={isUnlocked ? { scale: 1.05, y: -2 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={() => isUnlocked && onSelectLevel(level)}
              disabled={!isUnlocked}
              style={{
                aspectRatio: '1 / 1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
                border: isUnlocked ? '2px solid rgba(255,215,0,0.3)' : '2px solid rgba(255,255,255,0.1)',
                background: isUnlocked
                  ? 'linear-gradient(135deg, rgba(245,166,35,0.2), rgba(255,140,0,0.1))'
                  : 'rgba(0, 0, 0, 0.4)',
                color: isUnlocked ? '#FFD700' : 'rgba(255,248,231,0.3)',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                fontSize: '0.85rem',
                fontWeight: 700,
                opacity: isUnlocked ? 1 : 0.6,
              }}
            >
              <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                {isUnlocked ? `L${level}` : '🔒'}
              </div>
              {isUnlocked && bestScore > 0 && (
                <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>
                  ✓ {bestScore}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'rgba(255,215,0,0.1)',
        borderRadius: 8,
        fontSize: '0.8rem',
        color: 'rgba(255,248,231,0.7)',
        textAlign: 'center',
      }}>
        📊 Unlocked Level: <strong>{progress.unlockedLevel}/10</strong>
      </div>
    </motion.div>
  );
}
