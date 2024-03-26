import React from "react";
import { Handlers } from "../types";


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