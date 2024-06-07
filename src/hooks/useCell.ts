import { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { ConvertedData } from "../logics/convertData";
import * as d3 from "d3";

export const useCell = (data: ConvertedData[] | null, voronoi: d3.Voronoi<d3.Delaunay.Point> | null) => {
  const [revealedCells, setRevealedCells] = useState<number[]>([]);
  const [flaggedCells, setFlaggedCells] = useState<number[]>([]);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  useEffect(() => {
    setRevealedCells([]);
    setFlaggedCells([]);
    setHoveredCell(null);
  }, [data]);

  const names = useMemo(() => {
    return data?.map(d => d.name) ?? ["nodes not found"];
  }, [data]);

  const adjacentCells = useMemo(() => {
    if (!voronoi || !data) return [[]];
    return _.range(data.length).map(cell => [...voronoi.neighbors(cell)]);
  }, [data, voronoi]);

  return { names, hoveredCell, adjacentCells, flaggedCells, revealedCells, setters: {
    setRevealedCells,
    setFlaggedCells,
    setHoveredCell,
  }};
};
