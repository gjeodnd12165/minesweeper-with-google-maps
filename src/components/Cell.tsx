import React, { useContext } from "react";
import { Handlers } from "../types";
import { GameContext } from "../context/GameContext";


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
  const { isGameOver, names } = useContext(GameContext);

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
    <g
      onMouseOver={isGameOver ? undefined : handleCellHover(id)}
      onClick={isGameOver ? undefined : handleCellLClick(id)}
      onContextMenu={isGameOver ? undefined : handleCellRClick(id)}
    >
      <title>{names[id]}</title>
      {polygon}
      {children}
    </g>
  )
}

export default Cell;