import React from 'react';
import './App.css';
import TestCharts from './TestCharts';
import Label from './Label';

const data = {
  "Afghanistan" : 530,
  "Australia" : 1000,
  "Japan" : 300,
  "Canada": 700,
  "China" : 0
}

const dataArray = [0,1000];

function App() {
  return (
    <div>
      <div className="App">
        <TestCharts data={data} dataArray={dataArray}/>
      </div>
      <div className="Label">
          <Label dataArray={dataArray}/>
      </div>
    </div>
  );
}

export default App;
