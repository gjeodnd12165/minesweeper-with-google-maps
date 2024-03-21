import React from "react";

interface Props {
  id: number;
  path: string;
  isHovered: boolean;
  isAdjacent: boolean;
  hasMine: boolean;
  adjacentMines: number;
  centroid: [number, number];

  setHoveredItem: React.Dispatch<React.SetStateAction<number | null>>
}

export const Cell = ({ id, path, isHovered, isAdjacent, hasMine, adjacentMines, centroid, setHoveredItem }: Props) => {
  const polygon = (
    <path
    key={`cell/${id}`}
    d={path}
    stroke="grey"
    fill={
      isHovered ? "grey" :
      isAdjacent ? "lightgrey" : "transparent"
    }
    opacity={0.5}
    onMouseOver={() => {
      setHoveredItem(id);
    }}
    onClick={() => {
      alert(adjacentMines);
    }}
    />
  );
  const circle = (
    <circle 
      key={`point/${id}`} 
      cx={centroid[0]} 
      cy={centroid[1]} 
      r={4}
      fill={hasMine ? "red" : "black"} 
      />
  )


  return (
    <>
      {polygon}
      {circle}
    </>
  )
}