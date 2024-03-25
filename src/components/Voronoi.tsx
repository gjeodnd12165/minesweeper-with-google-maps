import React, { useMemo, useState } from "react";
import * as d3 from "d3";
import Cell from "./Cell";
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
  flaggedCells: number[];
  setFlaggedCells: React.Dispatch<React.SetStateAction<number[]>>
  clickedCells: number[];
  setClickedCells: React.Dispatch<React.SetStateAction<number[]>>
};

const Voronoi = ({ data, option: {width, height}, hoveredCell, setHoveredCell, mines, flaggedCells, setFlaggedCells, clickedCells, setClickedCells }: Props): React.JSX.Element => {
  const xScale = d3.scaleLinear().domain([0, width]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, height]).range([0, height]);

  const delaunay:d3.Delaunay<d3.Delaunay.Point> = useMemo(() => {
    const formattedData: [number, number][] = data.map((d) => [xScale(d.x), yScale(d.y)]);
    return d3.Delaunay.from(formattedData);
  }, []);

  const voronoi = useMemo(() => {
    console.log("voronoi");
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

          checkers={{
            isHovered: i==hoveredCell,
            isAdjacent: adjacentCells[hoveredCell ?? -1]?.includes(i),
            isFlagged: isFlagged
          }}
          hasMine={mines.includes(i)}
          adjacentMines={adjacentMines[i]}

          setHoveredCell={setHoveredCell}
          flaggedCells={flaggedCells}
          setFlaggedCells={setFlaggedCells}
          clickedCells={clickedCells}
          setClickedCells={setClickedCells}
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
