import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Vocabulary } from '../services/topicService';
import Button from '../components/Button';
import { useGameExit } from '../hooks/useGameExit';
import GameExitModal from '../components/GameExitModal';
import "../styles/pages/MemoramaGamePage.css"; // Reuse styles for results table

interface GameState {
    currentQuestionIndex: number;
    score: number;
    gameOver: boolean;
    questions: Question[];
    results: GameResult[];
}

interface Question {
    target: Vocabulary;
    options: Vocabulary[];
}

interface GameResult {
    target: Vocabulary;
    selected: Vocabulary | null;
    isCorrect: boolean;
}

const KahootGamePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { topicVocabulary, rounds } = location.state as { topicVocabulary: Vocabulary[], rounds?: number } || { topicVocabulary: [] };
    const { showExitConfirm, handleExit, confirmExit, cancelExit } = useGameExit();

    const [gameState, setGameState] = useState<GameState>({
        currentQuestionIndex: 0,
        score: 0,
        gameOver: false,
        questions: [],
        results: []
    });

    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    useEffect(() => {
        if (!topicVocabulary || topicVocabulary.length < 4) {
            if (!topicVocabulary || topicVocabulary.length === 0) {
                alert("No vocabulary provided for this game.");
                navigate('/create-game');
                return;
            }
        }
        initializeGame();
    }, [topicVocabulary]);

    const initializeGame = () => {
        // Determine number of rounds: use passed rounds, or default to 5, but cap at vocab length
        let numRounds = rounds || 5;
        if (numRounds > topicVocabulary.length) numRounds = topicVocabulary.length;

        const questions: Question[] = [];
        // Shuffle vocabulary to pick random targets
        const vocabCopy = [...topicVocabulary].sort(() => Math.random() - 0.5);

        for (let i = 0; i < numRounds; i++) {
            const target = vocabCopy[i]; // Pick unique targets since we shuffled

            // Pick 3 distractors
            const distractors = topicVocabulary
                .filter(v => v.id !== target.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            // Combine and shuffle options
            const options = [target, ...distractors].sort(() => 0.5 - Math.random());

            questions.push({ target, options });
        }

        setGameState({
            currentQuestionIndex: 0,
            score: 0,
            gameOver: false,
            questions,
            results: []
        });
    };

    const handleOptionClick = (option: Vocabulary) => {
        if (isAnswered) return;

        setSelectedOptionId(option.id);
        setIsAnswered(true);

        const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
        const isCorrect = option.id === currentQuestion.target.id;

        const result: GameResult = {
            target: currentQuestion.target,
            selected: option,
            isCorrect
        };

        if (isCorrect) {
            setGameState(prev => ({ ...prev, score: prev.score + 1, results: [...prev.results, result] }));
        } else {
            setGameState(prev => ({ ...prev, results: [...prev.results, result] }));
        }

        // Wait 2 seconds then move to next question
        setTimeout(() => {
            if (gameState.currentQuestionIndex + 1 >= gameState.questions.length) {
                setGameState(prev => ({ ...prev, gameOver: true }));
            } else {
                setGameState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
                setSelectedOptionId(null);
                setIsAnswered(false);
            }
        }, 2000);
    };

    const getOptionStyle = (option: Vocabulary) => {
        if (!isAnswered) return {}; // Default style

        const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
        const isCorrect = option.id === currentQuestion.target.id;
        const isSelected = option.id === selectedOptionId;

        if (isCorrect) {
            return { backgroundColor: '#4ade80', color: 'white', borderColor: '#4ade80' }; // Green
        }
        if (isSelected && !isCorrect) {
            return { backgroundColor: '#ef4444', color: 'white', borderColor: '#ef4444' }; // Red
        }
        return { opacity: 0.5 }; // Fade out others
    };

    const handlePrint = () => {
        window.print();
    };

    if (gameState.gameOver) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                width: '100vw',
                backgroundColor: 'var(--background)',
                color: 'black',
                padding: '2rem',
                boxSizing: 'border-box'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Game Over!</h1>
                <p style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                    Your Score: {gameState.score} / {gameState.questions.length}
                </p>

                <div style={{ width: '100%', maxWidth: '800px', marginBottom: '2rem', overflowX: 'auto' }}>
                    <table className="results-table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', color: 'black', borderRadius: '10px', overflow: 'hidden' }}>
                        <thead style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                            <tr>
                                <th style={{ padding: '1rem' }}>Word (Spanish)</th>
                                <th style={{ padding: '1rem' }}>Correct Answer (Chinese)</th>
                                <th style={{ padding: '1rem' }}>Your Answer</th>
                                <th style={{ padding: '1rem' }}>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gameState.results.map((result, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '1rem' }}>{result.target.spanish}</td>
                                    <td style={{ padding: '1rem' }}>{result.target.chinese} ({result.target.pinyin})</td>
                                    <td style={{ padding: '1rem' }}>{result.selected?.chinese}</td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold', color: result.isCorrect ? 'green' : 'red' }}>
                                        {result.isCorrect ? 'Correct' : 'Incorrect'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button onClick={handlePrint} variant="secondary">Print Results</Button>
                    <Button onClick={() => navigate('/create-game')}>Play Again</Button>
                </div>
            </div>
        );
    }

    if (gameState.questions.length === 0) {
        return <div>Loading...</div>;
    }

    const currentQuestion = gameState.questions[gameState.currentQuestionIndex];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            minHeight: '100vh',
            width: '100vw',
            backgroundColor: 'var(--background)',
            color: 'black',
            boxSizing: 'border-box'
        }}>
            <GameExitModal
                isOpen={showExitConfirm}
                onConfirm={confirmExit}
                onCancel={cancelExit}
            />

            <div style={{
                width: '100%',
                maxWidth: '800px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                margin: '0 auto'
            }}>
                <div style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                }}>
                    <button
                        onClick={handleExit}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#ff4d4d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        }}
                    >
                        Exit
                    </button>
                    <span>Question {gameState.currentQuestionIndex + 1} / {gameState.questions.length}</span>
                    <span>Score: {gameState.score}</span>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '3rem',
                    borderRadius: '15px',
                    width: '100%',
                    maxWidth: '600px',
                    textAlign: 'center',
                    marginBottom: '3rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '200px'
                }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#666', marginBottom: '1rem' }}>Translate this word:</h2>
                    <h1 style={{ fontSize: '3rem', margin: 0 }}>{currentQuestion.target.spanish}</h1>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    width: '100%',
                    maxWidth: '800px'
                }}>
                    {currentQuestion.options.map((option) => (
                        <div
                            key={option.id}
                            onClick={() => handleOptionClick(option)}
                            style={{
                                backgroundColor: 'white',
                                padding: '2rem',
                                borderRadius: '10px',
                                textAlign: 'center',
                                fontSize: '1.5rem',
                                cursor: isAnswered ? 'default' : 'pointer',
                                border: '2px solid transparent',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minHeight: '100px',
                                ...getOptionStyle(option)
                            }}
                        >
                            {option.chinese}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KahootGamePage;
