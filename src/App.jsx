import './App.css';
import React from "react";
import { useState,useEffect } from 'react';
import Die from "../components/Die"
import {nanoid} from "nanoid";
import Confetti from 'react-confetti'

export default function App() {
  const confettiWidth = window.innerWidth;
  const confettiHeight = window.innerHeight;

    const [dice, setDice] = useState(allNewDice())
    const [rolls, setRolls] = useState(0);
    const [tenzies, setTenzies] = useState(false);
    const [time, setTime] = useState(0);
    const [stopped, setStopped] = useState(false);
    const [score, setScore] = useState(50);
    const [bestRecord, setBestRecord] = useState(() => {
      const storedBestRecord = localStorage.getItem('bestRecord');
      return storedBestRecord ? parseInt(storedBestRecord, 10) : 50;
    });


  useEffect(() => {
   
      if(score < bestRecord){
        localStorage.setItem('bestRecord', score.toString());
        setBestRecord(score);
      }
    
  }, [score]);

    useEffect(() => {
      const timer = setInterval(() => {
        tenzies ? setTime(prevTime=>prevTime) : setTime(prevTime => prevTime + 1);
      }, 1000);
  
      return () => clearInterval(timer);
    }, [stopped]);
    
    useEffect(() => {
      const allHeld = dice.every(die => die.isHeld)
      const firstValue = dice[0].value
      const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setScore(rolls);
            setTenzies(true)
            setStopped(true)
        }
        }, [dice])
    
    const holdDice = (id) => {
      setDice(oldDice => oldDice.map(die => {
        return die.id === id ? 
            {...die, isHeld: !die.isHeld} :
            die
      }))
    }
    
    function rollingDice(){
      if(tenzies){
         setRolls(0);
         setTime(0);
         setDice(allNewDice());
         setTenzies(false)
         setStopped(false)
         
      }
      else{ 
        setRolls(prevRolls => prevRolls+1);
        setDice(prevDice => prevDice.map(die => {
        return die.isHeld ? die : generateNewDie();
      }))
    }
  }

    function generateNewDie() {
      return {
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: nanoid()
      }
  }
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice;
    }
    
    const diceElements = dice.map(die => <Die key={die.id} id={die.id} value={die.value} isHeld={die.isHeld} handleHeld={()=>holdDice(die.id)} />)
    
    return (
        <main>
            { tenzies && <Confetti 
              width={confettiWidth}
              height={confettiHeight}
              /> }
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <h4>TIME: {time}s</h4>
           <div className="dice-container">
                {diceElements}
            </div>
            <button onClick={rollingDice}>{!tenzies ? "Roll" : "New Game"}</button>
            { tenzies && <h4>{`You won the Game! You took ${rolls} rolls and ${time} seconds to win the game`}</h4>}
            <h3>{`The Best score is ${bestRecord}`}</h3>
        </main>
    )
}