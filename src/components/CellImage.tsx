import React from "react";


interface Props {
  id: number;
  cx: number;
  cy: number;
  hasMine: boolean;
}

export const CellImage = ({ id, cx, cy, hasMine }: Props) => {
  return (
    <circle 
      key={`point/${id}`} 
      cx={cx} 
      cy={cy} 
      r={4}
      fill={hasMine ? "red" : "black"} 
    />
  );
}