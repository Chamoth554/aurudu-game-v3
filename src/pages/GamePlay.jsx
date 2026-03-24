import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPlayerName, saveLevelScore, unlockNextLevel, shouldShowTutorial, markTutorialShown, getGameProgress } from '../utils/storage';
import { speak, stopSpeech } from '../utils/speech';
import ResultModal from '../components/ResultModal';
import GameTutorial from '../components/GameTutorial';
import LevelSelector from '../components/LevelSelector';
import { getLevelConfig } from '../utils/gameLevels';

function TimerRing({ timeLeft, totalTime }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = ((totalTime - timeLeft) / totalTime) * circumference;
  const color = timeLeft > totalTime / 2 ? '#F5A623' : timeLeft > totalTime / 4 ? '#FF8C00' : '#C0392B';

  return (
    <div style={{ position: 'relative', width: 120, height: 120 }}>
      <svg width="120" height="120" className="timer-ring" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transition={{ duration: 0.3 }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.span
          key={timeLeft}
          initial={{ scale: 1.4, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ fontSize: '2rem', fontWeight: 900, color, lineHeight: 1 }}
        >
          {timeLeft}
        </motion.span>
        <span style={{ fontSize: '0.6rem', color: 'rgba(255,248,231,0.5)', letterSpacing: '0.1em' }}>SEC</span>
      </div>
    </div>
  );
}

export default function GamePlay() {
  const navigate = useNavigate();
  const playerName = getPlayerName();
  const gameId = 'kotta-pora';

  // Level system
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [showLevelSelect, setShowLevelSelect] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [gameMaxEnergy, setGameMaxEnergy] = useState(100);
  const [scoreTarget, setScoreTarget] = useState(100); // Winning energy threshold

  const [phase, setPhase] = useState('ready'); // ready | countdown | playing | ended
  const [countdown, setCountdown] = useState(3);
  const [playerEnergy, setPlayerEnergy] = useState(gameMaxEnergy);
  const [opponentEnergy, setOpponentEnergy] = useState(gameMaxEnergy);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [hitEffects, setHitEffects] = useState([]);
  const [playerHit, setPlayerHit] = useState(false);
  const [opponentHit, setOpponentHit] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [levelUpMessage, setLevelUpMessage] = useState('');
  const [hitMessage, setHitMessage] = useState('');

  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const turnTimeoutRef = useRef(null);
  const savedRef = useRef(false);

  // Initialize level config when level is selected
  useEffect(() => {
    const config = getLevelConfig(gameId, selectedLevel);
    if (config) {
      setGameMaxEnergy(config.scoreTarget * 1.2); // Max energy increases with level
      setScoreTarget(config.scoreTarget);
      setPlayerEnergy(config.scoreTarget * 1.2);
      setOpponentEnergy(config.scoreTarget * 1.2);
    }
  }, [selectedLevel]);

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    setShowLevelSelect(false);
    setPhase('ready');
    setPlayerEnergy(gameMaxEnergy);
    setOpponentEnergy(gameMaxEnergy);
    setIsPlayerTurn(true);
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

  // Start game flow
  const startGame = useCallback(() => {
    speak('Game Start!');
    setPhase('countdown');
    setCountdown(3);
    setPlayerEnergy(gameMaxEnergy);
    setOpponentEnergy(gameMaxEnergy);
    setIsPlayerTurn(true);
    setShowResult(false);
    savedRef.current = false;

    let count = 3;
    countdownRef.current = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countdownRef.current);
        setPhase('playing');
      }
    }, 1000);
  }, [gameMaxEnergy]);

  // Check game end (someone's energy reached 0)
  useEffect(() => {
    if (phase !== 'playing') return;
    if (playerEnergy <= 0 || opponentEnergy <= 0) {
      setPhase('ended');
    }
  }, [playerEnergy, opponentEnergy, phase]);

  // Game end
  useEffect(() => {
    if (phase === 'ended' && !savedRef.current) {
      savedRef.current = true;
      
      const playerWon = opponentEnergy <= 0;
      const score = playerWon ? gameMaxEnergy + 50 : opponentEnergy;
      
      // Save level score
      saveLevelScore(gameId, selectedLevel, score);
      
      // Check if level is unlocked (must win)
      if (playerWon) {
        const progress = unlockNextLevel(gameId, selectedLevel);
        if (selectedLevel < progress.unlockedLevel) {
          setLevelUpMessage(`🎉 LEVEL UP! Level ${selectedLevel + 1} unlocked!`);
          speak('Level Up! Congratulations!');
        } else {
          speak('You won! Next level unlocked!');
        }
      } else {
        speak('Game Over! Opponent won!');
      }
      
      setTimeout(() => setShowResult(true), 600);
    }
  }, [phase, selectedLevel, gameId, gameMaxEnergy]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
      clearTimeout(turnTimeoutRef.current);
      stopSpeech();
    };
  }, []);

  const handlePlayerHit = useCallback(() => {
    if (phase !== 'playing' || !isPlayerTurn || playerHit) return;

    // Player hits opponent (random damage 8-15)
    const damage = Math.floor(Math.random() * 8) + 8;
    setOpponentEnergy(prev => Math.max(0, prev - damage));
    setPlayerHit(true);
    setHitMessage(`💥 You hit for ${damage} damage!`);
    speak(`You hit ${damage}!`);

    // Clear hit effect after animation
    setTimeout(() => {
      setPlayerHit(false);
      // AI turn after player hits
      setIsPlayerTurn(false);
      setHitMessage('');
    }, 800);
  }, [phase, isPlayerTurn, playerHit]);

  // AI automatic turn handler
  useEffect(() => {
    if (phase !== 'playing' || isPlayerTurn || opponentEnergy <= 0) return;

    clearTimeout(turnTimeoutRef.current);
    turnTimeoutRef.current = setTimeout(() => {
      const damage = Math.floor(Math.random() * 8) + 6; // Slightly less than player
      setPlayerEnergy(prev => Math.max(0, prev - damage));
      setOpponentHit(true);
      setHitMessage(`⚔️ Opponent hit for ${damage} damage!`);
      speak(`Opponent hit ${damage}!`);

      setTimeout(() => {
        setOpponentHit(false);
        setIsPlayerTurn(true);
        setHitMessage('');
      }, 800);
    }, 1200); // AI thinks for 1.2 seconds

    return () => clearTimeout(turnTimeoutRef.current);
  }, [phase, isPlayerTurn, opponentEnergy]);

  const handlePlayAgain = () => {
    setShowResult(false);
    setShowLevelSelect(true);
    setPhase('ready');
    setPlayerEnergy(gameMaxEnergy);
    setOpponentEnergy(gameMaxEnergy);
    setIsPlayerTurn(true);
    setLevelUpMessage('');
    setHitMessage('');
  };

  const handlePlayNext = () => {
    setShowResult(false);
    setLevelUpMessage('');
    setHitMessage('');
    setSelectedLevel(selectedLevel + 1);
    setTimeout(() => setPhase('ready'), 300);
  };

  const handleShare = () => {
    const text = `🔥 I scored ${score} taps in Avurudu Kotta Pora Level ${selectedLevel}! Can you beat me? 🇱🇰\nPlay at: ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({ title: 'Avurudu Games 🇱🇰', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('✅ Score copied! Share it with your friends!');
      });
    }
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

      {/* Back button during play */}
      {!showLevelSelect && phase !== 'ready' && (
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
            fontSize: '0.9rem', fontFamily: 'inherit',
          }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
      )}

      {/* READY SCREEN */}
      <AnimatePresence mode="wait">
        {!showLevelSelect && phase === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ textAlign: 'center', maxWidth: 360 }}
          >
            {/* Level Info */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'linear-gradient(135deg, rgba(245,166,35,0.2), rgba(255,140,0,0.1))',
                border: '2px solid rgba(255,215,0,0.3)',
                borderRadius: 12,
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                display: 'inline-block',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,248,231,0.6)' }}>Level {selectedLevel} of 10</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFD700' }}>
                🎯 Defeat Your Opponent
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,248,231,0.5)' }}>
                Turn-Based Combat
              </div>
            </motion.div>

            {/* 2 Men With Paddles Animation */}
            <motion.div
              style={{
                fontSize: '4.5rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '2.5rem',
                alignItems: 'flex-end',
              }}
            >
              <motion.span
                animate={{ rotateZ: [-8, 8, -8], y: [0, -5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                🧑
              </motion.span>
              <motion.span
                style={{ fontSize: '3rem' }}
                animate={{ rotateZ: [-15, 15, -15] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                🔨
              </motion.span>
              <motion.span
                animate={{ rotateZ: [8, -8, 8], y: [0, -5, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              >
                🧑
              </motion.span>
              <motion.span
                style={{ fontSize: '3rem' }}
                animate={{ rotateZ: [15, -15, 15] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
              >
                🔨
              </motion.span>
            </motion.div>

            <h1 style={{
              fontSize: 'clamp(1.8rem, 7vw, 2.5rem)',
              fontWeight: 900,
              color: '#F5A623',
              marginBottom: '0.5rem',
            }}>
              Kotta Pora
            </h1>
            <p style={{ color: 'rgba(255,248,231,0.5)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              කොට්ට පොර - Wooden Paddle Battle
            </p>
            <p style={{ color: 'rgba(255,248,231,0.7)', marginBottom: '2rem', fontSize: '1rem' }}>
              Hit faster! <strong style={{ color: '#F5A623' }}>Reduce opponent's energy to win!</strong>
            </p>

            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                {[['⚔️', 'Turn-Based', 'Mode'], ['💪', 'Energy', 'Battle'], ['🏆', 'Win', 'Type']].map(
                  ([icon, val, label]) => (
                    <div key={label}>
                      <div style={{ fontSize: '1.5rem' }}>{icon}</div>
                      <div style={{ fontWeight: 800, color: '#F5A623', fontSize: '1rem' }}>{val}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,248,231,0.4)' }}>{label}</div>
                    </div>
                  )
                )}
              </div>
            </div>

            <motion.button
              className="btn-gold"
              style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem' }}
              whileTap={{ scale: 0.97 }}
              onClick={startGame}
            >
              🎮 Start Level {selectedLevel}!
            </motion.button>

            <motion.button
              style={{
                width: '100%',
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
              ← Choose Different Level
            </motion.button>
          </motion.div>
        )}

        {/* COUNTDOWN */}
        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center' }}
          >
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              style={{
                fontSize: 'clamp(6rem, 30vw, 10rem)',
                fontWeight: 900,
                color: '#F5A623',
                lineHeight: 1,
                textShadow: '0 0 40px rgba(245,166,35,0.6)',
              }}
            >
              {countdown === 0 ? 'GO!' : countdown}
            </motion.div>
            <p style={{ color: 'rgba(255,248,231,0.6)', fontSize: '1.1rem', marginTop: '1rem' }}>
              Get ready to tap! 👊
            </p>
          </motion.div>
        )}

        {/* PLAYING */}
        {phase === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', width: '100%', maxWidth: 420 }}
          >
            {/* Header Info */}
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              left: '1.5rem',
              right: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
              color: 'rgba(255,248,231,0.6)',
            }}>
              <div>Level {selectedLevel} 🎯</div>
              <div>{isPlayerTurn ? '👉 Your Turn' : '⏳ Opponent Turn'}</div>
            </div>

            {/* Battle Arena */}
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
              {/* PLAYER (Left) */}
              <motion.div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  opacity: playerHit ? 0.7 : 1,
                }}
                animate={playerHit ? { x: [0, -20, 0], rotateZ: [-5, -15, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}
                  animate={playerHit ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  🧑
                </motion.div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: 'rgba(255,248,231,0.7)' }}>
                  YOU
                </div>

                {/* Energy Bar */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: 8,
                  height: 16,
                  overflow: 'hidden',
                  marginBottom: '0.5rem',
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                }}>
                  <motion.div
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, #22C55E, #10B981)`,
                      borderRadius: 6,
                    }}
                    animate={{ width: `${(playerEnergy / gameMaxEnergy) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Energy Text */}
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: playerEnergy > gameMaxEnergy * 0.5 ? '#22C55E' : playerEnergy > gameMaxEnergy * 0.25 ? '#FFD700' : '#FF4444',
                }}>
                  {Math.max(0, Math.round(playerEnergy))} HP
                </div>
              </motion.div>

              {/* VS */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 900,
                color: 'rgba(255,248,231,0.4)',
              }}>
                VS
              </div>

              {/* OPPONENT (Right) */}
              <motion.div
                style={{
                  flex: 1,
                  textAlign: 'center',
                  opacity: opponentHit ? 0.7 : 1,
                }}
                animate={opponentHit ? { x: [0, 20, 0], rotateZ: [5, 15, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}
                  animate={opponentHit ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  🧑
                </motion.div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.3rem', color: 'rgba(255,248,231,0.7)' }}>
                  OPPONENT
                </div>

                {/* Energy Bar */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: 8,
                  height: 16,
                  overflow: 'hidden',
                  marginBottom: '0.5rem',
                  border: '2px solid rgba(244, 63, 94, 0.3)',
                }}>
                  <motion.div
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, #F43F5E, #E11D48)`,
                      borderRadius: 6,
                    }}
                    animate={{ width: `${(opponentEnergy / gameMaxEnergy) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Energy Text */}
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: opponentEnergy > gameMaxEnergy * 0.5 ? '#F43F5E' : opponentEnergy > gameMaxEnergy * 0.25 ? '#FFD700' : '#FF4444',
                }}>
                  {Math.max(0, Math.round(opponentEnergy))} HP
                </div>
              </motion.div>
            </div>

            {/* Hit Message */}
            {hitMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  padding: '0.75rem',
                  background: isPlayerTurn ? 'rgba(34, 197, 94, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                  border: `2px solid ${isPlayerTurn ? '#22C55E' : '#F43F5E'}`,
                  borderRadius: 8,
                  marginBottom: '1.5rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: isPlayerTurn ? '#22C55E' : '#F43F5E',
                }}
              >
                {hitMessage}
              </motion.div>
            )}

            {/* HIT BUTTON - Only shows on player turn */}
            <motion.button
              style={{
                width: '100%',
                padding: '1.2rem',
                fontSize: '1.2rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #FFD700, #F5A623)',
                border: 'none',
                borderRadius: 12,
                color: '#1a1a1a',
                cursor: isPlayerTurn && !playerHit ? 'pointer' : 'not-allowed',
                opacity: isPlayerTurn && !playerHit ? 1 : 0.5,
                marginBottom: '1rem',
                display: isPlayerTurn ? 'block' : 'none',
              }}
              whileTap={isPlayerTurn && !playerHit ? { scale: 0.95 } : {}}
              onClick={handlePlayerHit}
              disabled={!isPlayerTurn || playerHit}
            >
              🔨 HIT!
            </motion.button>

            {/* Waiting for opponent */}
            {!isPlayerTurn && !opponentHit && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  padding: '1.2rem',
                  background: 'rgba(255,166,35,0.1)',
                  border: '2px dashed rgba(255,166,35,0.4)',
                  borderRadius: 12,
                  marginBottom: '1rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#F5A623',
                }}
              >
                <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  ⏳ Opponent is thinking...
                </motion.span>
              </motion.div>
            )}

            {/* Turn Indicator */}
            <motion.div
              style={{
                padding: '0.75rem',
                background: 'rgba(255,248,231,0.05)',
                border: '1px solid rgba(255,248,231,0.15)',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'rgba(255,248,231,0.6)',
              }}
            >
              {isPlayerTurn ? '👉 It\'s your turn to attack!' : '⏳ Opponent is attacking...'}
            </motion.div>
          </motion.div>
        )}

        {/* ENDED state */}
        {phase === 'ended' && !showResult && (
          <motion.div
            key="ended"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '4rem' }}>⏰</div>
            <p style={{ color: '#F5A623', fontWeight: 700, fontSize: '1.2rem' }}>Time's up!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RESULT MODAL */}
      <ResultModal
        show={showResult}
        score={opponentEnergy <= 0 ? gameMaxEnergy + 50 : opponentEnergy}
        playerName={playerName}
        targetScore={scoreTarget}
        levelMessage={levelUpMessage}
        currentLevel={selectedLevel}
        isLevelComplete={opponentEnergy <= 0}
        onPlayAgain={handlePlayAgain}
        onPlayNext={handlePlayNext}
        onLeaderboard={() => navigate('/leaderboard')}
        onShare={handleShare}
      />
    </div>
  );
}
