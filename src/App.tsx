import React, { useState } from 'react';
import './App.css';
import Map from './components/Map';
import { Voronoi } from './components/Voronoi';
import { getConvertedData } from './logics/convertData';
import { rawData } from './logics/data';


function App() {
  const width = 900, height = 900;
  const data = getConvertedData(rawData, width, height);

  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  return (
    <>
      {/* <Map 
      position={[37.49993, 127.02632]} 
      data={rawData}
      /> */}

      <Voronoi
      data={data}
      width={width}
      height={height}

      hoveredCell={hoveredCell}
      setHoveredCell={setHoveredCell}
      />
    </>
  );
}

export default App;
