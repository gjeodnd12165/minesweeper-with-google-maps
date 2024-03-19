import React from 'react';
import './App.css';
import Map from './Map';
import { Voronoi } from './Voronoi';
import { data } from './data';


function App() {
  return (
    <Voronoi
    data={data}
    width={400}
    height={400}
    />
    // <Map position={[51.505, -0.09]}/>
  );
}

export default App;
