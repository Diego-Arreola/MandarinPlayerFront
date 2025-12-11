// Inside mandarinplayer-client/src/App.tsx

import { Routes, Route } from 'react-router-dom';

// Import your page components
import HomePage from './infrastructure/pages/HomePage';
import LoginPage from './infrastructure/pages/LoginPage';
import SignUpPage from './infrastructure/pages/SignUpPage';
import JoinGamePage from './infrastructure/pages/JoinGamePage';
import WelcomePage from './infrastructure/pages/WelcomePage';
import NotFoundPage from './infrastructure/pages/NotFoundPage';

// Import your layout components
import GameLayout from './infrastructure/components/GameLayout';
// You will also create GameLobbyPage, QuestionPage, etc.
import TopicsPage from './infrastructure/pages/TopicsPage';
import TopicDetailPage from './infrastructure/pages/TopicDetailPage';
import CreateGamePage from './infrastructure/pages/CreateGamePage';
import GameLobbyPage from './infrastructure/pages/GameLobbyPage';
import MemoramaGamePage from './infrastructure/pages/MemoramaGamePage';
import KahootGamePage from './infrastructure/pages/KahootGamePage';

function App() {
  return (
    <Routes>
      {/* Public routes that don't need a shared session/layout */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/joingame" element={<JoinGamePage />} />
      <Route path="/lobby/:gameCode" element={<GameLobbyPage />} />

      {/* Protected Routes - Only accessible to logged-in users */}
      {/* <Route element={<ProtectedRoute />}> */}
      <Route path="/welcome" element={<WelcomePage />} />

      <Route path="/topics" element={<TopicsPage />} />
      <Route path="/topics/:topicId" element={<TopicDetailPage />} />
      <Route path="/create-game" element={<CreateGamePage />} />

      <Route path="/game/memorama/:gameCode" element={<MemoramaGamePage />} />
      <Route path="/kahoot/:gameCode" element={<KahootGamePage />} />
      {/* </Route> */}

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