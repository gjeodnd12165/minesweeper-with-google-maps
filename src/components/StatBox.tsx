import React, { useMemo } from "react"
import './StatBox.css';
import { useMine } from "../hooks/useMine";
import { useGame } from "../hooks/useGame";

const StatBox = () => {
  const { remainingMines } = useMine();
  const { isCleared, isGameOver } = useGame();

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