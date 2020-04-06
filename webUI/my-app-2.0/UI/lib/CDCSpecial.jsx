import React from 'react';
import MyTree from './MyTree.jsx';
import { For } from 'react-loops' // 引入 react-loops

export default class CDCSpecial extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            Loaded:false,
            HighRisk:["1a","2b","3C","4D"],
            Selected_data: {
                name: 'Person X123',
                children: [
                  {
                    name: 'Market A',
                    children: [
                      { name: 'Person A1' },
                      { name: 'Person A2' },
                      { name: 'Person A3' },        
                    ]
                  },
                  { name: 'Cough' },
                  {
                    name: 'Market B',
                    children: [{ name: 'Person B1' }, { name: 'Person B2' }]
                  }
                ]
              }
        }
        this.onClick=this.onClick.bind(this);
    }

    onClick(event){
        let myState={};
        myState=this.state;
        //myState.Selected=event.target.value;
        fetch("http://localhost:5000/getPeople?Credit_card="+event.target.value).then(res => res.json()).then(
            (result) => {
                  myState.Selected_data=result;
                  this.setState(myState);
            },
            (error) => {
          
            }
        );
    }

    componentDidMount(){
        let mydata={};
        if(!this.state.Loaded){
            fetch("http://localhost:5000/highrisk").then(res => res.json()).then(
                (result) => {
                console.log("high risk"+result);
                mydata=this.state;
                mydata.HighRisk = result;
                mydata.Loaded = true;
                console.log("mydata "+mydata);
                this.setState(mydata);
                },
                (error) => {
        
                }
            );
        }
    }
    //<For of={this.state.HighRisk} as={item => <button class="pure-button" value={item}>{item}</button> />
    render() {
        return(
            <div class="pure-g">
                <div class="pure-u-2-5">
                <h1> List of people who my need ..</h1>
                <For of={this.state.HighRisk} as={item => <div><button class="pure-button" value={item} onClick={this.onClick}>{item}</button><br/></div>} />
                </div>
                <div class="pure-u-3-5">
                <h1> Possible reason for he/she need check</h1>
                <MyTree width={1200} height={800} data={this.state.Selected_data}/>
                </div>
            </div>
        )
    }
  }