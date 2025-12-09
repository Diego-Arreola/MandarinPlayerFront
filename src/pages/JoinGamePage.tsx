import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { gameService } from '../services/gameService';
import { useAuth } from '../context/AuthContext';

const JoinGamePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsJoining(true);
    try {
      const playerName = user?.name || 'Guest';
      await gameService.joinGame(code, playerName);
      navigate(`/lobby/${code}`);
    } catch (error) {
      console.error('Failed to join game:', error);

      // Check mock session in localStorage as fallback
      const mockSessionStr = localStorage.getItem(`mock_session_${code}`);
      if (mockSessionStr) {
        const session = JSON.parse(mockSessionStr);
        // Add player to mock session
        const newPlayer = { id: Date.now().toString(), name: user?.name || 'Guest', isHost: false };
        session.players.push(newPlayer);
        localStorage.setItem(`mock_session_${code}`, JSON.stringify(session));
        navigate(`/lobby/${code}`);
      } else {
        alert('Failed to join game. Please check the code.');
      }
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--secondary-color)', marginBottom: '30px' }}>Join a Game</h2>
      <form onSubmit={handleJoin}>
        <Input
          type="text"
          placeholder="Enter Game Code"
          maxLength={5}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          style={{ textTransform: 'uppercase', marginBottom: '20px' }}
        />
        <Button type="submit" disabled={isJoining} style={{ width: '100%' }}>
          {isJoining ? 'Joining...' : 'Join Game'}
        </Button>
        <Button variant="secondary" onClick={() => navigate('/welcome')} style={{ marginTop: '20px', alignSelf: 'flex-start' }}>
          &larr; Back
        </Button>
      </form>
    </div>
  );
};

export default JoinGamePage;