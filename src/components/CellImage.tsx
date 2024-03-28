import React from "react";


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
  return (
    isClicked ? 
    adjacentMines ? <text x={cx} y={cy} textAnchor="middle" fontSize="10" fill="black">{adjacentMines}</text> : <></> 
    : isFlagged ? 
    <circle 
      key={`point/${id}`} 
      cx={cx} 
      cy={cy} 
      r={4}
      fill={
        "blue"
    } 
    /> : <></>
  );
}