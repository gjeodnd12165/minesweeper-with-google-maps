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
  const xScale = d3.scaleLinear().domain([0, areaWidth]).range([0, areaWidth]);
  const yScale = d3.scaleLinear().domain([0, areaHeight]).range([0, areaHeight]);

  const [revealedCells, setRevealedCells] = useState<number[]> ([]);
  const [flaggedCells, setFlaggedCells] = useState<number[]> ([]);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  const [mines, setMines] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);


  useEffect(() => {
    setRevealedCells([]);
    setFlaggedCells([]);
    setHoveredCell(null);
    setMines(data ? _.sampleSize(_.range(data.length), data.length / mineRate) : []);
  }, [data]); // data가 재 로딩 되었을 때 실행되는 함수
  const names: string[] = useMemo(() => {
    return data?.map((d) => d.name) ?? ["nodes not found"];
  }, [data]);
  const voronoi = useMemo(() => {
    const formattedData: [number, number][] = data?.map((d) => [xScale(d.x), yScale(d.y)]) ?? [[0,0]];
    const delaunay = d3.Delaunay.from(formattedData);
    return delaunay.voronoi([0, 0, areaWidth, areaHeight]);
  }, [data, xScale, yScale]);
  const adjacentCells: number[][] = useMemo(() => {
    return _.range(data?.length ?? 0).map((cell) => {
      return [...voronoi.neighbors(cell)]
    });
  }, [data, voronoi]);
  const adjacentMines: number[] = useMemo(() => {
    return adjacentCells.map((cell) => {
      return cell.filter((adjs) => (mines.includes(adjs))).length
    });
  }, [mines, adjacentCells]);
  const isCleared: boolean = useMemo(() => {
    return _.isEqual(mines.sort(), flaggedCells.sort());
  }, [mines, flaggedCells]);

  /* handlers */
  const handleCellHover = (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    setHoveredCell(id);
  }
  const handleCellLClick = (clickedCell: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    if (revealedCells.includes(clickedCell)) return;
    revealCell(clickedCell);
  }
  const revealCell = (clickedCell: number) => {
    if (mines.includes(clickedCell)) {
      if (!revealedCells.length) {
        let newMines = data ? _.sampleSize(_.range(data.length), data.length / mineRate) : [];
        while (newMines.includes(clickedCell)) { 
          // re-calculate mines until mines[] doesn't inlcude clickedCell
          console.log("re-calc mines");
          newMines = data ? _.sampleSize(_.range(data.length), data.length / mineRate) : [];
        }
        setMines(newMines);
        setRevealedCells([clickedCell]);
        return; 
      }
      else {
        setIsGameOver(true);
        return;
      }
    }
    
    if (adjacentMines[clickedCell]) {
      // 주변에 지뢰가 있다면 그 셀만 밝히기
      setRevealedCells([...revealedCells, clickedCell]);
    }
    else {
      // 주변 지뢰가 없다면 BFS 
      const queue = [clickedCell];
      const visited = [clickedCell, ...revealedCells];
      while (queue.length > 0) {
        const currentCell: number | undefined = queue.shift();
        if (currentCell === undefined) continue;
        // 현재 셀에 인접한 셀 순회
        for (const cell of adjacentCells[currentCell]) {
          // 인접한 셀이 밝혀진 셀이 아니거나, 지뢰가 아니라면 밝혀질 셀 목록인 큐에 추가
          if (!visited.includes(cell)) {
            if (!adjacentMines[cell]){
              queue.push(cell);              
            }
            visited.push(cell);
          }
        }
      }
      setRevealedCells([...visited]);
    }
  }
  const handleCellDoubleClick = (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    if (!revealedCells.includes(id)) return;
    const adjacentFlaggedCells = adjacentCells[id].filter((cellId) => flaggedCells.includes(cellId));
    if (adjacentFlaggedCells.length === adjacentMines[id]) {
      adjacentCells[id]
        .filter((cellId) => !flaggedCells.includes(cellId))
        .forEach((cellId) => {
          revealCell(cellId);
        })
    }
  }
  const handleCellRClick = (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    // 깃발이 있으면 빼고, 없으면 넣기
    if (revealedCells.includes(id)) return; // 이미 밝혀진 셀이면 깃발 X
    setFlaggedCells(flaggedCells.includes(id) ? flaggedCells.filter((cell) => (id !== cell)) : [...flaggedCells, id]);
  }
  /* handlers */

  return (
    <GameContext.Provider value={{
      isGameOver: isGameOver,
      isCleared: isCleared,
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
