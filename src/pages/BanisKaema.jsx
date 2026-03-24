import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlayerName, saveLevelScore, unlockNextLevel, shouldShowTutorial, markTutorialShown } from '../utils/storage';
import { speak, stopSpeech } from '../utils/speech';
import ResultModal from '../components/ResultModal';
import GameTutorial from '../components/GameTutorial';
import LevelSelector from '../components/LevelSelector';
import { getLevelConfig } from '../utils/gameLevels';

const GAME_TIME = 15;
const INITIAL_SPEED = 1.2;

export default function BanisKaema() {
  const navigate = useNavigate();
  const playerName = getPlayerName();
  const gameId = 'banis-kaema';

  // Level system
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [levelConfig, setLevelConfig] = useState(null);

  const [phase, setPhase] = useState('ready'); // ready | playing | ended
  const [bunsEaten, setBunsEaten] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [showResult, setShowResult] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isBiting, setIsBiting] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState('');

  const timerRef = useRef();
  const bunRef = useRef();
  const mouthRef = useRef();

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
    setBunsEaten(0);
    setIsBiting(false);
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
    setBunsEaten(0);
    setIsBiting(false);
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
    setBunsEaten(0);
    setTimeLeft(GAME_TIME);
    setShowResult(false);
    setSpeed(INITIAL_SPEED);
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setPhase('ended');
          saveLevelScore(gameId, selectedLevel, bunsEaten);
          
          // Check if level is unlocked
          if (bunsEaten >= (levelConfig?.scoreTarget || 10)) {
            const progress = unlockNextLevel(gameId, selectedLevel);
            if (selectedLevel < progress.unlockedLevel) {
              setLevelUpMessage(`🎉 LEVEL UP! Level ${selectedLevel + 1} unlocked!`);
              speak('Level Up! Congratulations!');
            }
          }
          
          setTimeout(() => setShowResult(true), 800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, bunsEaten, selectedLevel, levelConfig, gameId]);

  const handleBite = useCallback(() => {
    if (phase !== 'playing' || isBiting) return;

    setIsBiting(true);
    
    // Check collision
    const bun = bunRef.current.getBoundingClientRect();
    const mouth = mouthRef.current.getBoundingClientRect();

    const bunCenter = bun.left + bun.width / 2;
    const mouthCenter = mouth.left + mouth.width / 2;
    
    // Check if bun is roughly centered above the mouth
    const tolerance = 40; // px
    if (Math.abs(bunCenter - mouthCenter) < tolerance) {
      setBunsEaten(prev => prev + 1);
      setSpeed(prev => Math.max(0.4, prev - 0.05)); // Increase speed by reducing duration
      speak('Yum!');
    } else {
      speak('Missed!');
    }

    setTimeout(() => setIsBiting(false), 300);
  }, [phase, isBiting]);



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
          <h2 style={{ color: '#F5A623', fontWeight: 800, fontSize: '1.5rem' }}>Banis Kaema</h2>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            <p style={{ color: 'rgba(255,248,231,0.6)', fontWeight: 700 }}>⏱️ {timeLeft}s</p>
            <p style={{ color: '#F5A623', fontWeight: 900 }}>🥯 {bunsEaten}</p>
          </div>
        </div>
      )}

      {/* Game Area */}
      <div style={{
        height: '50vh',
        width: '100%',
        maxWidth: 400,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: '2rem'
      }}>
        {/* Support Line */}
        <div style={{ width: '100%', height: 2, background: 'rgba(255,255,255,0.1)', position: 'absolute', top: 0 }} />

        {/* Swinging Bun */}
        <motion.div
          key={bunsEaten} // Reset animation on eat
          ref={bunRef}
          animate={phase === 'playing' ? {
            rotate: [-45, 45],
            x: [-120, 120]
          } : {}}
          transition={{
            duration: speed,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transformOrigin: 'top center'
          }}
        >
          {/* String */}
          <div style={{ width: 1, height: 200, background: '#FFFAD0' }} />
          {/* Bun */}
          <div style={{ 
            fontSize: '4.5rem', 
            marginTop: -15,
            filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))'
          }}>
            🥯
          </div>
        </motion.div>

        {/* Mouth / Target */}
        <div 
          ref={mouthRef}
          style={{
            position: 'absolute',
            bottom: 20,
            fontSize: isBiting ? '5.5rem' : '4.5rem',
            transition: 'font-size 0.1s',
            zIndex: 2,
            filter: isBiting ? 'brightness(1.5)' : 'none'
          }}
        >
          {isBiting ? '👄' : '😮'}
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginTop: '2rem', width: '100%', maxWidth: 320 }}>
        {phase === 'ready' ? (
          <motion.button
            className="btn-gold"
            style={{ width: '100%', padding: '1.2rem' }}
            onClick={startGame}
          >
            Start Eating! 🥯
          </motion.button>
        ) : (
          <motion.button
            className="tap-btn"
            style={{ 
              width: '100%', 
              height: 100, 
              borderRadius: 20,
              background: 'linear-gradient(135deg, #F5A623, #C0392B)'
            }}
            onPointerDown={handleBite}
            disabled={phase !== 'playing'}
          >
            <span style={{ fontSize: '1.5rem', color: 'white', fontWeight: 900 }}>BITE! 👄</span>
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
        score={bunsEaten}
        playerName={playerName}
        targetScore={levelConfig?.scoreTarget}
        levelMessage={levelUpMessage}
        currentLevel={selectedLevel}
        isLevelComplete={bunsEaten >= (levelConfig?.scoreTarget || 10)}
        onPlayAgain={handlePlayAgain}
        onPlayNext={handlePlayNext}
        onLeaderboard={() => navigate('/leaderboard')}
        onShare={() => {}}
      />
    </div>
  );
}
