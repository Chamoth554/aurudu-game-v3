import { motion } from 'framer-motion';

export default function GameTutorial({ game, onStart }) {
  const tutorials = {
    'kotta-pora': {
      title: 'Kotta Pora - Tap Battle! ⚔️',
      description: 'Two warriors face off in a rapid-fire tap competition!',
      tips: [
        { icon: '👥', text: 'Two opponents sit across from each other' },
        { icon: '⏱️', text: 'Tap as fast as possible within the time limit' },
        { icon: '💪', text: 'Each tap drains opponent energy' },
        { icon: '🎯', text: 'First to knock opponent down wins!' },
        { icon: '🚀', text: 'Pro Tip: Steady, fast finger taps > random tapping' },
      ],
      visual: '🥊',
    },
    'kana-mutti': {
      title: 'Kana Mutti - Break The Pot! 🏺',
      description: 'A clay pot swings - hit it at the perfect moment!',
      tips: [
        { icon: '🏺', text: 'Pot swings left to right continuously' },
        { icon: '👁️', text: 'Watch the swing pattern carefully' },
        { icon: '💥', text: 'Tap when the pot reaches peak height' },
        { icon: '📍', text: 'Center hits score more than edge hits' },
        { icon: '🚀', text: 'Pro Tip: Timing is everything - speed won\'t help!' },
      ],
      visual: '🏺',
    },
    'aliyata-aha': {
      title: 'Aliyata Aha - Pin The Eye! 🐘',
      description: 'Blindfolded, try to place the pin on the elephant\'s eye!',
      tips: [
        { icon: '👁️', text: 'Look at elephant position carefully' },
        { icon: '🎯', text: 'Tap exactly where the eye should be' },
        { icon: '🌀', text: 'Your tap will drift - account for movement' },
        { icon: '📊', text: 'Accuracy = distance from center' },
        { icon: '🚀', text: 'Pro Tip: Tap near the center of elephant face' },
      ],
      visual: '🐘',
    },
    'lissana-gaha': {
      title: 'Lissana Gaha - Climb The Pole! 🧗',
      description: 'The pole is slippery and greasy - climb with pure determination!',
      tips: [
        { icon: '🧗', text: 'Greased pole stands tall before you' },
        { icon: '⚡', text: 'Tap rapidly to maintain grip and climb' },
        { icon: '📈', text: 'Reach the target height marked on pole' },
        { icon: '⏱️', text: 'Don\'t stop tapping or you\'ll slip down!' },
        { icon: '🚀', text: 'Pro Tip: Consistent rapid taps = steady climb' },
      ],
      visual: '🧗‍♂️',
    },
    'banis-kaema': {
      title: 'Banis Kaema - Eat The Buns! 🥯',
      description: 'Catch and eat as many flying buns as possible!',
      tips: [
        { icon: '🥯', text: 'Buns fall from the top of screen' },
        { icon: '👅', text: 'Tap on each bun to eat it quickly' },
        { icon: '💾', text: 'Each bun eaten = 1 point' },
        { icon: '⏱️', text: 'Limited time - eat as many as you can!' },
        { icon: '🚀', text: 'Pro Tip: Anticipate bun positions, tap preemptively' },
      ],
      visual: '🥯',
    },
    'kamba-adeema': {
      title: 'Kamba Adeema - Tug of War! 🤝',
      description: 'Pull the rope harder than your opponents to win!',
      tips: [
        { icon: '🤝', text: 'You pull against an opposing team' },
        { icon: '💪', text: 'Tap to pull rope harder and gain energy' },
        { icon: '🔄', text: 'Each pull reduces opponent energy' },
        { icon: '🏆', text: 'First team to pull rope all the way wins!' },
        { icon: '🚀', text: 'Pro Tip: Maintain consistent taps for steady pulling' },
      ],
      visual: '🤝',
    },
    'raban-gahmu': {
      title: 'Raban Gahmu - Play The Drum! 🥁',
      description: 'Beat the traditional Sinhala drum as fast as you can!',
      tips: [
        { icon: '🥁', text: 'Tap the drum to create rhythmic beats' },
        { icon: '🔊', text: 'Each tap plays a unique drum sound' },
        { icon: '⚡', text: 'Tap as many times as possible within time limit' },
        { icon: '📊', text: 'Reach the target beats to advance level' },
        { icon: '🚀', text: 'Pro Tip: Fast rhythmic taps score more points!' },
      ],
      visual: '🥁',
    },
  };

  const tutorial = tutorials[game] || tutorials['kotta-pora'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(2px)',
      }}
      onClick={onStart}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          background: 'linear-gradient(135deg, rgba(245,166,35,0.15), rgba(192,57,43,0.12))',
          border: '2px solid rgba(255,215,0,0.4)',
          borderRadius: 20,
          padding: '2.5rem 2rem',
          maxWidth: 480,
          margin: '1.5rem',
          textAlign: 'center',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          style={{ fontSize: '3.5rem', marginBottom: '1rem' }}
        >
          {tutorial.visual}
        </motion.div>

        <h2 style={{
          fontSize: 'clamp(1.4rem, 6vw, 2rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #FFD700, #F5A623)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.3rem',
          letterSpacing: '-0.02em',
        }}>
          {tutorial.title}
        </h2>

        <p style={{
          color: 'rgba(255,248,231,0.75)',
          marginBottom: '1.5rem',
          fontSize: '0.98rem',
          fontWeight: 500,
        }}>
          {tutorial.description}
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          marginBottom: '1.5rem',
          textAlign: 'left',
        }}>
          {tutorial.tips.map((tip, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              style={{
                padding: '0.6rem 0.75rem',
                background: 'rgba(255,248,231,0.06)',
                borderLeft: '3px solid #F5A623',
                borderRadius: 6,
                color: 'rgba(255,248,231,0.9)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{tip.icon}</span>
              <span>{tip.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          style={{
            background: 'linear-gradient(135deg, #F5A623, #FF8C00)',
            border: '2px solid rgba(255,248,231,0.3)',
            color: 'white',
            padding: '1rem 2.5rem',
            fontSize: '1.05rem',
            fontWeight: 800,
            borderRadius: 14,
            cursor: 'pointer',
            width: '100%',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            boxShadow: '0 8px 24px rgba(245,166,35,0.3)',
            transition: 'all 0.2s',
          }}
        >
          🎮 Let's Play!
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
