import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import './App.css';
import Map from './components/Map';
import Voronoi from './components/Voronoi';
import _ from 'lodash';
import getData from './logics/data';
import { ConvertedData } from './logics/convertData';
import LocationForm from './components/LocationForm';


function App() {
  const width = 900, height = 900;
  const [data, setData] = useState<ConvertedData[] | null>(null);
  const [location, setLocation] = useState<string>("강남역");
  useEffect(() => {
    gd();
  }, [location]);
  const gd = async () => {
    const d: ConvertedData[] = await getData(location, width, height);
    setData(d);
  }

  const [clickedCells, setClickedCells] = useState<number[]> ([]);
  const [flaggedCells, setFlaggedCells] = useState<number[]> ([]);
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const mines: number[] = useMemo(() => {
    if (!data) return new Array<number>();
    console.log("mines");
    return _.sampleSize(_.range(data.length), data.length / 10);
  }, [data]);
  const cleared: boolean = useMemo(() => {
    return _.isEqual(mines.sort(), flaggedCells.sort());
  }, [flaggedCells]);
  

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
            option={{
              width: width,
              height: height
            }}
            hoveredCell={hoveredCell}
            setHoveredCell={setHoveredCell}
            mines={mines}
            flaggedCells={flaggedCells}
            setFlaggedCells={setFlaggedCells}
            clickedCells={clickedCells}
            setClickedCells={setClickedCells}
          />
        </>
      )}
    </>
  );
  
}

export default App;
