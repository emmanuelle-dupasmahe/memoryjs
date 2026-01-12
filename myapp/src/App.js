import { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card';
import Title from './components/Title';
import Button from './components/Button';


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
  { "src": "/img/snoppy.png", matched: false },
  { "src": "/img/woodstock.png", matched: false }
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const MAX_TURNS = 15;

  //fonction pour mélanger les cartes
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages] // doubler les cartes
      .sort(() => Math.random() - 0.5) // mélanger
      .map((card) => ({ ...card, id: Math.random() })); // ajouter un ID unique

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
  };

  // gérer le choix d'une carte
  const handleChoice = (card) => {
    // empêcher de choisir la même carte 2 fois
    if(card.id === choiceOne?.id) return;
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // comparer les deux cartes sélectionnées
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

  // réinitialiser le tour
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  //démarrer automatiquement une partie au chargement
  useEffect(() => {
    shuffleCards();
  }, []);

  const allMatched = cards.length > 0 && cards.every(card => card.matched);
  const isGameOver = turns >= MAX_TURNS && !allMatched;

  return (
    <div className="App">
      <Title />
      <Button onClick={shuffleCards}>Nouvelle Partie</Button>
      
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
