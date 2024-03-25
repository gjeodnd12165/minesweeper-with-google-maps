import React from "react";


interface Checkers {
  isHovered: boolean;
  isAdjacent: boolean;
  isFlagged: boolean;
}
interface Props {
  children: JSX.Element;
  id: number;
  path: string;
  checkers: Checkers;
  hasMine: boolean;
  adjacentMines: number;
  setHoveredCell: React.Dispatch<React.SetStateAction<number | null>>;
  flaggedCells: number[];
  setFlaggedCells: React.Dispatch<React.SetStateAction<number[]>>;
  clickedCells: number[];
  setClickedCells: React.Dispatch<React.SetStateAction<number[]>>;
}

const Cell = ({ children, id, path, checkers: {isHovered, isAdjacent, isFlagged}, hasMine, adjacentMines, setHoveredCell, flaggedCells, setFlaggedCells, clickedCells, setClickedCells }: Props): React.JSX.Element => {

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
        if(hasMine){
          alert("GAME OVER!");
        }
        else {
          setClickedCells([...clickedCells, id]);
        }
      }}
      onContextMenu={(e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault();
        // 깃발이 있으면 빼고, 없으면 넣기
        setFlaggedCells(isFlagged ? flaggedCells.filter((cell) => (id !== cell)) : [...flaggedCells, id]);          
      }}
    >
      {polygon}
      {children}
    </svg>
  )
}

export default Cell;