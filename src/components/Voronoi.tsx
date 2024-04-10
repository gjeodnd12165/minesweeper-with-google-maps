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
      <svg>
        <Cell
          id={i}
          path={path}


          isHovered={i==hoveredCell}
          isAdjacent={adjacentCells[hoveredCell ?? -1]?.includes(i)}
          isRevealed={clickedCells.includes(i)}
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
      </svg>
    );
  });

  const filter = (
    <defs>
      <filter id="normal">
        <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur1"/>
        <feSpecularLighting result="specOut" in="blur1" specularConstant="1.2" specularExponent="12" lightingColor="#fff">
          <feDistantLight azimuth="225" elevation="20"/>
        </feSpecularLighting>
        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1.2" k3="1.2" k4="0" result="result"/>
        <feComposite operator="in" in2="SourceGraphic"/>
      </filter>
      <filter id="revealed">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="desenfoque" />
        <feFlood floodColor="black"/>
        <feComposite operator="out" in2="SourceGraphic"/>
        <feGaussianBlur stdDeviation="10"/>
        <feComposite operator="atop" in2="SourceGraphic"/>
      </filter>
    </defs>
  )


  return (
    <svg width={width} height={height}>
      {voronoiCells}
      {filter}
    </svg>
  );
};

export default Voronoi;
