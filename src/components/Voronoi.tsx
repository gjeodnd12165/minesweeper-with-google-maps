import React, { useMemo, useState } from "react";
import * as d3 from "d3";
import { Cell } from "./Cell";
import * as _ from 'lodash';

import BombIcon from '../assets/bomb.svg';


interface Props {
  width: number;
  height: number;
  data: {
    name: string,
    x: number,
    y: number
  }[];

  hoveredCell: number | null;
  setHoveredCell: React.Dispatch<React.SetStateAction<number | null>>
  
};

export const Voronoi = ({ width, height, data, hoveredCell, setHoveredCell }: Props) => {
  const xScale = d3.scaleLinear().domain([0, width]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, height]).range([0, height]);

  // const allCircles = data.map((d, i) => {
  //   return (
  //     <>
  //       <circle key={`point/${i}`} cx={xScale(d.x)} cy={yScale(d.y)} r={4} />
  //     </>
  //   );
  // });

  // Voronoi things
  // see delaunay.neighbors
  const delaunay:d3.Delaunay<d3.Delaunay.Point> = useMemo(() => {
    const formattedData: [number, number][] = data.map((d) => [xScale(d.x), yScale(d.y)]);
    return d3.Delaunay.from(formattedData);
  }, []);
  const delaunayPath = delaunay.render();
  const allDelaunayShapes = (
    <path id={`shape`} d={delaunayPath} stroke="grey" fill="transparent" opacity={0.2} />
  )

  const voronoi = useMemo(() => {
    return delaunay.voronoi([0, 0, width, height]);
  }, [data]);
  const cellCount = data.length;
  const mines = useMemo(() => {
    return _.sampleSize(_.range(cellCount), cellCount / 2);
  }, []);
  const voronoiCells = data.map((d, i) => {
    const path = voronoi.renderCell(i);
    const adjacentCells: number[] = [...voronoi.neighbors(hoveredCell ?? -1)];
    const adjacentMines: number = adjacentCells.filter((cell) => (mines.includes(cell))).length;
    const centroid = d3.polygonCentroid(voronoi.cellPolygon(i));
    return (
      <Cell
        id={i}
        path={path}
        isHovered={i==hoveredCell}
        isAdjacent={adjacentCells.includes(i)}
        hasMine={mines.includes(i)}
        adjacentMines={adjacentMines}
        centroid={[xScale(centroid[0]), yScale(centroid[1])]}

        setHoveredItem={setHoveredCell}
      />
    );
  });


  return (
    <svg width={width} height={height}>
      {/* {allCircles} */}
      {/* {allDelaunayShapes} */}
      {voronoiCells}
    </svg>
  );
};
