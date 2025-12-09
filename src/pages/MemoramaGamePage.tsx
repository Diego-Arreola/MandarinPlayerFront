// In c:\Users\estec\Documents\GitHub\CleanTeam Diego\MandarinPlayerFront\src\pages\MemoramaGamePage.tsx

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGameExit } from "../hooks/useGameExit";
import GameExitModal from "../components/GameExitModal";

import type { Vocabulary } from '../services/topicService';

interface Card {
  id: string;
  type: 'hanzi' | 'meaning';
  content: string;
  pairId: string;
}



import "../styles/pages/MemoramaGamePage.css";

const MemoramaGamePage = () => {
  const location = useLocation();
  const { topicVocabulary, rounds } = location.state as { topicVocabulary: Vocabulary[], rounds?: number } || { topicVocabulary: [] };
  const { showExitConfirm, handleExit, confirmExit, cancelExit } = useGameExit();

  const [cards, setCards] = useState<Card[]>(() => {
    // --- Initial Game Setup ---
    let vocabulary = topicVocabulary;

    // Default vocabulary (Greetings) if none provided
    if (!vocabulary || vocabulary.length === 0) {
      console.log("No vocabulary provided. Using default 'Greetings' topic.");
      vocabulary = [
        { id: '1', chinese: '你好', pinyin: 'Nǐ hǎo', spanish: 'Hola' },
        { id: '2', chinese: '谢谢', pinyin: 'Xièxiè', spanish: 'Gracias' },
        { id: '3', chinese: '再见', pinyin: 'Zàijiàn', spanish: 'Adiós' }
      ];
    }

    // Limit vocabulary based on rounds (if provided)
    if (rounds && rounds > 0 && rounds < vocabulary.length) {
      // Shuffle first to get random words
      vocabulary = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, rounds);
    }

    // Create card pairs (Hanzi and Meaning)
    const gameCards: Card[] = vocabulary.flatMap((item): Card[] => ([
      { id: `${item.id}-hanzi`, type: 'hanzi', content: item.chinese, pairId: item.id },
      { id: `${item.id}-meaning`, type: 'meaning', content: item.spanish, pairId: item.id }
    ]));

    // Shuffle the cards and return as initial state
    return gameCards.sort(() => Math.random() - 0.5);
  });

  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  // Track matches with player info: { pairId: 1, player: 1 }
  const [matches, setMatches] = useState<{ pairId: string; player: 1 | 2 }[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [isChecking, setIsChecking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Derived state
  const scores = {
    player1: matches.filter(m => m.player === 1).length,
    player2: matches.filter(m => m.player === 2).length
  };
  const matchedPairIds = matches.map(m => m.pairId);



  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.pairId === secondCard.pairId) {
        // It's a match
        setMatches(prev => [...prev, { pairId: firstCard.pairId, player: currentPlayer }]);
        setFlippedCards([]);
        setIsChecking(false);

        // Check for game over
        // We use matches.length + 1 because state update hasn't reflected yet in this render cycle for 'matches'
        // but we know we just added one.
        if (matches.length + 1 === cards.length / 2) {
          setGameOver(true);
        }
      } else {
        // Not a match, flip back after a delay
        setTimeout(() => {
          setFlippedCards([]);
          setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedCards, cards, currentPlayer, matches.length]);

  const handleCardClick = (index: number) => {
    if (isChecking || flippedCards.length === 2 || flippedCards.includes(index)) {
      return;
    }

    const card = cards[index];
    if (matchedPairIds.includes(card.pairId)) {
      return;
    }

    setFlippedCards(prev => [...prev, index]);
  };

  const getWinner = () => {
    if (scores.player1 > scores.player2) return "Player 1 Wins!";
    if (scores.player2 > scores.player1) return "Player 2 Wins!";
    return "It's a Tie!";
  };

  const handlePlayAgain = () => {
    setFlippedCards([]);
    setMatches([]);
    setCurrentPlayer(1);
    setGameOver(false);
    setShowResults(false);
    setCards(prevCards => [...prevCards].sort(() => Math.random() - 0.5));
  };

  const handlePrint = () => {
    window.print();
  };



  // Helper to get vocabulary details for results
  const getVocabularyDetails = (pairId: string) => {
    // We can find the card content from the cards array
    const hanziCard = cards.find(c => c.pairId === pairId && c.type === 'hanzi');
    const meaningCard = cards.find(c => c.pairId === pairId && c.type === 'meaning');
    return {
      hanzi: hanziCard?.content || '?',
      meaning: meaningCard?.content || '?'
    };
  };

  return (
    <div className="memorama-container">
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <button
          onClick={handleExit}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Exit Game
        </button>
      </div>
      <h1 className="memorama-title">Memorama</h1>

      <div className="score-board">
        <div className={`player-score ${currentPlayer === 1 ? 'active' : ''}`}>
          Player 1: {scores.player1}
        </div>
        <div className={`player-score ${currentPlayer === 2 ? 'active' : ''}`}>
          Player 2: {scores.player2}
        </div>
      </div>

      {gameOver && (
        <div className="modal-overlay">
          <div className="modal-content">
            {!showResults ? (
              <>
                <h2 className="modal-title">Game Over!</h2>
                <p className="winner-text">{getWinner()}</p>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => setShowResults(true)}>
                    View Results
                  </button>
                  <button className="btn btn-primary" onClick={handlePlayAgain}>
                    Play Again
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="modal-title">Game Results</h2>
                <p className="winner-text">{getWinner()}</p>

                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h3>Player 1 ({scores.player1})</h3>
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>Hanzi</th>
                          <th>Meaning</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matches.filter(m => m.player === 1).map(m => {
                          const details = getVocabularyDetails(m.pairId);
                          return (
                            <tr key={m.pairId}>
                              <td>{details.hanzi}</td>
                              <td>{details.meaning}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3>Player 2 ({scores.player2})</h3>
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>Hanzi</th>
                          <th>Meaning</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matches.filter(m => m.player === 2).map(m => {
                          const details = getVocabularyDetails(m.pairId);
                          return (
                            <tr key={m.pairId}>
                              <td>{details.hanzi}</td>
                              <td>{details.meaning}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={handlePrint}>
                    Print Results
                  </button>
                  <button className="btn btn-primary" onClick={handlePlayAgain}>
                    Play Again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <GameExitModal
        isOpen={showExitConfirm}
        onConfirm={confirmExit}
        onCancel={cancelExit}
      />

      <div className="game-grid">
        {cards.map((card, index) => {
          const isMatched = matchedPairIds.includes(card.pairId);
          const isFlipped = flippedCards.includes(index) || isMatched;

          return (
            <div
              key={card.id}
              className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'disabled' : ''}`}
              onClick={() => !gameOver && handleCardClick(index)}
            >
              <div className="card-inner">
                <div className="card-face card-front">
                  ?
                </div>
                <div className="card-face card-back">
                  {card.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemoramaGamePage;