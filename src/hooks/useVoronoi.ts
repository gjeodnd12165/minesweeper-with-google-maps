import * as d3 from "d3";
import { useMemo } from "react";
import { useData } from "./useData";
import { areaHeight, areaWidth } from "../constants";

export const useVoronoi = () => {
  const { data } = useData();

  const xScale = useMemo(() => d3.scaleLinear().domain([0, areaWidth]).range([0, areaWidth]), []);
  const yScale = useMemo(() => d3.scaleLinear().domain([0, areaHeight]).range([0, areaHeight]), []);

  const voronoi = useMemo(() => {
    const formattedData: [number, number][] = data.map(d => [xScale(d.x), yScale(d.y)]);
    const delaunay = d3.Delaunay.from(formattedData);
    return delaunay.voronoi([0, 0, areaWidth, areaHeight]);
  }, [data, xScale, yScale]);

  return { voronoi, xScale, yScale };
};
