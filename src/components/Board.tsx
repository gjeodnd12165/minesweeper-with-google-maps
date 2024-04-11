import React, { useMemo, useState } from "react";
import * as d3 from "d3";
import Cell from "./Cell";
import * as _ from 'lodash';
import { CellImage } from "./CellImage";
import { Handlers, Datum, Options } from "../types";
import { boardHeight, boardWidth } from "../constants";


interface Props {
  data: Datum[];

  hoveredCell: number | null;
  mines: number[];
  flaggedCells: number[];
  revealedCells: number[];

  voronoi: d3.Voronoi<d3.Delaunay.Point>;
  adjacentCells: number[][];
  adjacentMines: number[];
  xScale: d3.ScaleLinear<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
};

const Board = ({ data, hoveredCell, mines, flaggedCells, revealedCells, voronoi, adjacentCells, adjacentMines, xScale, yScale }: Props): React.JSX.Element => {


  const voronoiCells = data.map((d, i) => {
    const path = voronoi.renderCell(i);
    const centroid = d3.polygonCentroid(voronoi.cellPolygon(i));
    const isFlagged = flaggedCells.includes(i);
    return (
      <>
        <Cell
          id={i}
          path={path}

          x={xScale(centroid[0])}
          y={yScale(centroid[1])}
          isHovered={i==hoveredCell}
          isAdjacent={adjacentCells[hoveredCell ?? -1]?.includes(i)}
          isRevealed={revealedCells.includes(i)}
        >
          <CellImage
            id={i}
            x={xScale(centroid[0])}
            y={yScale(centroid[1])}
            adjacentMines={adjacentMines[i]}
            hasMine={mines.includes(i)}
            isFlagged={isFlagged}
            isClicked={revealedCells.includes(i)}
          />
        </Cell>
      </>
    );
  });



  return (
    <svg width={boardWidth} height={boardHeight}>
      <rect width={boardWidth} height={boardHeight} fill="transparent"></rect>
      {voronoiCells}
    </svg>
  );
};

export default Board;
