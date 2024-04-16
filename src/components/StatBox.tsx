import React, { useContext } from "react"
import { GameContext } from "../context/GameContext";
import './StatBox.css';

interface Props {
  remainingMines: number
}

const StatBox = ({ remainingMines }: Props) => {
  const { isCleared, isGameOver } = useContext(GameContext);

  return (
    <div className='StatBox'>
      <div>{remainingMines} mines left</div>
      <button onClick={() => window.location.reload()}>
        {
          isCleared ? "😄" : 
          isGameOver ? "🤔" :
          "🙂"
        }
      </button>
      <div>
        {
          isCleared ? "CLEAR!" : 
          isGameOver ? "GAME OVER" :
          "You'll gonna make it!"
        }
      </div>
    </div>
  )
}

export default StatBox;