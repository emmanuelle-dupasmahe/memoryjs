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
  const [bestScore, setBestScore] = useState(
    localStorage.getItem('bestScore') || "--"
  );

  const MAX_TURNS = 15;

  // calcul
  const allMatched = cards.length > 0 && cards.every(card => card.matched);
  const isGameOver = turns >= MAX_TURNS && !allMatched;

  // la fonction pour mélanger 
  const shuffleCards = (numPairs = difficulty) => {
    const selectedImages = [...cardImages]
      .sort(() => Math.random() - 0.5)
      .slice(0, numPairs);

    const shuffledCards = [...selectedImages, ...selectedImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
  };

  // gérer le choix (indispensable pour que Card fonctionne)
  const handleChoice = (card) => {
    if(card.id === choiceOne?.id) return;
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // comparer les cartes
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    if (allMatched) {
      const currentBest = localStorage.getItem('bestScore');
      if (!currentBest || turns < currentBest) {
        localStorage.setItem('bestScore', turns);
        setBestScore(turns);
      }
    }
  }, [allMatched, turns]);

 

  // réinitialiser le tour
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  useEffect(() => {
    shuffleCards(difficulty);
  }, [difficulty]);

  

  return (
    <div className="App">
      <Title />
      
      {allMatched && <div className="message win"> Victoire ! Félicitations ! </div>}
      {isGameOver && <div className="message loss"> Game Over... Retente ta chance !</div>}
      
      <div className="difficulty-selector">
        <label>Nombre de paires : </label>
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(parseInt(e.target.value))}
        >
          <option value="3">3 (Très Facile)</option>
          <option value="6">6 (Normal)</option>
          <option value="9">9 (Difficile)</option>
          <option value="12">12 (Expert)</option>
        </select>
      </div>

      <Button onClick={() => shuffleCards()}>Nouvelle Partie</Button>
      
      <div className="stats">
        <p>Tours : {turns} / {MAX_TURNS}</p>
        <p className="best-score">Record : <strong>{bestScore}</strong> tours</p>
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
