// Inside mandarinplayer-client/src/App.tsx

import { Routes, Route } from 'react-router-dom';

// Import your page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import JoinGamePage from './pages/JoinGamePage';
import WelcomePage from './pages/WelcomePage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

// Import your layout components
import GameLayout from './components/GameLayout';
// You will also create GameLobbyPage, QuestionPage, etc.

function App() {
  return (
    <Routes>
      {/* Public routes that don't need a shared session/layout */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected Routes - Only accessible to logged-in users */}
      <Route element={<ProtectedRoute />}>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/joingame" element={<JoinGamePage />} />
      </Route>

      {/* In-game routes, all nested under a GameLayout to manage the session */}
      <Route path="/game/:roomCode" element={<GameLayout />}>
        {/* <Route path="lobby" element={<GameLobbyPage />} /> */}
        {/* <Route path="question/:questionId" element={<QuestionPage />} /> */}
      </Route>

      {/* Fallback 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;