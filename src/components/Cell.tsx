import React, { useContext } from "react";
import { Handlers } from "../types";
import { GameOverContext } from "../context/GameContext";


interface Props {
  children: JSX.Element;
  id: number;
  path: string;
  isHovered: boolean;
  isAdjacent: boolean;
  isClicked: boolean;
  handlers: Handlers;
}

const Cell = ({ children, id, path, isHovered, isAdjacent, isClicked, handlers: {handleCellHover, handleCellLClick, handleCellRClick} }: Props): React.JSX.Element => {
  const isGameOver = useContext(GameOverContext);

  const polygon = (
    <path
    key={`cell/${id}`}
    d={path}
    stroke="grey"
    fill={
      isClicked ? "#FFFFAA" :
      isHovered ? "grey" :
      isAdjacent ? "lightgrey" : "transparent"
    }
    opacity={0.5}
    />
  );

  return (
    isGameOver ? <svg>{polygon}{children}</svg> :
    <svg
      onMouseOver={handleCellHover(id)}
      onClick={handleCellLClick(id)}
      onContextMenu={handleCellRClick(id)}
    >
      {polygon}
      {children}
    </svg>
  )
}

export default Cell;