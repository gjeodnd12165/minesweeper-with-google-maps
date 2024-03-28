import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";


interface Props {
  id: number;
  cx: number;
  cy: number;
  adjacentMines: number;
  hasMine: boolean;
  isFlagged: boolean;
  isClicked: boolean;
}

export const CellImage = ({ id, cx, cy, adjacentMines, hasMine, isFlagged, isClicked }: Props) => {
  const { isGameOver } = useContext(GameContext);

  return (
    isGameOver && hasMine ? <circle 
      key={`image/${id}`} 
      cx={cx} 
      cy={cy} 
      r={4}
      fill={"red"} 
    /> :
    isFlagged ? <circle 
      key={`image/${id}`} 
      cx={cx} 
      cy={cy} 
      r={4}
      fill={"blue"} 
    /> :
    isClicked && adjacentMines ? <text x={cx} y={cy} textAnchor="middle" fontSize="10" fill="black">{adjacentMines}</text> :
    <></>  
  );
}