import React, { useMemo, useState } from "react";
import * as d3 from "d3";
import { Cell } from "./Cell";
import * as _ from 'lodash';
import { CellImage } from "./CellImage";

interface Datum {
  name: string;
  x: number;
  y: number
}
interface Option {
  width: number;
  height: number;
}
interface Props {
  data: Datum[];
  option: Option;

  hoveredCell: number | null;
  setHoveredCell: React.Dispatch<React.SetStateAction<number | null>>
  mines: number[];
  flagCount:number;
};

export const Voronoi = ({ data, option: {width, height}, hoveredCell, setHoveredCell, mines, flagCount }: Props) => {
  const xScale = d3.scaleLinear().domain([0, width]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, height]).range([0, height]);

  const delaunay:d3.Delaunay<d3.Delaunay.Point> = useMemo(() => {
    const formattedData: [number, number][] = data.map((d) => [xScale(d.x), yScale(d.y)]);
    return d3.Delaunay.from(formattedData);
  }, []);

  const voronoi = useMemo(() => {
    return delaunay.voronoi([0, 0, width, height]);
  }, [data]);
  const adjacentCells: number[] = [...voronoi.neighbors(hoveredCell ?? -1)];
  const adjacentMines: number = adjacentCells.filter((cell) => (mines.includes(cell))).length;
  
  const voronoiCells = data.map((d, i) => {
    const path = voronoi.renderCell(i);
    const centroid = d3.polygonCentroid(voronoi.cellPolygon(i));
    return (
      <>
        <Cell
          id={i}
          path={path}

          checkers={{
            isHovered: i==hoveredCell,
            isAdjacent: adjacentCells.includes(i)
          }}
          hasMine={mines.includes(i)}
          adjacentMines={adjacentMines}

          setHoveredCell={setHoveredCell}
          flagCount={flagCount}
        >
          <CellImage
            id={i}
            cx={xScale(centroid[0])}
            cy={yScale(centroid[1])}
            hasMine={mines.includes(i)}
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
