import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlayerName, saveLevelScore, unlockNextLevel, shouldShowTutorial, markTutorialShown } from '../utils/storage';
import { speak, stopSpeech } from '../utils/speech';
import ResultModal from '../components/ResultModal';
import GameTutorial from '../components/GameTutorial';
import LevelSelector from '../components/LevelSelector';
import { getLevelConfig } from '../utils/gameLevels';

const GAME_TIME = 10;
const GRAVITY = 0.4; // % per frame approx
const CLIMB_STEP = 3.5; // % per tap

export default function LissanaGaha() {
  const navigate = useNavigate();
  const playerName = getPlayerName();
  const gameId = 'lissana-gaha';

  // Level system
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [levelConfig, setLevelConfig] = useState(null);

  const [phase, setPhase] = useState('ready'); // ready | playing | ended
  const [height, setHeight] = useState(0); // 0 to 100
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [levelUpMessage, setLevelUpMessage] = useState('');

  const timerRef = useRef();
  const gravityRef = useRef();

  // Initialize level config when level is selected
  useEffect(() => {
    const config = getLevelConfig(gameId, selectedLevel);
    if (config) {
      setLevelConfig(config);
    }
  }, [selectedLevel]);

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    setShowLevelSelect(false);
    setPhase('ready');
    setHeight(0);
    setScore(0);
    // Show tutorial AFTER level is selected
    if (shouldShowTutorial(gameId)) {
      setShowTutorial(true);
    }
  };

  const handleTutorialStart = () => {
    setShowTutorial(false);
    markTutorialShown(gameId);
    startGame();
  };

  const endGame = useCallback((finalHeight) => {
    if (phase === 'ended') return;
    setPhase('ended');
    clearInterval(timerRef.current);
    cancelAnimationFrame(gravityRef.current);

    const finalScore = Math.round(finalHeight);
    setScore(finalScore);
    
    if (finalHeight >= 100) {
      speak('Perfect! You reached the top!');
    } else {
      speak('Game Over!');
    }

    saveLevelScore(gameId, selectedLevel, finalScore);
    
    // Check if level is unlocked
    if (finalScore >= (levelConfig?.scoreTarget || 80)) {
      const progress = unlockNextLevel(gameId, selectedLevel);
      if (selectedLevel < progress.unlockedLevel) {
        setLevelUpMessage(`🎉 LEVEL UP! Level ${selectedLevel + 1} unlocked!`);
        speak('Level Up! Congratulations!');
      }
    }
    
    setTimeout(() => setShowResult(true), 800);
  }, [phase, selectedLevel, levelConfig, gameId]);

  const handlePlayAgain = () => {
    setShowResult(false);
    setShowLevelSelect(true);
    setPhase('ready');
    setScore(0);
    setHeight(0);
    setLevelUpMessage('');
  };

  const handlePlayNext = () => {
    setShowResult(false);
    setLevelUpMessage('');
    setSelectedLevel(selectedLevel + 1);
    setTimeout(() => setPhase('ready'), 300);
  };

  const startGame = useCallback(() => {
    speak('Game Start!');
    setPhase('playing');
    setHeight(0);
    setTimeLeft(GAME_TIME);
    setShowResult(false);
    setScore(0);
  }, []);

  // Gravity effect
  useEffect(() => {
    if (phase !== 'playing') return;
    
    const applyGravity = () => {
      setHeight(prev => Math.max(0, prev - GRAVITY));
      gravityRef.current = requestAnimationFrame(applyGravity);
    };
    gravityRef.current = requestAnimationFrame(applyGravity);
    
    return () => cancelAnimationFrame(gravityRef.current);
  }, [phase]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endGame(height);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, height, endGame]);

  const handleTap = useCallback(() => {
    if (phase !== 'playing') return;
    setHeight(prev => {
      const newHeight = Math.min(100, prev + CLIMB_STEP);
      if (newHeight >= 100) {
        endGame(100);
      }
      return newHeight;
    });
  }, [phase, endGame]);




  // Show tutorial if needed
  if (showTutorial) {
    return <GameTutorial game={gameId} onStart={handleTutorialStart} />;
  }

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
      overflow: 'hidden',
    }}>
      {/* Level Selector - ALWAYS VISIBLE FIRST */}
      {showLevelSelect && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 1000,
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate('/games')}
            style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              marginBottom: '1rem',
              background: 'rgba(255,248,231,0.1)',
              border: '1px solid rgba(255,248,231,0.15)',
              color: '#FFF8E7', borderRadius: 12,
              padding: '0.5rem 1rem', cursor: 'pointer',
              fontSize: '0.9rem', fontFamily: 'inherit',
            }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Games
          </motion.button>
          <div style={{ maxWidth: 500, width: '100%' }}>
            <LevelSelector gameId={gameId} onSelectLevel={handleSelectLevel} />
          </div>
        </motion.div>
      )}

      {/* Back */}
      {!showLevelSelect && phase === 'ready' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/games')}
          style={{
            position: 'absolute', top: '1.5rem', left: '1.5rem',
            background: 'rgba(255,248,231,0.1)', border: '1px solid rgba(255,248,231,0.15)',
            color: '#FFF8E7', borderRadius: 12, padding: '0.5rem 1rem', cursor: 'pointer',
          }}
        >
          ← Back
        </motion.button>
      )}

      {/* Header */}
      {!showLevelSelect && (
        <div style={{ position: 'absolute', top: '4rem', textAlign: 'center' }}>
          <h2 style={{ color: '#F5A623', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Lissana Gaha</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <p style={{ color: 'rgba(255,248,231,0.6)', fontWeight: 700 }}>⏱️ {timeLeft}s</p>
            <p style={{ color: '#F5A623', fontWeight: 900 }}>📏 {Math.round(height)}%</p>
          </div>
        </div>
      )}

      {/* Pole Area */}
      <div style={{
        height: '60vh',
        width: 120,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(255,248,231,0.02)',
        borderRadius: '60px 60px 0 0',
        paddingBottom: 20
      }}>
        {/* The Pole */}
        <div style={{
          width: 16,
          height: '100%',
          background: 'linear-gradient(90deg, #4d3319 0%, #8B4513 50%, #4d3319 100%)',
          borderRadius: 8,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* "Grease" effect */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.1)',
            filter: 'blur(2px)'
          }} />
        </div>

        {/* Flag at top */}
        <motion.div
          animate={height >= 95 ? { rotate: [0, 20, 0], scale: 1.2 } : {}}
          style={{ position: 'absolute', top: -30, fontSize: '2.5rem' }}
        >
          🚩
        </motion.div>

        {/* The Climber */}
        <motion.div
          animate={{ bottom: `${height}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'absolute',
            fontSize: '3.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.5))'
          }}
        >
          🧗‍♂️
        </motion.div>
      </div>

      {/* Ground */}
      <div style={{ 
        width: '100%', 
        maxWidth: 300, 
        height: 10, 
        background: '#5d4037', 
        borderRadius: 5,
        marginTop: -5 
      }} />

      {/* Controls */}
      <div style={{ marginTop: '2rem', width: '100%', maxWidth: 320 }}>
        {phase === 'ready' ? (
          <motion.button
            className="btn-gold"
            style={{ width: '100%', padding: '1.2rem' }}
            onClick={startGame}
          >
            Start Climbing! 🚀
          </motion.button>
        ) : (
          <motion.button
            className="tap-btn"
            style={{ width: '100%', height: 100, borderRadius: 20 }}
            onPointerDown={handleTap}
            disabled={phase !== 'playing'}
          >
            <span style={{ fontSize: '1.5rem', color: 'white', fontWeight: 900 }}>CLIMB! 👆</span>
          </motion.button>
        )}
      </div>

      {/* Level Up Message */}
      {levelUpMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: '2rem',
            background: 'rgba(245, 166, 35, 0.9)',
            color: '#000',
            padding: '1rem 2rem',
            borderRadius: 12,
            fontWeight: 900,
            fontSize: '1rem',
            zIndex: 100
          }}
        >
          {levelUpMessage}
        </motion.div>
      )}

      <ResultModal
        show={showResult}
        score={score}
        playerName={playerName}
        targetScore={levelConfig?.scoreTarget}
        levelMessage={levelUpMessage}
        currentLevel={selectedLevel}
        isLevelComplete={score >= (levelConfig?.scoreTarget || 80)}
        onPlayAgain={handlePlayAgain}
        onPlayNext={handlePlayNext}
        onLeaderboard={() => navigate('/leaderboard')}
        onShare={() => {}}
      />
    </div>
  );
}
