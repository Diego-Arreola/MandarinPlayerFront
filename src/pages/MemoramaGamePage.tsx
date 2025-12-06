// In c:\Users\estec\Documents\GitHub\CleanTeam Diego\MandarinPlayerFront\src\pages\MemoramaGamePage.tsx

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// This would likely be fetched from an API based on the topic
interface VocabularyItem {
  id: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
}

interface Card {
  id: string;
  type: 'hanzi' | 'meaning';
  content: string;
  pairId: number;
}

const MemoramaGamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topicVocabulary } = location.state as { topicVocabulary: VocabularyItem[] } || { topicVocabulary: [] };

  const [cards, setCards] = useState<Card[]>(() => {
    // --- Initial Game Setup ---
    let vocabulary = topicVocabulary;
    if (!vocabulary || vocabulary.length === 0) {
      console.warn("No vocabulary provided via location state. Using mock data for debugging.");
      vocabulary = Array.from({ length: 8 }, (_, i) => ({ id: i + 1, hanzi: `汉字${i + 1}`, pinyin: `hànzì${i + 1}`, meaning: `Meaning ${i + 1}` }));
    }

    // Create card pairs (Hanzi and Meaning)
    const gameCards: Card[] = vocabulary.flatMap((item): Card[] => ([
      { id: `${item.id}-hanzi`, type: 'hanzi', content: item.hanzi, pairId: item.id },
      { id: `${item.id}-meaning`, type: 'meaning', content: item.meaning, pairId: item.id }
    ]));

    // Shuffle the cards and return as initial state
    return gameCards.sort(() => Math.random() - 0.5);
  });
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [isChecking, setIsChecking] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // --- Requirement Check ---
    // If vocabulary is not provided or has an odd number of items, show an alert and redirect.
    // We check the generated cards array. If it's empty or odd, there's an issue.
    if (cards.length === 0 || cards.length % 2 !== 0) {
      alert("This topic has an invalid number of vocabulary words for Memorama. Please choose another topic or modify this one to have an even number of words.");
      navigate('/create-game'); // Redirect back to game creation
      return;
    }
  }, [navigate, cards.length]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.pairId === secondCard.pairId) {
        // It's a match
        setMatchedPairs(prev => [...prev, firstCard.pairId]);
        setScores(prevScores => ({
          ...prevScores,
          [currentPlayer === 1 ? 'player1' : 'player2']: prevScores[currentPlayer === 1 ? 'player1' : 'player2'] + 1,
        }));
        setFlippedCards([]);
        setIsChecking(false);
        if (matchedPairs.length + 1 === cards.length / 2) {
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
  }, [flippedCards, cards, currentPlayer, matchedPairs.length]);

  const handleCardClick = (index: number) => {
    if (isChecking || flippedCards.length === 2 || flippedCards.includes(index)) {
      return; // Ignore clicks if checking, 2 cards are already flipped, or the same card is clicked
    }

    const card = cards[index];
    if (matchedPairs.includes(card.pairId)) {
      return; // Ignore clicks on already matched cards
    }

    setFlippedCards(prev => [...prev, index]);
  };

  const getWinner = () => {
    if (scores.player1 > scores.player2) return "Player 1 Wins!";
    if (scores.player2 > scores.player1) return "Player 2 Wins!";
    return "It's a Tie!";
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>Memorama</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', fontSize: '1.2em' }}>
        <div style={{ color: currentPlayer === 1 ? 'blue' : 'black', fontWeight: currentPlayer === 1 ? 'bold' : 'normal' }}>
          Player 1: {scores.player1}
        </div>
        <div style={{ color: currentPlayer === 2 ? 'red' : 'black', fontWeight: currentPlayer === 2 ? 'bold' : 'normal' }}>
          Player 2: {scores.player2}
        </div>
      </div>

      {gameOver && (
        <div style={{ margin: '20px', fontSize: '2em', color: 'green' }}>
          <h2>Game Over!</h2>
          <p>{getWinner()}</p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '10px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {cards.map((card, index) => {
          const isFlipped = flippedCards.includes(index) || matchedPairs.includes(card.pairId);
          return (
            // This outer div is the perspective container for the 3D effect
            <div
              key={card.id}
              onClick={() => !gameOver && handleCardClick(index)}
              style={{
                height: '120px',
                cursor: gameOver || isFlipped ? 'default' : 'pointer',
                perspective: '1000px', // Necessary for the 3D effect
              }}
            >
              {/* This inner div is the one that actually flips */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                transition: 'transform 0.6s',
                transformStyle: 'preserve-3d', // Makes children exist in the same 3D space
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}>
                {/* Front of the card (the '?') */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', backgroundColor: '#4A90E2', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2em', borderRadius: '8px', border: '2px solid #357ABD' }}>
                  ?
                </div>
                {/* Back of the card (the content) */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', backgroundColor: '#fff', color: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: card.type === 'hanzi' ? '2em' : '1em', borderRadius: '8px', border: '2px solid #357ABD', transform: 'rotateY(180deg)' }}>
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