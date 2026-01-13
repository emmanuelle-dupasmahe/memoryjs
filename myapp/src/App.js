import { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card/Card';
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

  const MAX_TURNS = 15;

  // 1. La fonction pour mélanger (votre code était bon ici)
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

  // 2. AJOUT : Gérer le choix (indispensable pour que Card fonctionne)
  const handleChoice = (card) => {
    if(card.id === choiceOne?.id) return;
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // 3. AJOUT : Comparer les cartes
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

  // 4. AJOUT : Réinitialiser le tour
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  useEffect(() => {
    shuffleCards(difficulty);
  }, [difficulty]);

  // 5. CALCULS (Juste avant le return)
  const allMatched = cards.length > 0 && cards.every(card => card.matched);
  const isGameOver = turns >= MAX_TURNS && !allMatched;

  return (
    <div className="App">
      <Title />
      
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

      {allMatched && <div className="message win">✨ Victoire ! Félicitations ! ✨</div>}
      {isGameOver && <div className="message loss">💀 Game Over... Retente ta chance !</div>}
    </div>
  );
}
export default App;
