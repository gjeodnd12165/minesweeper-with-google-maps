import React, { useContext } from "react";
import { parsePath, roundCorners } from "svg-round-corners";
import { Handlers } from "../types";
import { GameContext } from "../context/GameContext";
import { ThemeContext } from "../context/ThemeContext";
import getScaledPath from "../logics/scaledPath";


interface Props {
  children: JSX.Element;
  id: number;
  path: string;
  x: number;
  y: number;
  isHovered: boolean;
  isAdjacent: boolean;
  isRevealed: boolean;
  handlers: Handlers;
}

const Cell = ({ children, id, path, x, y, isHovered, isAdjacent, isRevealed, handlers: {handleCellHover, handleCellLClick, handleDoubleClick, handleCellRClick} }: Props): React.JSX.Element => {
  const { isGameOver, names } = useContext(GameContext);
  const { revealedColor, hoveredColor, adjacentColor, normalColor } = useContext(ThemeContext);

  let prettyPath = path;
  prettyPath = getScaledPath(prettyPath, x, y, 0.95);
  prettyPath = roundCorners(prettyPath, 10).path;

  const polygon = (
    <path
      key={`cell/${id}`}
      d={prettyPath}
      stroke="transparent"
      fill={
        isRevealed ? revealedColor :
        isHovered ? hoveredColor :
        isAdjacent ? adjacentColor : normalColor
      }
    />
  );



  return (
    <g
      onMouseOver={isGameOver ? undefined : handleCellHover(id)}
      onClick={isGameOver ? undefined : handleCellLClick(id)}
      onDoubleClick={isGameOver ? undefined: handleDoubleClick(id)}
      onContextMenu={isGameOver ? undefined : handleCellRClick(id)}
    >
      <title>{names[id]}</title>
      {polygon}
      {children}
    </g>
  )
}

export default Cell;