import React, { useContext } from "react";
import { GameContext } from "../context/GameContext";


interface Props {
  id: number;
  x: number;
  y: number;
  adjacentMines: number;
  hasMine: boolean;
  isFlagged: boolean;
  isClicked: boolean;
}

export const CellImage = ({ id, x, y, adjacentMines, hasMine, isFlagged, isClicked }: Props) => {
  const { isGameOver } = useContext(GameContext);

  return (
    <text id={`cellImage/${id}`} x={x} y={y} textAnchor="middle" fontSize="10">
      {
        isGameOver && hasMine ? "💣" : 
        isFlagged ? "🚩" : 
        isClicked && adjacentMines ? adjacentMines : ""
      }
    </text>
  );
}