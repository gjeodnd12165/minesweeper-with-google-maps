import React, { useMemo, useState } from 'react';
import './App.css';
import Map from './components/Map';
import { Voronoi } from './components/Voronoi';
import { getConvertedData } from './logics/convertData';
import { rawData } from './logics/data';
import _ from 'lodash';


function App() {
  const width = 900, height = 900;
  const data = getConvertedData(rawData, width, height);
  let flagCount = 0;

  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const mines = useMemo(() => {
    return _.sampleSize(_.range(data.length), data.length / 3);
  }, []);
  

  return (
    <>
      {/* <Map 
      position={[37.49993, 127.02632]} 
      data={rawData}
      /> */}
      <div>{mines.length - flagCount} mines left</div>

      <Voronoi
      data={data}
      option={{
        width: width,
        height: height
      }}
      hoveredCell={hoveredCell}
      setHoveredCell={setHoveredCell}
      mines={mines}
      flagCount={flagCount}
      />
    </>
  );
}

export default App;
