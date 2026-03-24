// Game level configurations with difficulty scaling
// Time decreases, score target increases per level

export const LEVEL_CONFIGS = {
  'kotta-pora': {
    name: 'Kotta Pora',
    levels: {
      1: { time: 15, scoreTarget: 30, description: 'Tap fast!' },
      2: { time: 14, scoreTarget: 35, description: 'Go faster!' },
      3: { time: 13, scoreTarget: 40, description: 'Keep it up!' },
      4: { time: 12, scoreTarget: 45, description: 'Getting harder!' },
      5: { time: 11, scoreTarget: 50, description: 'Intense!' },
      6: { time: 10, scoreTarget: 55, description: 'Master tap!' },
      7: { time: 9, scoreTarget: 60, description: 'Lightning fast!' },
      8: { time: 8, scoreTarget: 65, description: 'Ultimate speed!' },
      9: { time: 7, scoreTarget: 70, description: 'Max challenge!' },
      10: { time: 6, scoreTarget: 80, description: 'Legendary!' },
    },
  },
  'kana-mutti': {
    name: 'Kana Mutti',
    levels: {
      1: { attempts: 3, time: 5, scoreTarget: 150, description: 'Break the pot!' },
      2: { attempts: 3, time: 5, scoreTarget: 180, description: 'Pot moves faster!' },
      3: { attempts: 3, time: 4, scoreTarget: 210, description: 'Faster swing!' },
      4: { attempts: 3, time: 4, scoreTarget: 240, description: 'More speed!' },
      5: { attempts: 3, time: 3, scoreTarget: 270, description: 'High difficulty!' },
      6: { attempts: 2, time: 3, scoreTarget: 300, description: 'Less attempts!' },
      7: { attempts: 2, time: 3, scoreTarget: 330, description: 'Precision needed!' },
      8: { attempts: 2, time: 2, scoreTarget: 360, description: 'Expert level!' },
      9: { attempts: 1, time: 2, scoreTarget: 390, description: 'One shot!' },
      10: { attempts: 1, time: 2, scoreTarget: 420, description: 'Perfect hit!' },
    },
  },
  'aliyata-aha': {
    name: 'Aliyata Aha',
    levels: {
      1: { time: 10, attempts: 3, scoreTarget: 100, description: 'Pin the eye!' },
      2: { time: 9, attempts: 3, scoreTarget: 120, description: 'Precision matters!' },
      3: { time: 8, attempts: 3, scoreTarget: 140, description: 'Smaller target!' },
      4: { time: 7, attempts: 3, scoreTarget: 160, description: 'Accuracy skills!' },
      5: { time: 6, attempts: 2, scoreTarget: 180, description: 'Master aimer!' },
      6: { time: 5, attempts: 2, scoreTarget: 200, description: 'Tough challenge!' },
      7: { time: 5, attempts: 2, scoreTarget: 220, description: 'Extreme focus!' },
      8: { time: 4, attempts: 1, scoreTarget: 240, description: 'One chance!' },
      9: { time: 3, attempts: 1, scoreTarget: 260, description: 'Legendary aim!' },
      10: { time: 3, attempts: 1, scoreTarget: 300, description: 'Perfect precision!' },
    },
  },
  'lissana-gaha': {
    name: 'Lissana Gaha',
    levels: {
      1: { time: 12, scoreTarget: 50, description: 'Climb the pole!' },
      2: { time: 11, scoreTarget: 60, description: 'Faster climb!' },
      3: { time: 10, scoreTarget: 70, description: 'Slippery pole!' },
      4: { time: 9, scoreTarget: 80, description: 'Keep climbing!' },
      5: { time: 8, scoreTarget: 90, description: 'Rapid tapping!' },
      6: { time: 7, scoreTarget: 100, description: 'Expert climber!' },
      7: { time: 6, scoreTarget: 110, description: 'Extreme climb!' },
      8: { time: 5, scoreTarget: 120, description: 'Master climber!' },
      9: { time: 4, scoreTarget: 130, description: 'Lightning fingers!' },
      10: { time: 3, scoreTarget: 150, description: 'Peak champion!' },
    },
  },
  'banis-kaema': {
    name: 'Banis Kaema',
    levels: {
      1: { time: 12, scoreTarget: 5, description: 'Eat the buns!' },
      2: { time: 11, scoreTarget: 6, description: 'Faster eating!' },
      3: { time: 10, scoreTarget: 7, description: 'More buns!' },
      4: { time: 9, scoreTarget: 8, description: 'Hungry challenge!' },
      5: { time: 8, scoreTarget: 9, description: 'Feast time!' },
      6: { time: 7, scoreTarget: 10, description: 'Speed eater!' },
      7: { time: 6, scoreTarget: 11, description: 'Master appetite!' },
      8: { time: 5, scoreTarget: 12, description: 'Extreme hunger!' },
      9: { time: 4, scoreTarget: 13, description: 'Legendary eater!' },
      10: { time: 3, scoreTarget: 15, description: 'Bun champion!' },
    },
  },
  'kamba-adeema': {
    name: 'Kamba Adeema',
    levels: {
      1: { time: 12, scoreTarget: 10, description: 'Pull the rope!' },
      2: { time: 11, scoreTarget: 12, description: 'Stronger pull!' },
      3: { time: 10, scoreTarget: 14, description: 'Intense tug!' },
      4: { time: 9, scoreTarget: 16, description: 'Power up!' },
      5: { time: 8, scoreTarget: 18, description: 'Legendary strength!' },
      6: { time: 7, scoreTarget: 20, description: 'Champion warrior!' },
      7: { time: 6, scoreTarget: 22, description: 'Super strength!' },
      8: { time: 5, scoreTarget: 24, description: 'Extreme warrior!' },
      9: { time: 4, scoreTarget: 26, description: 'Master puller!' },
      10: { time: 3, scoreTarget: 30, description: 'Victory lord!' },
    },
  },
  'raban-gahmu': {
    name: 'Raban Gahmu',
    levels: {
      1: { time: 20, scoreTarget: 30, description: 'Beat the drum!' },
      2: { time: 19, scoreTarget: 35, description: 'Faster rhythm!' },
      3: { time: 18, scoreTarget: 40, description: 'Feel the beat!' },
      4: { time: 17, scoreTarget: 45, description: 'Intense beats!' },
      5: { time: 16, scoreTarget: 50, description: 'Rhythm master!' },
      6: { time: 15, scoreTarget: 55, description: 'Champion drummer!' },
      7: { time: 14, scoreTarget: 60, description: 'Legendary beats!' },
      8: { time: 13, scoreTarget: 70, description: 'Drum warrior!' },
      9: { time: 12, scoreTarget: 80, description: 'Master percussionist!' },
      10: { time: 10, scoreTarget: 100, description: 'Raban champion!' },
    },
  },
};

export const getLevelConfig = (gameId, level) => {
  return LEVEL_CONFIGS[gameId]?.levels[level] || null;
};

export const getGameLevelConfig = (gameId) => {
  return LEVEL_CONFIGS[gameId] || null;
};
