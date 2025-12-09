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
    let vocabulary = topicVocabulary;

    if (!vocabulary || vocabulary.length === 0) {
      console.log("No vocabulary provided. Using default 'Greetings' topic.");
      vocabulary = [
        { id: '1', character: '你好', pinyin: 'Nǐ hǎo', translation: 'Hola' },
        { id: '2', character: '谢谢', pinyin: 'Xièxiè', translation: 'Gracias' },
        { id: '3', character: '再见', pinyin: 'Zàijiàn', translation: 'Adiós' }
      ];
    }

    if (rounds && rounds > 0 && rounds < vocabulary.length) {
      vocabulary = [...vocabulary].sort(() => Math.random() - 0.5).slice(0, rounds);
    }

    const gameCards: Card[] = vocabulary.flatMap((item): Card[] => ([
      { id: `${item.id}-hanzi`, type: 'hanzi', content: item.character, pairId: item.id },
      { id: `${item.id}-meaning`, type: 'meaning', content: item.translation, pairId: item.id }
    ]));

    return gameCards.sort(() => Math.random() - 0.5);
  });

  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState<{ pairId: string; player: 1 | 2 }[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [isChecking, setIsChecking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);

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
        setMatches(prev => [...prev, { pairId: firstCard.pairId, player: currentPlayer }]);
        setFlippedCards([]);
        setIsChecking(false);

        if (matches.length + 1 === cards.length / 2) {
          setGameOver(true);
        }
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedCards, cards, currentPlayer, matches.length]);
  //...
  const getVocabularyDetails = (pairId: string) => {
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