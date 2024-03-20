import React from 'react';
import './App.css';
import Map from './Map';
import { Voronoi } from './Voronoi';
import { getConvertedData } from './convertData';
import { rawData } from './data';


function App() {
  const width = 900, height = 900;
  const data = getConvertedData(rawData, width, height);
  console.log(rawData);
  console.log(data);

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
      />
    </>
  );
}

export default App;
