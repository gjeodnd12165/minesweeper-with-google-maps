import * as d3 from "d3";
import { useMemo } from "react";
import { useData } from "./useData";
import { areaHeight, areaWidth } from "../constants";
import { ConvertedData } from "../logics/convertData";

export const useVoronoi = (data: ConvertedData[] | null) => {
  const xScale = useMemo(() => d3.scaleLinear().domain([0, areaWidth]).range([0, areaWidth]), []);
  const yScale = useMemo(() => d3.scaleLinear().domain([0, areaHeight]).range([0, areaHeight]), []);

  const voronoi = useMemo(() => {
    if (!data) return null;
    const formattedData: [number, number][] = data?.map(d => [xScale(d.x), yScale(d.y)]);
    const delaunay = d3.Delaunay.from(formattedData);
    return delaunay.voronoi([0, 0, areaWidth, areaHeight]);
  }, [data, xScale, yScale]);

  return { voronoi, xScale, yScale };
};
