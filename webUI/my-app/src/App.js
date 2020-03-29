import React from 'react';
import './App.css';
import GEOGraph from './GEOGraph';
import Label from './Label';
import MyForm from './Form';
import axios from 'axios';
import {Grid,Row,Col} from 'react-bootstrap';
import MyPie from './Pies';
import MyBars from './MyBarGroup';

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
      dataArray : [0,1000],
      range: [{label: "Red",
      usage: "33.3"},{label: "Yellow",
      usage: "33.3"},{label: "Green",
      usage: "33.3"}],
      BarRed: [{letter:"Mar-3",frequency:30},{letter:"Mar-4",frequency:20},{letter:"Mar-5",frequency:10}],
      BarYellow: [{letter:"Mar-3",frequency:10},{letter:"Mar-4",frequency:20},{letter:"Mar-5",frequency:10}],
      BarGreen: [{letter:"Mar-3",frequency:10},{letter:"Mar-4",frequency:20},{letter:"Mar-5",frequency:30}]
    };
  }


  componentDidMount() {
    this.update();
    //setInterval(this.update,6*1000)
  }

  componentWillUnmount() {
    //clearInterval(this.update);
  }

   update= async() => {
    let mydata = {};
    await axios.get("http://localhost:5000/data").then(function(response) {
      mydata = response.data;
    }).catch(function (error){
      console.log(error);
    });
    this.setState(mydata);
  }

  render() {
  return (
    <Grid fluid="true">
    <Row>
      <Col xs={6} md={4}>
        <MyForm/>
      </Col>
      <Col xs={6} md={4}>
      <div className="App">
        <p>My area</p>
        <GEOGraph height={580} width={960} dataArray={this.state.dataArray} data={this.state.data}/>
        <div className="Label">
              <Label dataArray={this.state.dataArray}/>
          </div>
      </div>
      </Col>
  </Row>
  <Row>
      <Col xs={6} md={4}>
          <div>
            <p>Percent in my area</p>
            <p>Red as new confirm,Yellow as new maybe,Green as new cure</p>
            <MyPie width={300} height={300} data={this.state.range}/>
          </div>
      </Col>
      <Col xs={6} md={4}>
          <p>Trends in my area</p>
          <div>
            <MyBars width={100} height={300} data={this.state.BarRed} color={"red"}/>
            <MyBars width={100} height={300} data={this.state.BarYellow} color={"yellow"}/>
            <MyBars width={100} height={300} data={this.state.BarGreen} color={"green"}/>
          </div>
      </Col>
  </Row>
  </Grid>
  )
  }
}

export default App;
