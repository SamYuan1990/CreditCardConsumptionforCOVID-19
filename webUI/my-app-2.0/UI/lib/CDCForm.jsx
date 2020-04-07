
import React from 'react';
import {Form,FormGroup,ControlLabel,Checkbox,ListGroup,FormControl,InputGroup,Button,ListGroupItem} from 'react-bootstrap';
import axios from 'axios';

export default class MyForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
     status:"info"
    };
    this.onClick = this.onClick.bind(this);
    this.onClickConfirmed = this.onClickConfirmed.bind(this);
  }

  // <button type="submit" class="pure-button pure-button-primary" onClick={this.onClick}>Submit</button>
  //<button type="submit" class="pure-button pure-button-primary" onClick={this.onClickConfirmed}>New Comfirmed</button>

onClick(event){
    let credit_card=document.getElementById("formInlineName").value;
    let zhengzhuang=document.getElementById("zhengzhuang").checked;
    let xiong=document.getElementById("xiong").checked;
    let days=document.getElementById("days").value;
    let mydata = {};

    fetch("http://localhost:5000/mystatus?"+
    "Credit_card="+credit_card+
    "&Cough="+zhengzhuang+
    "&Chest_Pain="+xiong+
    "&Fever="+days).then(res => res.json()).then(
      (result) => {
        console.log(result);
        mydata = result;
        this.setState(mydata);
      },
      (error) => {

      }
    );
 }

onClickConfirmed(event){
    let credit_card=document.getElementById("formInlineName").value;
    let zhengzhuang=document.getElementById("zhengzhuang").checked;
    let xiong=document.getElementById("xiong").checked;
    let days=document.getElementById("days").value;
    let mydata = {};

    fetch("http://localhost:5000/newConfirmed?"+
    "Credit_card="+credit_card+
    "&Cough="+zhengzhuang+
    "&Chest_Pain="+xiong+
    "&Fever="+days).then(res => res.json()).then(
      (result) => {
        console.log(result);
        mydata = result;
        this.setState(mydata);
      },
      (error) => {

      }
    );
 }

 render() {
    return (
        <div>
            <form class="pure-form brand-tagline">
                <fieldset>
                    <div class="pure-control-group">
                        <label for="name">Credit Card</label>
                        <input id="formInlineName" type="text" placeholder="000001"/>
                    </div>
                    <label for="name">Symptom</label>
                    <div class="pure-control-group ">
                    <label for="cb" class="pure-checkbox">
                            <input id="zhengzhuang" type="checkbox"/> Cough
                        </label>
                    </div>
                    <div class="pure-control-group">
                    <label for="cb" class="pure-checkbox">
                            <input id="xiong" type="checkbox"/> Chest Pain
                        </label>
                    </div>
                    <div class="pure-control-group">
                    <label for="cb" class="pure-checkbox">
                      <label for="name">fever？days</label>
                            <input id="days" type="text" placeholder="0"/> 
                        </label>
                    </div>
                    <div class="pure-controls">
                      <nav class="nav">
                        <ul class="nav-list">
                            <li class="nav-item">
                                <a class="pure-button" onClick={this.onClick}>Submit</a>
                            </li>
                            <li class="nav-item">
                                <a class="pure-button" onClick={this.onClickConfirmed}>New Comfirmed</a>
                            </li>
                        </ul>
                    </nav>
                    </div>

                    <ListGroup>
                     <ListGroupItem bsStyle={this.state.status}>Your Status</ListGroupItem>
                    </ListGroup>
                </fieldset>
            </form>
        </div>
    );
  }
  
}