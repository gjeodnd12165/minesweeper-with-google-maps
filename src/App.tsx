import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Map from './components/Map';
import Voronoi from './components/Voronoi';
import _ from 'lodash';
import getData from './logics/data';
import { ConvertedData } from './logics/convertData';
import LocationForm from './components/LocationForm';
import { Handlers, Options } from './types';
import * as d3 from 'd3';
import { GameOverContext } from './context/GameContext';


function App() {
  const width = 900, height = 900, mineRate = 2;
  const [data, setData] = useState<ConvertedData[] | null>(null);
  const [location, setLocation] = useState<string>("강남역");
  useEffect(() => {
    setData(null);
    const fetchData = async () => {
      const d: ConvertedData[] = await getData(location, width, height);
      setData(d);
    }
    fetchData();
  }, [location]);

  const [revealedCells, setRevealedCells] = useState<number[]> ([]);
  const [flaggedCells, setFlaggedCells] = useState<number[]> ([]);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const [mines, setMines] = useState<number[]>([]);
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
    setMines(data ? _.sampleSize(_.range(data.length), data.length / mineRate) : []);
  }, [data]); // data가 재 로딩 되었을 때 실행되는 함수
  const cleared: boolean = useMemo(() => {
    return _.isEqual(mines.sort(), flaggedCells.sort());
  }, [mines, flaggedCells]);

  const xScale = d3.scaleLinear().domain([0, width]).range([0, width]);
  const yScale = d3.scaleLinear().domain([0, height]).range([0, height]);

  const delaunay:d3.Delaunay<d3.Delaunay.Point> = useMemo(() => {
    const formattedData: [number, number][] = data?.map((d) => [xScale(d.x), yScale(d.y)]) ?? [[0,0]];
    return d3.Delaunay.from(formattedData);
  }, [data]);

  const voronoi = useMemo(() => {
    return delaunay.voronoi([0, 0, width, height]);
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

  /* handlers */
  const handleCellHover = (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    setHoveredCell(id);
  };

  const handleCellLClick = (clickedCell: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
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
    if (revealedCells.includes(clickedCell)) return;
    
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

  const handleCellRClick = (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    // 깃발이 있으면 빼고, 없으면 넣기
    if (revealedCells.includes(id)) return; // 이미 밝혀진 셀이면 깃발 X
    setFlaggedCells(flaggedCells.includes(id) ? flaggedCells.filter((cell) => (id !== cell)) : [...flaggedCells, id]);
  }

  const handlers: Handlers = {
    handleCellHover: handleCellHover,
    handleCellLClick: handleCellLClick,
    handleCellRClick: handleCellRClick
  }
  /* handlers */
  
  const options: Options = {
    width: width,
    height: height,
  }

  return (
    <GameOverContext.Provider value={isGameOver}>
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
  
          <Voronoi
            data={data}
            options={options}
            hoveredCell={hoveredCell}
            mines={mines}
            flaggedCells={flaggedCells}
            clickedCells={revealedCells}
            handlers={handlers}

            voronoi={voronoi}
            adjacentCells={adjacentCells}
            adjacentMines={adjacentMines}
            xScale={xScale}
            yScale={yScale}
          />
        </>
      )}
    </GameOverContext.Provider>
  );
  
}

export default App;
