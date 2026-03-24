// Storage utilities for player name, leaderboard, and levels

export const savePlayerName = (name) => {
  localStorage.setItem('avurudu_player', name.trim());
};

export const getPlayerName = () => {
  return localStorage.getItem('avurudu_player') || null;
};

export const clearPlayerName = () => {
  localStorage.removeItem('avurudu_player');
};

// Leaderboard - top 10 scores
export const saveScore = (name, score) => {
  const scores = getLeaderboard();
  const entry = {
    name,
    score,
    date: new Date().toLocaleDateString('en-GB'),
  };
  scores.push(entry);
  // Sort descending, keep top 10
  scores.sort((a, b) => b.score - a.score);
  const top10 = scores.slice(0, 10);
  localStorage.setItem('avurudu_leaderboard', JSON.stringify(top10));
  return top10;
};

export const getLeaderboard = () => {
  try {
    return JSON.parse(localStorage.getItem('avurudu_leaderboard') || '[]');
  } catch {
    return [];
  }
};

// Level progression system
export const initializeLevelProgress = () => {
  const existing = getLevelProgress();
  if (!existing || Object.keys(existing).length === 0) {
    const games = ['kotta-pora', 'kana-mutti', 'aliyata-aha', 'lissana-gaha', 'banis-kaema', 'kamba-adeema'];
    const progress = {};
    games.forEach(game => {
      progress[game] = {
        unlockedLevel: 1,
        levelScores: {}, // { '1': 4500, '2': 3200, ... }
        tutorialShown: false,
      };
    });
    localStorage.setItem('avurudu_level_progress', JSON.stringify(progress));
    return progress;
  }
  return existing;
};

export const getLevelProgress = () => {
  try {
    return JSON.parse(localStorage.getItem('avurudu_level_progress') || '{}');
  } catch {
    return {};
  }
};

export const getGameProgress = (gameId) => {
  const progress = getLevelProgress();
  return progress[gameId] || { unlockedLevel: 1, levelScores: {}, tutorialShown: false };
};

export const saveLevelScore = (gameId, level, score) => {
  const progress = getLevelProgress();
  if (!progress[gameId]) {
    progress[gameId] = { unlockedLevel: 1, levelScores: {}, tutorialShown: false };
  }
  progress[gameId].levelScores[level] = Math.max(progress[gameId].levelScores[level] || 0, score);
  localStorage.setItem('avurudu_level_progress', JSON.stringify(progress));
  return progress[gameId];
};

export const unlockNextLevel = (gameId, currentLevel) => {
  const progress = getLevelProgress();
  if (!progress[gameId]) {
    progress[gameId] = { unlockedLevel: 1, levelScores: {}, tutorialShown: false };
  }
  // Unlock next level if current is beaten
  if (currentLevel >= progress[gameId].unlockedLevel) {
    progress[gameId].unlockedLevel = Math.min(currentLevel + 1, 10); // Max 10 levels
  }
  localStorage.setItem('avurudu_level_progress', JSON.stringify(progress));
  return progress[gameId];
};

export const markTutorialShown = (gameId) => {
  const progress = getLevelProgress();
  if (!progress[gameId]) {
    progress[gameId] = { unlockedLevel: 1, levelScores: {}, tutorialShown: false };
  }
  progress[gameId].tutorialShown = true;
  localStorage.setItem('avurudu_level_progress', JSON.stringify(progress));
};

export const shouldShowTutorial = (gameId) => {
  const progress = getGameProgress(gameId);
  return !progress.tutorialShown;
};
