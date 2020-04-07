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
        //console.log(event.target.innerText);
        let myState={};
        myState=this.state;
        //myState.Selected=event.target.value;
        fetch("http://localhost:5000/getPeople?Credit_card="+event.target.innerText).then(res => res.json()).then(
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
    //<h4 class="email-subject">
    render() {
        return(
            <div class="pure-g">
                <div class="pure-u-2-5 ">
                <h4 class="email-subject email-item"> List of people who may need ..</h4>
                <For of={this.state.HighRisk} as={item => <div class="email-item-unread"><h4 class="email-subject email-item" value={item} onClick={this.onClick}>{item}</h4><br/></div>} />
                </div>
                <div class="pure-u-3-5">
                    <div class="email-content-header">
                        <h1 class="email-content-title"> Possible reason for he/she need check</h1>
                    </div>
                    <div class="email-content-body">
                        <MyTree width={1200} height={800} data={this.state.Selected_data}/>
                    </div>
                </div>
            </div>
        )
    }
  }