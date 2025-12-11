import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { gameRepository as gameService } from '../api/HttpGameRepository';
import type { GameSession } from '../../domain/entities/Game';
import { topicRepository as topicService } from '../api/HttpTopicRepository';

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
                // Check mock session in localStorage
                const mockSessionStr = localStorage.getItem(`mock_session_${code}`);
                if (mockSessionStr) {
                    setSession(JSON.parse(mockSessionStr));
                } else {
                    alert('Game not found');
                    navigate('/create-game');
                }
            }
        } catch (error) {
            console.error('Failed to load session:', error);
            // Check mock session in localStorage as fallback
            const mockSessionStr = localStorage.getItem(`mock_session_${code}`);
            if (mockSessionStr) {
                setSession(JSON.parse(mockSessionStr));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartGame = async () => {
        if (session?.config.type === 'memorama') {
            let vocabulary = session.topic?.vocabulary;

            if (!vocabulary && session.config.topicId) {
                try {
                    // Try to fetch topic details to get vocabulary
                    // This works if we have a real backend or if we mock topicService too (which we did partially in CreateGamePage but not globally)
                    // We can reuse the mock logic from CreateGamePage or just rely on Memorama default.
                    // Let's try to fetch.
                    const topic = await topicService.getTopicById(session.config.topicId);
                    if (topic) {
                        vocabulary = topic.vocabulary;
                    }
                } catch (e) {
                    console.warn("Could not fetch topic details", e);
                }
            }

            navigate(`/game/memorama/${session.code}`, { state: { topicVocabulary: vocabulary, rounds: session.config.rounds } });
        } else if (session?.config.type === 'kahoot') {
            let vocabulary = session.topic?.vocabulary;
            if (!vocabulary && session.config.topicId) {
                try {
                    const topic = await topicService.getTopicById(session.config.topicId);
                    if (topic) vocabulary = topic.vocabulary;
                } catch (e) {
                    console.warn("Could not fetch topic details", e);
                }
            }
            navigate(`/kahoot/${session.code}`, { state: { topicVocabulary: vocabulary, rounds: session.config.rounds } });
        } else {
            alert('Starting game... (This feature is under construction)');
            // navigate(`/game/${session?.code}/play`);
        }
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
                            {/* <span style={{ fontSize: '1.2rem' }}>👤</span> */}
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
