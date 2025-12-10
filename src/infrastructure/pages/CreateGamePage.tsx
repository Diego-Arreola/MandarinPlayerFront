import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { topicRepository as topicService } from '../api/HttpTopicRepository';
import type { Topic } from '../../domain/entities/Topic';
import { gameRepository as gameService } from '../api/HttpGameRepository';
import type { GameType } from '../../domain/entities/Game';
import { useAuth } from '../context/AuthContext';

const CreateGamePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState<1 | 2>(1);
    const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const [rounds, setRounds] = useState(5);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        loadTopics();
    }, []);

    const loadTopics = async () => {
        try {
            const data = await topicService.getTopics();
            if (data && data.length > 0) {
                setTopics(data);
                setSelectedTopicId(data[0].id);
            } else {
                // Mock data for testing/demo
                const mockTopics: Topic[] = [
                    {
                        id: '1',
                        name: 'Greetings',
                        description: 'Basic greetings',
                        vocabulary: [
                            { id: '1', character: '你好', pinyin: 'Nǐ hǎo', translation: 'Hello' },
                            { id: '2', character: '谢谢', pinyin: 'Xièxiè', translation: 'Thank you' },
                            { id: '3', character: '再见', pinyin: 'Zàijiàn', translation: 'Goodbye' }
                        ]
                    },
                    {
                        id: '2',
                        name: 'Numbers',
                        description: '1-3',
                        vocabulary: [
                            { id: '4', character: '一', pinyin: 'Yī', translation: 'One' },
                            { id: '5', character: '二', pinyin: 'Èr', translation: 'Two' },
                            { id: '6', character: '三', pinyin: 'Sān', translation: 'Three' }
                        ]
                    }
                ];
                setTopics(mockTopics);
                setSelectedTopicId(mockTopics[0].id);
            }
        } catch (error) {
            console.error("Failed to load topics", error);
            // Mock data fallback
            const mockTopics: Topic[] = [
                {
                    id: '1',
                    name: 'Greetings',
                    description: 'Basic greetings',
                    vocabulary: [
                        { id: '1', character: '你好', pinyin: 'Nǐ hǎo', translation: 'Hello' },
                        { id: '2', character: '谢谢', pinyin: 'Xièxiè', translation: 'Thank you' },
                        { id: '3', character: '再见', pinyin: 'Zàijiàn', translation: 'Goodbye' }
                    ]
                }
            ];
            setTopics(mockTopics);
            setSelectedTopicId(mockTopics[0].id);
        }
    };

    const handleGameSelect = (game: GameType) => {
        setSelectedGame(game);
        setStep(2);
    };

    const handleCreateGame = async () => {
        if (!selectedGame || !selectedTopicId) return;

        // Reverted direct play to support Lobby flow as requested
        // if (selectedGame === 'memorama') { ... }

        if (!user) {
            // Allow creating game without user for testing/demo if needed, 
            // or enforce login. For now, let's assume we need a user or use a dummy one.
            // alert("Please login to create a game");
            // return;
        }

        setIsCreating(true);
        try {
            const session = await gameService.createGame({
                type: selectedGame,
                topicId: selectedTopicId,
                rounds
            }, user?.name || 'Guest');
            navigate(`/lobby/${session.code}`);
        } catch (error) {
            console.error('Failed to create game:', error);
            // Mock session for demo purposes if API fails
            const mockCode = Math.random().toString(36).substring(2, 7).toUpperCase();
            console.log("Using mock session with code:", mockCode);
            // We need to store this mock session somewhere if we want the lobby to find it
            // For now, we'll just navigate and hope the Lobby can handle it or we mock the Lobby too.
            // A better approach for local demo is to save to localStorage.
            const mockSession = {
                code: mockCode,
                config: { type: selectedGame, topicId: selectedTopicId, rounds },
                players: [{ id: '1', name: user?.name || 'Guest', isHost: true }],
                status: 'waiting'
            };
            localStorage.setItem(`mock_session_${mockCode}`, JSON.stringify(mockSession));
            navigate(`/lobby/${mockCode}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <Button variant="secondary" onClick={() => navigate('/welcome')} style={{ marginBottom: '20px' }}>
                &larr; Back to Home
            </Button>

            <h2 style={{ color: 'var(--secondary-color)', textAlign: 'center', marginBottom: '30px' }}>
                {step === 1 ? 'Select Game Mode' : 'Configure Game'}
            </h2>

            {step === 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {['kahoot', 'jeopardy', 'memorama'].map((game) => (
                        <div
                            key={game}
                            onClick={() => handleGameSelect(game as GameType)}
                            style={{
                                border: '2px solid #ddd',
                                borderRadius: '10px',
                                padding: '30px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                                color: 'black',
                                transition: 'transform 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <h3 style={{ textTransform: 'capitalize', margin: 0 }}>{game}</h3>
                        </div>
                    ))}
                </div>
            )}

            {step === 2 && (
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', color: 'black' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Selected Game</label>
                        <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px', textTransform: 'capitalize' }}>
                            {selectedGame}
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Select Topic</label>
                        <select
                            value={selectedTopicId}
                            onChange={(e) => setSelectedTopicId(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        >
                            {topics.map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.vocabulary.length} words)</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Number of Rounds</label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={rounds}
                            onChange={(e) => setRounds(parseInt(e.target.value))}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Button variant="secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
                            Back
                        </Button>
                        <Button onClick={handleCreateGame} disabled={isCreating} style={{ flex: 1 }}>
                            {isCreating ? 'Creating...' : 'Create Lobby'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateGamePage;
