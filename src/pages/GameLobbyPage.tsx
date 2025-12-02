import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { gameService } from '../services/gameService';
import type { GameSession } from '../services/gameService';

const GameLobbyPage = () => {
    const { gameCode } = useParams<{ gameCode: string }>();
    const navigate = useNavigate();
    const [session, setSession] = useState<GameSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (gameCode) {
            loadSession(gameCode);
        }
    }, [gameCode]);

    const loadSession = async (code: string) => {
        try {
            const data = await gameService.getSession(code);
            if (data) {
                setSession(data);
            } else {
                alert('Game not found');
                navigate('/create-game');
            }
        } catch (error) {
            console.error('Failed to load session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartGame = () => {
        alert('Starting game... (This feature is under construction)');
        // navigate(`/game/${session?.code}/play`);
    };

    if (isLoading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading lobby...</div>;
    if (!session) return null;

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--secondary-color)' }}>Game Lobby</h2>

            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '15px',
                color: 'black',
                marginBottom: '30px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <p style={{ fontSize: '1.2rem', margin: 0, color: '#666' }}>Access Code</p>
                <h1 style={{ fontSize: '4rem', margin: '10px 0', letterSpacing: '5px', color: 'var(--primary-color)' }}>
                    {session.code}
                </h1>
                <p style={{ margin: 0 }}>Share this code with your friends!</p>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: 'white' }}>Players ({session.players.length})</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                    {session.players.map(player => (
                        <div key={player.id} style={{
                            padding: '10px 20px',
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '20px',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>👤</span>
                            {player.name} {player.isHost && '(Host)'}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <Button variant="secondary" onClick={() => navigate('/welcome')}>
                    Leave Lobby
                </Button>
                <Button onClick={handleStartGame} style={{ padding: '15px 40px', fontSize: '1.2rem' }}>
                    Start Game
                </Button>
            </div>
        </div>
    );
};

export default GameLobbyPage;
