import React, { useContext } from "react";
import { Handlers } from "../types";
import { GameContext } from "../context/GameContext";
import { ThemeContext } from "../context/ThemeContext";


interface Props {
  children: JSX.Element;
  id: number;
  path: string;
  isHovered: boolean;
  isAdjacent: boolean;
  isRevealed: boolean;
  handlers: Handlers;
}

const Cell = ({ children, id, path, isHovered, isAdjacent, isRevealed, handlers: {handleCellHover, handleCellLClick, handleCellRClick} }: Props): React.JSX.Element => {
  const { isGameOver, names } = useContext(GameContext);
  const { revealedColor, hoveredColor, adjacentColor, normalColor } = useContext(ThemeContext);

  const polygon = (
    <path
      key={`cell/${id}`}
      d={path}
      stroke="transparent"
      fill={
        isRevealed ? revealedColor :
        isHovered ? hoveredColor :
        isAdjacent ? adjacentColor : normalColor
      }
      filter={`url(#${isRevealed ? "revealed" : "normal"})`}
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