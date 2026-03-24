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
const PULL_STEP = 3; // % per tap
const CPU_PULL = 0.55; // % per frame approx

export default function KambaAdeema() {
  const navigate = useNavigate();
  const playerName = getPlayerName();
  const gameId = 'kamba-adeema';

  // Level system
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [levelConfig, setLevelConfig] = useState(null);

  const [phase, setPhase] = useState('ready'); // ready | playing | ended
  const [ropePos, setRopePos] = useState(50); // 0 (left-win) to 100 (right-win)
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [levelUpMessage, setLevelUpMessage] = useState('');

  const timerRef = useRef();
  const cpuRef = useRef();

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
    setScore(0);
    setRopePos(50);
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

  const handlePlayAgain = () => {
    setShowResult(false);
    setShowLevelSelect(true);
    setPhase('ready');
    setScore(0);
    setRopePos(50);
    setLevelUpMessage('');
  };

  const handlePlayNext = () => {
    setShowResult(false);
    setLevelUpMessage('');
    setSelectedLevel(selectedLevel + 1);
    setTimeout(() => setPhase('ready'), 300);
  };

  const endGame = useCallback((playerWon, finalPos) => {
    if (phase === 'ended') return;
    setPhase('ended');
    clearInterval(timerRef.current);
    cancelAnimationFrame(cpuRef.current);

    let finalScore = 0;
    if (playerWon) {
      finalScore = 50 + (timeLeft * 5);
      speak('You Win!');
    } else {
      finalScore = Math.max(0, Math.round(50 - (finalPos - 50)));
      speak('You Lost! Try Again.');
    }

    setScore(finalScore);
    saveLevelScore(gameId, selectedLevel, finalScore);
    
    // Check if level is unlocked
    if (finalScore >= (levelConfig?.scoreTarget || 50)) {
      const progress = unlockNextLevel(gameId, selectedLevel);
      if (selectedLevel < progress.unlockedLevel) {
        setLevelUpMessage(`🎉 LEVEL UP! Level ${selectedLevel + 1} unlocked!`);
        speak('Level Up! Congratulations!');
      }
    }
    
    setTimeout(() => setShowResult(true), 800);
  }, [phase, selectedLevel, levelConfig, gameId, timeLeft]);

  const startGame = useCallback(() => {
    speak('Game Start!');
    setPhase('playing');
    setRopePos(50);
    setTimeLeft(GAME_TIME);
    setShowResult(false);
    setScore(0);
  }, []);

  // CPU pull logic
  useEffect(() => {
    if (phase !== 'playing') return;
    
    const applyCPUPull = () => {
      setRopePos(prev => {
        const next = Math.min(100, prev + CPU_PULL);
        if (next >= 95) {
          endGame(false, next);
        }
        return next;
      });
      cpuRef.current = requestAnimationFrame(applyCPUPull);
    };
    cpuRef.current = requestAnimationFrame(applyCPUPull);
    
    return () => cancelAnimationFrame(cpuRef.current);
  }, [phase, endGame]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endGame(ropePos < 50, ropePos);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, ropePos, endGame]);

  const handlePull = useCallback(() => {
    if (phase !== 'playing') return;
    setRopePos(prev => {
      const next = Math.max(0, prev - PULL_STEP);
      if (next <= 5) {
        endGame(true, next);
      }
      return next;
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
        <div style={{ position: 'absolute', top: '4rem', textAlign: 'center', width: '100%' }}>
          <h2 style={{ color: '#F5A623', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Kamba Adeema</h2>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            <p style={{ color: 'rgba(255,248,231,0.6)', fontWeight: 700 }}>⏱️ {timeLeft}s</p>
            <p style={{ color: '#F5A623', fontWeight: 900 }}>TUG OF WAR</p>
          </div>
        </div>
      )}

      {/* Tug Area */}
      <div style={{ width: '100%', maxWidth: 500, position: 'relative', height: 200, display: 'flex', alignItems: 'center' }}>
        
        {/* The Rope Background Line */}
        <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.05)', position: 'absolute' }} />
        
        {/* Win Lines */}
        <div style={{ position: 'absolute', left: '10%', height: '100%', width: 2, background: 'rgba(245,166,35,0.3)' }} />
        <div style={{ position: 'absolute', right: '10%', height: '100%', width: 2, background: 'rgba(192,57,43,0.3)' }} />

        {/* The Players */}
        <div style={{ position: 'absolute', left: '5%', fontSize: '4rem', filter: ropePos > 90 ? 'grayscale(1)' : 'none' }}>👨‍🌾</div>
        <div style={{ position: 'absolute', right: '5%', fontSize: '4rem', filter: ropePos < 10 ? 'grayscale(1)' : 'none' }}>👹</div>

        {/* The Rope and Flag */}
        <motion.div
          animate={{ x: `${ropePos - 50}%` }}
          style={{
            position: 'absolute',
            width: '80%',
            left: '10%',
            height: 8,
            background: 'repeating-linear-gradient(90deg, #8B4513 0, #8B4513 10px, #A0522D 10px, #A0522D 20px)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            animate={phase === 'playing' ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ fontSize: '2.5rem', marginTop: -40 }}
          >
            🚩
          </motion.div>
        </motion.div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 400, color: 'rgba(255,248,231,0.4)', fontSize: '0.8rem', marginTop: '1rem' }}>
        <span>YOU</span>
        <span>CPU</span>
      </div>

      {/* Controls */}
      <div style={{ marginTop: '3rem', width: '100%', maxWidth: 320 }}>
        {phase === 'ready' ? (
          <motion.button
            className="btn-gold"
            style={{ width: '100%', padding: '1.2rem' }}
            onClick={startGame}
          >
            Start Pulling! 🤝
          </motion.button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <motion.button
              className="tap-btn"
              style={{ 
                width: '100%', 
                height: 120, 
                borderRadius: '50% 50% 20% 20%',
                background: 'linear-gradient(135deg, #1A7A4A, #F5A623)'
              }}
              onPointerDown={handlePull}
              disabled={phase !== 'playing'}
            >
              <span style={{ fontSize: '1.8rem', color: 'white', fontWeight: 900 }}>PULL! 🤝</span>
            </motion.button>
            <p style={{ textAlign: 'center', color: 'rgba(255,248,231,0.4)', fontSize: '0.8rem' }}>Tap as fast as you can!</p>
          </div>
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
        isLevelComplete={score >= (levelConfig?.scoreTarget || 50)}
        onPlayAgain={handlePlayAgain}
        onPlayNext={handlePlayNext}
        onLeaderboard={() => navigate('/leaderboard')}
        onShare={() => {}}
      />
    </div>
  );
}
