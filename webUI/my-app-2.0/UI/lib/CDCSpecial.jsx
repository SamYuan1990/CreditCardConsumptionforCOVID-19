import React from 'react';
import MyTree from './MyTree.jsx';

export default class CDCSpecial extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            HighRisk:["1a","2b","3C","4D"]
        }
    }

    componentDidMount(){
        let mydata={};
        fetch("http://localhost:5000/highrisk").then(res => res.json()).then(
            (result) => {
              console.log("high risk"+result);
              mydata=this.state;
              mydata.HighRisk = result;
              console.log("mydata "+mydata);
              this.setState(mydata);
            },
            (error) => {
    
            }
        );
    }
    render() {
        return(
            <div class="pure-g">
                <div class="pure-u-2-5">
                <h1> List of people who my need ..</h1>
                {this.state.HighRisk.map(function(name){
                return (
                    <div>
                        <button class="pure-button">{name}</button>
                        <br/>
                    </div>
                        )
                })}
                </div>
                <div class="pure-u-3-5">
                <h1> Possible reason for he/she need check</h1>
                <MyTree width={1200} height={800}/>
                </div>
        </div>
        )
    }
  }