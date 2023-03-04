import './App.css';
import Die from "./components/Die"
import React from 'react';
import { nanoid } from "nanoid"
import Confetti from 'react-confetti';

function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [won, setWon] = React.useState(false);
  const [rolls, setRolls] = React.useState(0);
  
  // Retrieve the best value from local storage
  const [best, setBest] = React.useState(localStorage.getItem('best') || 0);

  React.useEffect(() => {
    const held = dice.every(die => die.isHeld);
    const first = dice[0].value;
    const same = dice.every(die => die.value === first);
    if(held && same){
      setWon(true);
    }
    
  }, [dice]);

  function genNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      key: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 1; i <= 10; i++) {
      newDice.push(genNewDie());
    }
    return newDice;
  }

  function holdDice(key) {
    setDice(prev =>
      prev.map(die =>
        die.key === key ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  function rollDice() {
    if (!won) {
      setRolls(prev => prev + 1);
      setDice(prev =>
        prev.map(die => (die.isHeld ? die : genNewDie()))
      );
    } else {
      setWon(false);
      setDice(allNewDice());
      setRolls(0);
      let newValue = rolls;
      if (newValue < best|| !best) {
        localStorage.setItem('best', newValue);
        setBest(newValue);
      }
    }
  }

  const btn = won ? 'Play Again' : 'Roll';
  const score=rolls>0?"Rolls" : "Roll"
  return (
    <main className='whole'>
      {won && <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
      />}
      <h4 className='b-score'>Best Score : {best}</h4>
      <h4 className='score'>{score} : {rolls}</h4>
      <h4 className='name'>GD_Dev</h4>
      <h1 className="title">Dice Dash</h1>
      <p className="instructions">Roll the dice until all numbers are the same. Click each die to freeze it at its current value between rolls. Win with the lowest number of rolls possible!</p>
      <div className="app-cont">
        {dice.map(die => <Die key={die.key} value={die.value} isHeld={die.isHeld} holdDice={()=>holdDice(die.key)}/>)}
      </div>
      <button className='app-btn' onClick={rollDice} >{btn}</button>
    </main>
  );
}

export default App;
