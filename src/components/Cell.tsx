import React from "react";


interface Checkers {
  isHovered: boolean;
  isAdjacent: boolean;
}
interface Props {
  children: JSX.Element;
  id: number;
  path: string;
  checkers: Checkers;
  hasMine: boolean;
  adjacentMines: number;
  setHoveredCell: React.Dispatch<React.SetStateAction<number | null>>
  flagCount: number;
}

export const Cell = ({ children, id, path, checkers: {isHovered, isAdjacent}, hasMine, adjacentMines, setHoveredCell, flagCount }: Props): JSX.Element => {
  let flagged = false;

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
    />
  );

  return (
    <svg
      onMouseOver={() => {
        setHoveredCell(id);
      }}
      onClick={() => {
        alert(hasMine ? "I'm a mine!" : adjacentMines);
      }}
      onContextMenu={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        flagged = !flagged
        flagged ? flagCount++ : flagCount--;
      }}
    >
      {polygon}
      {children}
    </svg>
  )
}