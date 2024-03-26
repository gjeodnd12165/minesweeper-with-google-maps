import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import './App.css';
import Map from './components/Map';
import Voronoi from './components/Voronoi';
import _ from 'lodash';
import getData from './logics/data';
import { ConvertedData } from './logics/convertData';
import LocationForm from './components/LocationForm';
import { Handlers, Options } from './types';


function App() {
  const width = 900, height = 900, mineRate = 10;
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

  const [clickedCells, setClickedCells] = useState<number[]> ([]);
  const [flaggedCells, setFlaggedCells] = useState<number[]> ([]);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  useEffect(() => {
    setClickedCells([]);
    setFlaggedCells([]);
    setHoveredCell(null);
  }, [data]);
  const mines: number[] = useMemo(() => {
    if (!data) return new Array<number>();
    return _.sampleSize(_.range(data.length), data.length / mineRate);
  }, [data]);
  const cleared: boolean = useMemo(() => {
    const b = _.isEqual(mines.sort(), flaggedCells.sort());
    return b;
  }, [data, flaggedCells]);
  
  const handleCellHover = (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    setHoveredCell(id);
  };

  const handleCellLClick = (clickedCellId: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    if (mines.includes(clickedCellId)){
      alert("GAME OVER!");
      return;
    }

    const addClickedCells = (id: number) => {
      setClickedCells([...clickedCells, id]);
    }
    // some graph traversal logics here.
  }

  const handleCellRClick = (id: number): React.MouseEventHandler<SVGSVGElement> => (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    // 깃발이 있으면 빼고, 없으면 넣기
    setFlaggedCells(flaggedCells.includes(id) ? flaggedCells.filter((cell) => (id !== cell)) : [...flaggedCells, id]);
  }

  const handlers: Handlers = {
    handleCellHover: handleCellHover,
    handleCellLClick: handleCellLClick,
    handleCellRClick: handleCellRClick
  }
  
  const options: Options = {
    width: width,
    height: height,
  }

  return (
    <>
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
            clickedCells={clickedCells}
            handlers={handlers}
          />

        </>
      )}
    </>
  );
  
}

export default App;
