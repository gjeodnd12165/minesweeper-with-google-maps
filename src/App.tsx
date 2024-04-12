import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Map from './components/Map';
import Board from './components/Board';
import _ from 'lodash';
import getData from './logics/data';
import { ConvertedData } from './logics/convertData';
import LocationForm from './components/LocationForm';
import { Handlers, Options } from './types';
import * as d3 from 'd3';
import { GameContext } from './context/GameContext';
import { areaHeight, areaWidth, mineRate } from './constants';
import { HandlerContext } from './context/HandlerContext';
import { handleCellHoverFactory, handleCellLClickFactory, handleCellDoubleClickFactory, handleCellRClickFactory } from './handlers';


function App() {
  const [data, setData] = useState<ConvertedData[] | null>(null);
  const [location, setLocation] = useState<string>("강남역");
  useEffect(() => {
    setData(null);
    const fetchData = async () => {
      const d: ConvertedData[] = await getData(location, areaWidth, areaHeight);
      setData(d);
    }
    fetchData();
  }, [location]);

  const [revealedCells, setRevealedCells] = useState<number[]> ([]);
  const [flaggedCells, setFlaggedCells] = useState<number[]> ([]);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [mines, setMines] = useState<number[]>([]);
  const calcNewMines = () => {
    return data ? _.sampleSize(_.range(data.length), data.length / mineRate) : [];
  }
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  useEffect(() => {
    if (isGameOver) {
      alert("Game Over!");
    }
  }, [isGameOver]);

  useEffect(() => {
    setRevealedCells([]);
    setFlaggedCells([]);
    setHoveredCell(null);
    setMines(calcNewMines());
  }, [data]); // data가 재 로딩 되었을 때 실행되는 함수
  const cleared: boolean = useMemo(() => {
    return _.isEqual(mines.sort(), flaggedCells.sort());
  }, [mines, flaggedCells]);

  const xScale = d3.scaleLinear().domain([0, areaWidth]).range([0, areaWidth]);
  const yScale = d3.scaleLinear().domain([0, areaHeight]).range([0, areaHeight]);

  const names: string[] = useMemo(() => {
    return data?.map((d) => d.name) ?? ["nodes not found"];
  }, [data]);
  const delaunay:d3.Delaunay<d3.Delaunay.Point> = useMemo(() => {
    const formattedData: [number, number][] = data?.map((d) => [xScale(d.x), yScale(d.y)]) ?? [[0,0]];
    return d3.Delaunay.from(formattedData);
  }, [data]);
  const voronoi = useMemo(() => {
    return delaunay.voronoi([0, 0, areaWidth, areaHeight]);
  }, [data]);

  const adjacentCells: number[][] = useMemo(() => {
    return _.range(data?.length ?? 0).map((cell) => {
      return [...voronoi.neighbors(cell)]
    });
  }, [data]);
  const adjacentMines: number[] = useMemo(() => {
    return adjacentCells.map((cell) => {
      return cell.filter((adjs) => (mines.includes(adjs))).length
    });
  }, [mines]);

  const handleCellHover = handleCellHoverFactory(setHoveredCell);
  const handleCellLClick = handleCellLClickFactory(
    mines, setMines, calcNewMines, 
    revealedCells, setRevealedCells,
    setIsGameOver, adjacentMines, adjacentCells
  );
  const handleCellDoubleClick = handleCellDoubleClickFactory(
    mines, setMines, calcNewMines, 
    revealedCells, setRevealedCells,
    setIsGameOver, adjacentMines, adjacentCells,
    flaggedCells
  );
  const handleCellRClick = handleCellRClickFactory(
    revealedCells, flaggedCells, setFlaggedCells
  )

  return (
    <GameContext.Provider value={{
      isGameOver: isGameOver,
      names: names
    }}>
      <LocationForm
        location={location}
        setLocation={setLocation}
      />
      {!data ? (
        <text fontSize={50}>LOADING...</text>
      ) : (
        <>
          {/* <Map 
          position={[37.49993, 127.02632]} 
          data={rawData}
          /> */}
          <button onClick={() => window.location.reload()}>Restart!</button>
          <div>{mines.length - flaggedCells.length} mines left</div>
          <div>
            {
              cleared ? "CLEAR!" : "You'll gonna make it!"
            }
          </div>
  
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

            voronoi={voronoi}
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
