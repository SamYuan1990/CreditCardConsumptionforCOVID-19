import React from 'react';
import GEOGraph from '../lib/GEOGraph.jsx';
import Label from '../lib/Label.jsx';
import MyForm from '../lib/Form.jsx';
import MyPie from '../lib/Pies.jsx';
import MyBars from '../lib/MyBarGroup.jsx';
import CDCSpecial from "../lib/CDCSpecial.jsx";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data : {},
      dataArray : [0,100000],
      range: [{label: "Red",
      usage: "33.3"},{label: "Yellow",
      usage: "33.3"},{label: "Green",
      usage: "33.3"}],
      BarRed: [{letter:"Mar-3",frequency:30},{letter:"Mar-4",frequency:20},{letter:"Mar-5",frequency:10}],
      BarYellow: [{letter:"Mar-3",frequency:10},{letter:"Mar-4",frequency:20},{letter:"Mar-5",frequency:10}],
      BarGreen: [{letter:"Mar-3",frequency:10},{letter:"Mar-4",frequency:20},{letter:"Mar-5",frequency:30}],
    };

    this.update = this.update.bind(this);
  }


  componentDidMount() {
    this.update();
    //setInterval(this.update,6*1000)
  }

  update(event) {
    let mydata = {};
    /*axios.get("http://localhost:5000/data").then(function(response) {
      mydata = response.data;
    }).catch(function (error){
      console.log(error);
    });*/
    mydata=this.state;
    fetch("http://localhost:5000/data").then(res => res.json()).then(
      (result) => {
        console.log(result);
        mydata.dataArray = result.dataArray;
        mydata.range = result.range;
        mydata.BarRed=result.BarRed;
        mydata.BarYellow=result.BarYellow
        mydata.BarGreen=result.BarGreen;
        this.setState(mydata);
        //console.log(mydata);
      },
      (error) => {

      }
    );

    

    let covid19api=this.state;
    fetch("https://api.covid19api.com/summary").then(res => res.json()).then(
      (result) => {
        console.log(result);
        var arrayLength = result.Countries.length;
        for (var i = 0; i < arrayLength; i++) {
          //console.log(result.Countries[i]);
          covid19api.data[result.Countries[i].Country]=result.Countries[i].TotalConfirmed;
        }
        //mydata.data=covid19api;
        this.setState(covid19api);
      },
      (error) => {

      }
    );
    /*axios.get("https://api.covid19api.com/summary").then(function(response){
      var arrayLength = response.data.Countries.length;
      let covid19api={};
      for (var i = 0; i < arrayLength; i++) {
          covid19api[response.data.Countries[i].Country]=response.data.Countries[i].TotalConfirmed;
      }
      mydata.data=covid19api;
    }).catch(function (error){
      console.log(error);
    });*/
  }

/*
 <div class="content pure-u-3-4 pure-u-md-3-4">
        <div class="pure-g">
          <div class="pure-u-2-5">
            <p>Area</p>
            <GEOGraph height={300} width={600} dataArray={this.state.dataArray} data={this.state.data}/>
            <div className="Label">
                  <Label dataArray={this.state.dataArray}/>
            </div>
          </div>
          <div class="pure-u-2-5">
              <p>Precent</p>
              <MyPie width={300} height={300} data={this.state.range}/>
            </div>
            <div class="pure-u-1-5">
                <p>Tends</p>
                <div class="pure-u-1-3">
                  <MyBars width={100} height={300} data={this.state.BarRed} color={"red"}/>
                </div>
                <div class="pure-u-1-3">
                  <MyBars width={100} height={300} data={this.state.BarYellow} color={"yellow"}/>
                </div>
                <div class="pure-u-1-3">
                  <MyBars width={100} height={300} data={this.state.BarGreen} color={"green"}/>
                </div>
            </div>
        </div>
      </div> */

  render() {
  return (
    <div id="layout" class="pure-g">
      <div class="content pure-u-3-4 pure-u-md-3-4">
        <div class="pure-g">
          <div class="pure-u-2-5">
            <p>Area</p>
            <GEOGraph height={300} width={600} dataArray={this.state.dataArray} data={this.state.data}/>
            <div className="Label">
                  <Label dataArray={this.state.dataArray}/>
            </div>
          </div>
          <div class="pure-u-2-5">
              <p>Precent</p>
              <MyPie width={300} height={300} data={this.state.range}/>
            </div>
            <div class="pure-u-1-5">
                <p>Tends</p>
                <div class="pure-u-1-3">
                  <MyBars width={100} height={300} data={this.state.BarRed} color={"red"}/>
                </div>
                <div class="pure-u-1-3">
                  <MyBars width={100} height={300} data={this.state.BarYellow} color={"yellow"}/>
                </div>
                <div class="pure-u-1-3">
                  <MyBars width={100} height={300} data={this.state.BarGreen} color={"green"}/>
                </div>
            </div>
        </div>
      </div>
      <CDCSpecial/>
    </div>
  )
  }
}

export default App;
