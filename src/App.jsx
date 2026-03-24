import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { getPlayerName } from './utils/storage';
import Particles from './components/Particles';
import backgroundMusic from './assets/song.mp3';

const PlayerSetup = lazy(() => import('./pages/PlayerSetup'));
const Home = lazy(() => import('./pages/Home'));
const GameSelect = lazy(() => import('./pages/GameSelect'));
const KottaPora = lazy(() => import('./pages/GamePlay')); // Kotta Pora was previously GamePlay.jsx
const KanaMutti = lazy(() => import('./pages/KanaMutti'));
const AliyataAha = lazy(() => import('./pages/AliyataAha'));
const LissanaGaha = lazy(() => import('./pages/LissanaGaha'));
const BanisKaema = lazy(() => import('./pages/BanisKaema'));
const KambaAdeema = lazy(() => import('./pages/KambaAdeema'));
const RabanGahmu = lazy(() => import('./pages/RabanGahmu'));
const AuruduRecipes = lazy(() => import('./pages/AuruduRecipes'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));

function ProtectedRoute({ children }) {
  const player = getPlayerName();
  if (!player) return <Navigate to="/setup" replace />;
  return children;
}

function LoadingScreen() {
  return (
    <div className="festive-bg flex items-center justify-center min-h-dvh">
      <div className="flex flex-col items-center gap-4">
        <div
          style={{
            width: 56, height: 56,
            border: '4px solid rgba(245,166,35,0.2)',
            borderTop: '4px solid #F5A623',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ color: '#F5A623', fontWeight: 600 }}>Loading...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

const BackgroundMusic = () => {
  const audioRef = import.meta.env.SSR ? null : new Audio(backgroundMusic);
  
  useEffect(() => {
    if (!audioRef) return;
    audioRef.loop = true;
    audioRef.volume = 0.4;
    
    const playMusic = () => {
      audioRef.play().catch(err => console.log("Autoplay blocked, waiting for interaction"));
      window.removeEventListener('click', playMusic);
      window.removeEventListener('touchstart', playMusic);
    };

    window.addEventListener('click', playMusic);
    window.addEventListener('touchstart', playMusic);

    return () => {
      audioRef.pause();
      window.removeEventListener('click', playMusic);
      window.removeEventListener('touchstart', playMusic);
    };
  }, []);

  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="festive-bg">
        <BackgroundMusic />
        <Particles />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/setup" element={<PlayerSetup />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><GameSelect /></ProtectedRoute>} />
            <Route path="/play/kotta-pora" element={<ProtectedRoute><KottaPora /></ProtectedRoute>} />
            <Route path="/play/kana-mutti" element={<ProtectedRoute><KanaMutti /></ProtectedRoute>} />
            <Route path="/play/aliyata-aha" element={<ProtectedRoute><AliyataAha /></ProtectedRoute>} />
            <Route path="/play/lissana-gaha" element={<ProtectedRoute><LissanaGaha /></ProtectedRoute>} />
            <Route path="/play/banis-kaema" element={<ProtectedRoute><BanisKaema /></ProtectedRoute>} />
            <Route path="/play/kamba-adeema" element={<ProtectedRoute><KambaAdeema /></ProtectedRoute>} />
            <Route path="/play/raban-gahmu" element={<ProtectedRoute><RabanGahmu /></ProtectedRoute>} />
            <Route path="/recipes" element={<ProtectedRoute><AuruduRecipes /></ProtectedRoute>} />
            <Route path="/play" element={<Navigate to="/play/kotta-pora" replace />} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
