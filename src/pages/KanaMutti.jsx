import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlayerName, saveLevelScore, unlockNextLevel, shouldShowTutorial, markTutorialShown } from '../utils/storage';
import { speak, stopSpeech } from '../utils/speech';
import ResultModal from '../components/ResultModal';
import GameTutorial from '../components/GameTutorial';
import LevelSelector from '../components/LevelSelector';
import { getLevelConfig } from '../utils/gameLevels';

export default function KanaMutti() {
  const navigate = useNavigate();
  const playerName = getPlayerName();
  const gameId = 'kana-mutti';

  // Level system
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [levelConfig, setLevelConfig] = useState(null);

  const [phase, setPhase] = useState('ready'); // ready | playing | break | ended
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isHitting, setIsHitting] = useState(false);
  const [lastHitScore, setLastHitScore] = useState(null);
  const [levelUpMessage, setLevelUpMessage] = useState('');

  const containerRef = useRef(null);
  const potRef = useRef(null);

  // Initialize level config
  useEffect(() => {
    const config = getLevelConfig(gameId, selectedLevel);
    if (config) {
      setLevelConfig(config);
      setAttemptsLeft(config.attempts || 3);
    }
  }, [selectedLevel]);

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    setShowLevelSelect(false);
    setPhase('ready');
    setTotalScore(0);
    setIsHitting(false);
    setLastHitScore(null);
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
    setPhase('playing');
    setAttemptsLeft(levelConfig?.attempts || 3);
    setTotalScore(0);
    setShowResult(false);
  }, [levelConfig]);

  const handleHit = useCallback(() => {
    if (phase !== 'playing' || isHitting) return;

    setIsHitting(true);
    
    // Calculate hit accuracy
    // In a real app we'd measure the pot's X position relative to the center marker
    // Here we'll simulate it based on the current animation state if possible, 
    // but for a web game, we'll just check the pot's bounding box center relative to market center.
    
    const pot = potRef.current;
    const container = containerRef.current;
    if (!pot || !container) return;

    const potRect = pot.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const potCenter = potRect.left + potRect.width / 2;
    const markerCenter = containerRect.left + containerRect.width / 2;
    
    const diff = Math.abs(potCenter - markerCenter);
    const maxDiff = containerRect.width / 2;
    const accuracy = Math.max(0, 1 - (diff / (maxDiff * 0.4))); // Quite strict
    const hitScore = Math.round(accuracy * 100);

    setLastHitScore(hitScore);
    setTotalScore(prev => prev + hitScore);
    
    if (hitScore > 70) {
      speak('Perfect!');
    } else if (hitScore > 0) {
      speak('Good!');
    } else {
      speak('Missed!');
    }

    setPhase('break');

    setTimeout(() => {
      if (attemptsLeft > 1) {
        setAttemptsLeft(prev => prev - 1);
        setPhase('playing');
        setIsHitting(false);
      } else {
        setAttemptsLeft(0);
        setPhase('ended');
        
        // Save level score
        saveLevelScore(gameId, selectedLevel, totalScore + hitScore);
        
        // Check if level is unlocked
        if (totalScore + hitScore >= (levelConfig?.scoreTarget || 150)) {
          const progress = unlockNextLevel(gameId, selectedLevel);
          if (selectedLevel < progress.unlockedLevel) {
            setLevelUpMessage(`🎉 LEVEL UP! Level ${selectedLevel + 1} unlocked!`);
            speak('Level Up! Congratulations!');
          }
        }
        
        setTimeout(() => setShowResult(true), 800);
      }
    }, 1500);
  }, [phase, isHitting, attemptsLeft, totalScore, selectedLevel, levelConfig, gameId]);

  const handlePlayAgain = () => {
    setShowResult(false);
    setShowLevelSelect(true);
    setPhase('ready');
    setTotalScore(0);
    setIsHitting(false);
    setLastHitScore(null);
    setLevelUpMessage('');
  };

  const handlePlayNext = () => {
    setShowResult(false);
    setLevelUpMessage('');
    setSelectedLevel(selectedLevel + 1);
    setPhase('ready');
    setTotalScore(0);
    setIsHitting(false);
    setLastHitScore(null);
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
      overflow: 'hidden',
    }}>
      {/* Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && <GameTutorial game={gameId} onStart={handleTutorialStart} />}
      </AnimatePresence>

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

      {/* Back button - Only when level is selected */}
      {!showLevelSelect && phase === 'ready' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/games')}
          style={{
            position: 'absolute', top: '1.5rem', left: '1.5rem',
            background: 'rgba(255,248,231,0.1)',
            border: '1px solid rgba(255,248,231,0.15)',
            color: '#FFF8E7', borderRadius: 12,
            padding: '0.5rem 1rem', cursor: 'pointer',
          }}
        >
          ← Back
        </motion.button>
      )}

      {/* Header Info - Only when level is selected and playing */}
      {!showLevelSelect && phase !== 'ready' && (
        <div style={{ position: 'absolute', top: '1.5rem', textAlign: 'center', width: '100%' }}>
          <h2 style={{ color: '#C0392B', fontWeight: 800, fontSize: '1.5rem' }}>
            Kana Mutti - Level {selectedLevel}
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            {Array.from({ length: levelConfig?.attempts || 3 }).map((_, i) => (
              <span key={i} style={{ fontSize: '1.2rem', opacity: i < attemptsLeft ? 1 : 0.2 }}>🏺</span>
            ))}
          </div>
          <p style={{ color: 'white', fontWeight: 900, fontSize: '2rem', marginTop: '0.5rem' }}>{totalScore}</p>
          {levelConfig && (
            <p style={{ color: 'rgba(255,248,231,0.6)', fontSize: '0.85rem' }}>
              Target: {levelConfig.scoreTarget}
            </p>
          )}
        </div>
      )}

      {/* Ready Screen */}
      {!showLevelSelect && phase === 'ready' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', marginTop: '2rem' }}
        >
          <motion.div
            style={{ fontSize: '4rem', marginBottom: '1rem' }}
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏺
          </motion.div>
          <h1 style={{ fontSize: '1.8rem', color: '#C0392B', fontWeight: 900, marginBottom: '1rem' }}>
            Break the Pot!
          </h1>
          <p style={{ color: 'rgba(255,248,231,0.7)', marginBottom: '2rem' }}>
            Level {selectedLevel} - Time attacks: {levelConfig?.time}s, Score target: {levelConfig?.scoreTarget}
          </p>
          <motion.button
            className="btn-gold"
            style={{ width: '100%', padding: '1.2rem', maxWidth: 200 }}
            whileTap={{ scale: 0.97 }}
            onClick={startGame}
          >
            🎮 Start Level {selectedLevel}!
          </motion.button>
          <motion.button
            style={{
              width: '100%',
              maxWidth: 200,
              padding: '0.75rem',
              marginTop: '0.75rem',
              fontSize: '0.95rem',
              background: 'rgba(255,248,231,0.1)',
              border: '1px solid rgba(255,248,231,0.15)',
              color: '#FFF8E7',
              borderRadius: 12,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowLevelSelect(true)}
          >
            ← Change Level
          </motion.button>
        </motion.div>
      )}

      {/* Game Area */}
      <div 
        ref={containerRef}
        style={{ 
          width: '100%', 
          maxWidth: 400, 
          height: 300, 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderBottom: '4px solid rgba(255,255,255,0.1)',
          marginTop: showLevelSelect ? 0 : '5rem',
        }}
      >
        {/* Support Pole (Visual) */}
        <div style={{ position: 'absolute', top: 0, width: '100%', height: 2, background: 'rgba(255,255,255,0.2)' }} />
        
        {/* Swinging Pot */}
        <motion.div
          ref={potRef}
          animate={phase === 'playing' ? {
            x: [-150, 150],
            rotate: [-15, 15]
          } : {}}
          transition={{
            x: { duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
            rotate: { duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
          }}
          style={{
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Rope */}
          <div style={{ width: 2, height: 120, background: '#8B4513' }} />
          {/* Pot */}
          <motion.div
            animate={phase === 'break' ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] } : { scale: 1, opacity: 1 }}
            style={{ 
              fontSize: '4rem', 
              marginTop: -10,
              filter: isHitting ? 'brightness(1.5)' : 'none'
            }}
          >
            🏺
          </motion.div>
        </motion.div>

        {/* Marker */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 4,
          height: 60,
          background: '#F5A623',
          boxShadow: '0 0 10px #F5A623',
          zIndex: 2
        }} />
        <div style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.2rem'
        }}>
          👇
        </div>
      </div>

      {/* Hit Feedback */}
      <AnimatePresence>
        {phase === 'break' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: '1rem',
              fontSize: '2rem',
              fontWeight: 900,
              color: lastHitScore > 70 ? '#FFD700' : '#FFF'
            }}
          >
            {lastHitScore > 70 ? 'PERFECT! 💥' : lastHitScore > 40 ? 'GREAT! ✨' : lastHitScore > 0 ? 'HITS! 👍' : 'MISSED! 💨'}
            <div style={{ fontSize: '1rem', textAlign: 'center' }}>+{lastHitScore}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div style={{ marginTop: '3rem', width: '100%', maxWidth: 300 }}>
        {phase === 'ready' ? (
          <motion.button
            className="btn-gold"
            style={{ width: '100%', padding: '1.2rem' }}
            onClick={startGame}
          >
            Start Game
          </motion.button>
        ) : (
          <motion.button
            className="tap-btn"
            style={{ width: '100%', height: 80, borderRadius: 16 }}
            onPointerDown={handleHit}
            disabled={phase !== 'playing'}
          >
            <span style={{ fontSize: '2rem', color: 'white' }}>Strike! 👊</span>
          </motion.button>
        )}
      </div>

      <ResultModal
        show={showResult}
        score={totalScore}
        playerName={playerName}
        targetScore={levelConfig?.scoreTarget || 150}
        levelMessage={levelUpMessage}
        currentLevel={selectedLevel}
        isLevelComplete={totalScore >= (levelConfig?.scoreTarget || 150)}
        onPlayAgain={handlePlayAgain}
        onPlayNext={handlePlayNext}
        onLeaderboard={() => navigate('/leaderboard')}
        onShare={() => {}}
      />
    </div>
  );
}
