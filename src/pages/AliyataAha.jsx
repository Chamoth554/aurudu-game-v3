import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlayerName, saveLevelScore, unlockNextLevel, shouldShowTutorial, markTutorialShown } from '../utils/storage';
import { speak, stopSpeech } from '../utils/speech';
import ResultModal from '../components/ResultModal';
import GameTutorial from '../components/GameTutorial';
import LevelSelector from '../components/LevelSelector';
import { getLevelConfig } from '../utils/gameLevels';

const TARGET_X = 32; // % from left of elephant container
const TARGET_Y = 38; // % from top of elephant container

export default function AliyataAha() {
  const navigate = useNavigate();
  const playerName = getPlayerName();
  const gameId = 'aliyata-aha';

  // Level system
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [levelConfig, setLevelConfig] = useState(null);

  const [phase, setPhase] = useState('ready'); // ready | pointing | placed | ended
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [placedPos, setPlacedPos] = useState({ x: 0, y: 0 });
  const [drift, setDrift] = useState({ x: 0, y: 0 });
  const [levelUpMessage, setLevelUpMessage] = useState('');

  const containerRef = useRef(null);
  const requestRef = useRef();

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

  const startGame = useCallback(() => {
    speak('Game Start!');
    setPhase('pointing');
    setScore(0);
    setShowResult(false);
    setPlacedPos({ x: 0, y: 0 });
  }, []);

  // Simulate "blindfolded" drift
  useEffect(() => {
    if (phase !== 'pointing') return;

    const animateDrift = (time) => {
      setDrift({
        x: Math.sin(time / 400) * 15,
        y: Math.cos(time / 500) * 15
      });
      requestRef.current = requestAnimationFrame(animateDrift);
    };
    requestRef.current = requestAnimationFrame(animateDrift);
    return () => cancelAnimationFrame(requestRef.current);
  }, [phase]);

  const handlePlace = useCallback((e) => {
    if (phase !== 'pointing') return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;

    const relX = ((x - rect.left) / rect.width) * 100;
    const relY = ((y - rect.top) / rect.height) * 100;

    setPlacedPos({ x: relX, y: relY });
    
    // Calculate distance to target
    const dist = Math.sqrt(Math.pow(relX - TARGET_X, 2) + Math.pow(relY - TARGET_Y, 2));
    const hitScore = Math.max(0, Math.round(100 - (dist * 2.5)));
    
    setScore(hitScore);
    setPhase('placed');

    if (hitScore > 85) {
      speak('Perfect!');
    } else if (hitScore > 50) {
      speak('Good!');
    } else {
      speak('Missed!');
    }

    saveLevelScore(gameId, selectedLevel, hitScore);
    
    // Check if level is unlocked
    if (hitScore >= (levelConfig?.scoreTarget || 85)) {
      const progress = unlockNextLevel(gameId, selectedLevel);
      if (selectedLevel < progress.unlockedLevel) {
        setLevelUpMessage(`🎉 LEVEL UP! Level ${selectedLevel + 1} unlocked!`);
        speak('Level Up! Congratulations!');
      }
    }
    
    setTimeout(() => {
      setPhase('ended');
      setTimeout(() => setShowResult(true), 800);
    }, 2000);
  }, [phase, selectedLevel, levelConfig, gameId]);

  const handlePlayAgain = () => {
    setShowResult(false);
    setShowLevelSelect(true);
    setPhase('ready');
    setScore(0);
    setLevelUpMessage('');
  };

  const handlePlayNext = () => {
    setShowResult(false);
    setLevelUpMessage('');
    setSelectedLevel(selectedLevel + 1);
    setTimeout(() => setPhase('ready'), 300);
  };



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
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h2 style={{ color: '#F5A623', fontWeight: 800, fontSize: '1.5rem' }}>Aliyata Aha Tabeema</h2>
          <p style={{ color: 'rgba(255,248,231,0.5)', fontSize: '0.9rem' }}>Pin the Eye on the Elephant!</p>
        </div>
      )}

      {/* Elephant Area */}
      <div 
        ref={containerRef}
        onPointerDown={handlePlace}
        style={{
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)',
          position: 'relative',
          cursor: phase === 'pointing' ? 'crosshair' : 'default',
          background: 'rgba(255,248,231,0.03)',
          borderRadius: 20,
          border: '2px solid rgba(255,248,231,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: phase === 'pointing' ? 'blur(2px)' : 'none',
          transition: 'filter 0.5s'
        }}
      >
        <motion.div
          animate={phase === 'pointing' ? {
            x: drift.x,
            y: drift.y,
            rotate: drift.x / 5
          } : { x: 0, y: 0, rotate: 0 }}
          style={{ fontSize: 'min(60vw, 300px)', userSelect: 'none' }}
        >
          🐘
        </motion.div>

        {/* Target Marker (Only visible when placed) */}
        {phase !== 'ready' && phase !== 'pointing' && (
          <div style={{
            position: 'absolute',
            left: `${TARGET_X}%`,
            top: `${TARGET_Y}%`,
            width: 12,
            height: 12,
            background: '#4CAF50',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            border: '2px solid white',
            boxShadow: '0 0 10px #4CAF50',
            zIndex: 2
          }} />
        )}

        {/* Placed Eye */}
        {(phase === 'placed' || phase === 'ended') && (
          <motion.div
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              position: 'absolute',
              left: `${placedPos.x}%`,
              top: `${placedPos.y}%`,
              fontSize: '1.2rem',
              transform: 'translate(-50%, -50%)',
              zIndex: 3
            }}
          >
            👁️
          </motion.div>
        )}
      </div>

      {/* Instructions / Feedback */}
      <div style={{ marginTop: '2rem', textAlign: 'center', height: 100 }}>
        {phase === 'ready' && (
          <motion.button
            className="btn-gold"
            style={{ padding: '1rem 2rem' }}
            onClick={startGame}
          >
            Start Pinning!
          </motion.button>
        )}
        {phase === 'pointing' && (
          <p style={{ color: '#F5A623', fontWeight: 700, fontSize: '1.2rem' }}>TAP THE EYEBALL AREA!</p>
        )}
        {phase === 'placed' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p style={{ color: '#FFF', fontSize: '1.5rem', fontWeight: 900 }}>SCORE: {score}</p>
            <p style={{ color: 'rgba(255,248,231,0.6)' }}>
              {score > 80 ? 'Perfect!' : score > 50 ? 'Close enough!' : 'Missed it!'}
            </p>
          </motion.div>
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
        isLevelComplete={score >= (levelConfig?.scoreTarget || 85)}
        onPlayAgain={handlePlayAgain}
        onPlayNext={handlePlayNext}
        onLeaderboard={() => navigate('/leaderboard')}
        onShare={() => {}}
      />
    </div>
  );
}
