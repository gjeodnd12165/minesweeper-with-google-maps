import React from "react";
import * as d3 from "d3";
import Cell from "./Cell";
import { CellImage } from "./CellImage";
import { Datum } from "../types";
import { boardHeight, boardWidth } from "../constants";
import { useData } from "../hooks/useData";
import { useVoronoi } from "../hooks/useVoronoi";
import { useCell } from "../hooks/useCell";
import { useMine } from "../hooks/useMine";


interface Props {
  data: Datum[] | null;

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

const Board = (): React.JSX.Element => {
  const { data } = useData();
  const { voronoi, xScale, yScale } = useVoronoi();
  const { flaggedCells, adjacentCells, revealedCells, hoveredCell } = useCell();
  const { mines, adjacentMines } = useMine();

  const voronoiCells = data!.map((d, i) => {
    const path = voronoi.renderCell(i);
    const centroid = d3.polygonCentroid(voronoi.cellPolygon(i));
    const isFlagged = flaggedCells.includes(i);
    return (
      <React.Fragment key={i}>
        <Cell
          id={i}
          path={path}

          x={xScale(centroid[0])}
          y={yScale(centroid[1])}
          isHovered={i===hoveredCell}
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
      </React.Fragment>
    );
  });



  return (
    <svg width={boardWidth} height={boardHeight} viewBox={`0,0,${boardWidth},${boardHeight}`}>
      {voronoiCells}
    </svg>
  );
};

export default Board;
