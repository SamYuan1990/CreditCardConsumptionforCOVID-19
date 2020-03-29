import React from 'react';
import './App.css';
import TestCharts from './TestCharts';
import Label from './Label';
import MyForm from './Form';
import axios from 'axios';
import * as reactBootstrap from 'react-bootstrap';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data : {
        "Afghanistan" : 0,
        "Australia" : 0,
        "Japan" : 0,
        "Canada": 0,
        "China" : 0
      },
      dataArray : [0,1000]
    };
  }


  componentDidMount() {
    this.update();
    setInterval(this.update,6*1000)
  }

  componentWillUnmount() {
    clearInterval(this.update);
  }

   update= async() => {
    let mydata = {};
    await axios.get("http://localhost:5000/data").then(function(response) {
      mydata.data = response.data;
    }).catch(function (error){
      console.log(error);
    });
    await axios.get("http://localhost:5000/dataArray").then(function(response) {
      mydata.dataArray = response.data;
    }).catch(function (error){
      console.log(error);
    });
    console.log(mydata);
    this.setState(mydata);
  }

  render() {
  return (
    <reactBootstrap.Grid>
    <reactBootstrap.Row className="show-grid">
      <reactBootstrap.Col xs={12} md={8}>
        <MyForm/>
      </reactBootstrap.Col>
      <reactBootstrap.Col xs={12} md={8}>
    <div>
      <div className="App">
        <TestCharts data={this.state.data} dataArray={this.state.dataArray}/>
      </div>
      <div className="Label">
          <Label dataArray={this.state.dataArray}/>
      </div>
    </div>
    </reactBootstrap.Col>
  </reactBootstrap.Row>
  </reactBootstrap.Grid>
  )
  }
}

export default App;
