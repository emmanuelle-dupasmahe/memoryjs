import { useState, useEffect } from 'react';
import './App.css';
import Card from './components/CardGame/CardGame';
import Title from './components/Title/Title';
import Button from './components/Button/Button';

const cardImages = [
  { "src": "/img/charlie_brown.png", matched: false },
  { "src": "/img/franklin.png", matched: false },
  { "src": "/img/linus.png", matched: false },
  { "src": "/img/lucy.png", matched: false },
  { "src": "/img/marcie.png", matched: false },
  { "src": "/img/peppermint_patty.png", matched: false },
  { "src": "/img/rerun.png", matched: false },
  { "src": "/img/sally.png", matched: false },
  { "src": "/img/schroeder.png", matched: false },
  { "src": "/img/shermy.png", matched: false },
  { "src": "/img/snoopy.png", matched: false },
  { "src": "/img/woodstock.png", matched: false }
];

function App() {
  const [difficulty, setDifficulty] = useState(6);
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);

  //pour le Pseudo
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || "Snoopy");

  //pour les Records (sécurisé)
  const [bestScores, setBestScores] = useState(() => {
    const saved = localStorage.getItem('bestScores');
    try {
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // calculs dynamiques
  const MAX_TURNS = difficulty * 2 + 2; 
  const allMatched = cards.length > 0 && cards.every(card => card.matched);
  const isGameOver = turns >= MAX_TURNS && !allMatched;
  const currentLevelRecord = bestScores[difficulty] || { score: "--", name: "" };

  // sauvegarde des records par niveau
  useEffect(() => {
    if (allMatched && turns > 0 && cards.length === difficulty * 2) {
    const currentBest = bestScores[difficulty]?.score;
      
      if (currentBest === undefined || currentBest === "--" || turns < currentBest) {
        const newScores = { 
          ...bestScores, 
          [difficulty]: { score: turns, name: playerName } 
        };
        setBestScores(newScores);
        localStorage.setItem('bestScores', JSON.stringify(newScores));
      }
    }
  }, [allMatched, turns, difficulty, playerName, bestScores]);

  //sauvegarde du nom
  useEffect(() => {
    localStorage.setItem('playerName', playerName);
  }, [playerName]);

  // comparer les cartes
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            }
            return card;
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // mélanger au changement de difficulté
  useEffect(() => {
    shuffleCards(difficulty);
  }, [difficulty]);

  const shuffleCards = (numPairs = difficulty) => {
    setCards([]);
    setTimeout(() => {
      const selectedImages = [...cardImages].sort(() => Math.random() - 0.5).slice(0, numPairs);
      const shuffledCards = [...selectedImages, ...selectedImages]
        .sort(() => Math.random() - 0.5)
        .map((card) => ({ ...card, id: Math.random() }));
    
      setChoiceOne(null);
      setChoiceTwo(null);
      setCards(shuffledCards);
      setTurns(0);
      setDisabled(false);
  }, 10); // Un délai minuscule suffit à "casser" la condition de victoire
};
  const handleChoice = (card) => {
    if(card.id === choiceOne?.id) return;
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  return (
    <div className="App">
      <Title />
      
      {/* Messages de fin */}
      {allMatched && <div className="message win"> Victoire ! Félicitations {playerName} ! </div>}
      {isGameOver && <div className="message loss"> Game Over... Retente ta chance {playerName} !</div>}

      <div className="game-settings">
        <div className="input-group">
          <label>Pseudo : </label>
          <input 
            type="text" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)} 
            maxLength="12" 
          />
        </div>
        <div className="input-group">
          <label>Difficulté : </label>
          <select value={difficulty} onChange={(e) => setDifficulty(parseInt(e.target.value))}>
            <option value="3">3 Paires (Facile)</option>
            <option value="6">6 Paires (Normal)</option>
            <option value="9">9 Paires (Difficile)</option>
            <option value="12">12 Paires (Expert)</option>
          </select>
        </div>
      </div>

      <Button onClick={() => shuffleCards()}>Nouvelle Partie</Button>
      
      <div className="stats">
        <p>Tours : <strong>{turns}</strong> / {MAX_TURNS}</p>
        <p className="best-score">
          Record (Niveau {difficulty}) : 
          <strong> {currentLevelRecord.score}</strong> {currentLevelRecord.name && `par ${currentLevelRecord.name}`}
        </p>
      </div>

      <div className="card-grid">
        {cards.map(card => (
          <Card 
            key={card.id} 
            card={card} 
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled || card.matched || isGameOver}
          />
        ))}
      </div>
    </div>
  );
}

export default App;