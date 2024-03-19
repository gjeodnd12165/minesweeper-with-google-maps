import React, { useMemo, useState } from "react";
import * as d3 from "d3";


interface Props {
  width: number;
  height: number;
  data: { x: number; y: number }[];
};


export const Voronoi = ({ width, height, data }: Props) => {
  const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, 100]).range([0, height]);

  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const allCircles = data.map((d, i) => {
    return (
      <>
        <circle key={`point/${i}`} cx={xScale(d.x)} cy={yScale(d.y)} r={4} />
        {hoveredItem === i && (
          <circle
            key={`redCircle/${i}`}
            cx={xScale(d.x)}
            cy={yScale(d.y)}
            r={10}
            fill="transparent"
            stroke="red"
            strokeWidth={3}
          />
        )}
      </>
    );
  });

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
  const voronoiCells = data.map((d, i) => {
    const path = voronoi.renderCell(i);
    const adjacentCells: number[] = [...voronoi.neighbors(hoveredItem ?? -1)];
    return (
      <path
      key={`cell/${i}`}
      d={path}
      stroke="grey"
      fill={adjacentCells.includes(i) ? "grey" : "transparent"}
      opacity={0.5}
      onMouseOver={() => {
        setHoveredItem(i);
      }}
      />
    );
  });


  return (
    <svg width={width} height={height}>
      {allCircles}
      {allDelaunayShapes}
      {voronoiCells}
    </svg>
  );
};
