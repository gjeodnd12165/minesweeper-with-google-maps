import React from 'react';
import './App.css';
import Map from './components/Map';
import Board from './components/Board';
import StatBox from './components/StatBox';
import _ from 'lodash';
import { rawData, center } from './logics/data';
import LocationForm from './components/LocationForm';
import Loading from './components/Loading';


function App() {

  return (
    <>
      <LocationForm />
      <Loading /> || (
        <>
          {/* <Map 
          position={center} 
          data={rawData}
          /> */}
          <StatBox />

          <Board />
        </>
      )
    </>
  )
}

export default App;

