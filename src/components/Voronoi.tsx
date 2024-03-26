import React, { useMemo, useState } from "react";
import * as d3 from "d3";
import Cell from "./Cell";
import * as _ from 'lodash';
import { CellImage } from "./CellImage";
import { Handlers, Datum, Options } from "../types";


interface Props {
  data: Datum[];
  options: Options;

  hoveredCell: number | null;
  mines: number[];
  flaggedCells: number[];
  clickedCells: number[];
  handlers: Handlers;

  voronoi: d3.Voronoi<d3.Delaunay.Point>;
  adjacentCells: number[][];
  adjacentMines: number[];
  xScale: d3.ScaleLinear<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
};

const Voronoi = ({ data, options: {width, height}, hoveredCell, mines, flaggedCells, clickedCells, handlers, voronoi, adjacentCells, adjacentMines, xScale, yScale }: Props): React.JSX.Element => {


  const voronoiCells = data.map((d, i) => {
    const path = voronoi.renderCell(i);
    const centroid = d3.polygonCentroid(voronoi.cellPolygon(i));
    const isFlagged = flaggedCells.includes(i);
    return (
      <>
        <Cell
          id={i}
          path={path}


          isHovered={i==hoveredCell}
          isAdjacent={adjacentCells[hoveredCell ?? -1]?.includes(i)}
          isClicked={clickedCells.includes(i)}
          handlers={handlers}
        >
          <CellImage
            id={i}
            cx={xScale(centroid[0])}
            cy={yScale(centroid[1])}
            adjacentMines={adjacentMines[i]}
            hasMine={mines.includes(i)}
            isFlagged={isFlagged}
            isClicked={clickedCells.includes(i)}
          />
        </Cell>
      </>
    );
  });


  return (
    <svg width={width} height={height}>
      {voronoiCells}
    </svg>
  );
};

export default Voronoi;
