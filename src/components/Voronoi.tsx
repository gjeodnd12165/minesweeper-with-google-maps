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
};

const Voronoi = ({ data, options: {width, height}, hoveredCell, mines, flaggedCells, clickedCells, handlers  }: Props): React.JSX.Element => {
  const xScale = d3.scaleLinear().domain([0, width]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, height]).range([0, height]);

  const delaunay:d3.Delaunay<d3.Delaunay.Point> = useMemo(() => {
    const formattedData: [number, number][] = data.map((d) => [xScale(d.x), yScale(d.y)]);
    return d3.Delaunay.from(formattedData);
  }, [data]);

  const voronoi = useMemo(() => {
    return delaunay.voronoi([0, 0, width, height]);
  }, [data]);

  
  const adjacentCells: number[][] = useMemo(() => {
    return _.range(data.length).map((cell) => {
      return [...voronoi.neighbors(cell)]
    });
  }, [data]);
  const adjacentMines: number[] = useMemo(() => {
    return adjacentCells.map((cell) => {
      return cell.filter((adjs) => (mines.includes(adjs))).length
    });
  }, [data]);


  
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
