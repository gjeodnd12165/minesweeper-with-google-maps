import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Map from './components/Map';
import Board from './components/Board';
import StatBox from './components/StatBox';
import _ from 'lodash';
import { rawData, getData, center } from './logics/data';
import { ConvertedData } from './logics/convertData';
import LocationForm from './components/LocationForm';
import * as d3 from 'd3';
import { GameContext } from './context/GameContext';
import { areaHeight, areaWidth, mineRate } from './constants';
import { HandlerContext } from './context/HandlerContext';
import Loading from './components/Loading';
import { useData } from './hooks/useData';
import { useMine } from './hooks/useMine';
import { useVoronoi } from './hooks/useVoronoi';
import { useCell } from './hooks/useCell';
import { useGame } from './hooks/useGame';
import { useCellMouseHandler } from './hooks/useCellMouseHandler';


function App() {
  const { data, location, setters: dataSetters } = useData();
  const { voronoi, xScale, yScale } = useVoronoi(data);
  const { names, hoveredCell, adjacentCells, flaggedCells, revealedCells, setters: cellSetters } = useCell(data, voronoi);
  const { mines, adjacentMines, setters: mineSetters } = useMine(data, adjacentCells, flaggedCells);
  const { isGameOver, isCleared, setters: gameSetters } = useGame(mines, flaggedCells);
  const { handlers: { handleCellDoubleClick, handleCellHover, handleCellLClick, handleCellRClick } } = useCellMouseHandler({
    variables: {
      revealedCells,
      mines,
      data,
      adjacentMines,
      adjacentCells,
      flaggedCells,
    },
    setters: {
      setHoveredCell: cellSetters.setHoveredCell,
      setMines: mineSetters.setMines,
      setRevealedCells: cellSetters.setRevealedCells,
      setIsGameOver: gameSetters.setIsGameOver,
      setFlaggedCells: cellSetters.setFlaggedCells,
    }
  })

  // const xScale = d3.scaleLinear().domain([0, areaWidth]).range([0, areaWidth]);
  // const yScale = d3.scaleLinear().domain([0, areaHeight]).range([0, areaHeight]);

  // const [revealedCells, setRevealedCells] = useState<number[]> ([]);
  // const [flaggedCells, setFlaggedCells] = useState<number[]> ([]);
  // const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  // // const [mines, setMines] = useState<number[]>([]);
  // const [isGameOver, setIsGameOver] = useState<boolean>(false);


  // useEffect(() => {
  //   setRevealedCells([]);
  //   setFlaggedCells([]);
  //   setHoveredCell(null);
  //   setMines(data ? _.sampleSize(_.range(data.length), data.length / mineRate) : []);
  // }, [data]); // data가 재 로딩 되었을 때 실행되는 함수
  // const names: string[] = useMemo(() => {
  //   return data?.map((d) => d.name) ?? ["nodes not found"];
  // }, [data]);
  // const voronoi = useMemo(() => {
  //   const formattedData: [number, number][] = data?.map((d) => [xScale(d.x), yScale(d.y)]) ?? [[0,0]];
  //   const delaunay = d3.Delaunay.from(formattedData);
  //   return delaunay.voronoi([0, 0, areaWidth, areaHeight]);
  // }, [data, xScale, yScale]);
  // const adjacentCells: number[][] = useMemo(() => {
  //   return _.range(data?.length ?? 0).map((cell) => {
  //     return [...voronoi.neighbors(cell)]
  //   });
  // }, [data, voronoi]);
  // const adjacentMines: number[] = useMemo(() => {
  //   return adjacentCells.map((cell) => {
  //     return cell.filter((adjs) => (mines.includes(adjs))).length
  //   });
  // }, [mines, adjacentCells]);
  // const isCleared: boolean = useMemo(() => {
  //   return _.isEqual(mines.sort(), flaggedCells.sort());
  // }, [mines, flaggedCells]);

  

  return (
    <GameContext.Provider value={{
      isGameOver: isGameOver,
      isCleared: isCleared,
      names: names
    }}>
      <LocationForm
        location={location}
        setLocation={dataSetters.setLocation}
      />
      {!data ? (
        <Loading />
      ) : (
        <>
          <Map 
          position={center} 
          data={rawData}
          />
          <StatBox remainingMines={mines.length - flaggedCells.length}></StatBox>
  
          <HandlerContext.Provider value={{
            handleCellHover: handleCellHover,
            handleCellLClick: handleCellLClick,
            handleCellDoubleClick: handleCellDoubleClick,
            handleCellRClick: handleCellRClick
          }}>
          <Board
            data={data}
            hoveredCell={hoveredCell}
            mines={mines}
            flaggedCells={flaggedCells}
            revealedCells={revealedCells}

            voronoi={voronoi!}
            adjacentCells={adjacentCells}
            adjacentMines={adjacentMines}
            xScale={xScale}
            yScale={yScale}
          />
          </HandlerContext.Provider>
        </>
      )}
    </GameContext.Provider>
  );
  
}

export default App;
