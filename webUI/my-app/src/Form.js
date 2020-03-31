
import React from 'react';
import {Form,FormGroup,ControlLabel,Checkbox,ListGroup,FormControl,InputGroup,Button,ListGroupItem} from 'react-bootstrap';
import axios from 'axios';

class MyForm extends React.Component {

 state = {
     status:"info"
 };

 onClick= async() => {
    let credit_card=document.getElementById("formInlineName").value;
    let zhengzhuang=document.getElementById("zhengzhuang").checked;
    let xiong=document.getElementById("xiong").checked;
    let days=document.getElementById("days").value;
    let mydata = {};
    await axios.get("http://localhost:5000/mystatus?"+
    "Credit_card="+credit_card+
    "&Cough="+zhengzhuang+
    "&Chest_Pain="+xiong+
    "&Fever="+days).then(function(response) {
      mydata = response.data;
    }).catch(function (error){
      console.log(error);
    });
    this.setState(mydata);
 }

 onClickConfirmed= async() => {
    let credit_card=document.getElementById("formInlineName").value;
    let zhengzhuang=document.getElementById("zhengzhuang").checked;
    let xiong=document.getElementById("xiong").checked;
    let days=document.getElementById("days").value;
    let mydata = {};
    await axios.get("http://localhost:5000/newConfirmed?"+
    "Credit_card="+credit_card+
    "&Cough="+zhengzhuang+
    "&Chest_Pain="+xiong+
    "&Fever="+days).then(function(response) {
      mydata = response.data;
    }).catch(function (error){
      console.log(error);
    });
    this.setState(mydata);
 }

 render() {
    return (
        <div>
        <Form horizontal>
            <FormGroup>
                <ControlLabel>Credit Card</ControlLabel>
                {' '}
                <FormControl id="formInlineName" type="text"/>
            </FormGroup>  
            <ControlLabel>症状</ControlLabel>
            <FormGroup>   
                <Checkbox id="zhengzhuang">
                Cough
                </Checkbox>
            </FormGroup>  
            <FormGroup>   
                <Checkbox id="xiong">
                Chest
                </Checkbox>
            </FormGroup>  
            <FormGroup>   
                <InputGroup>
                fever？days
                <FormControl id="days" type="text" />
                </InputGroup>    
            </FormGroup>  
            <FormGroup>
                <Button onClick={this.onClick}>
                Submit
                </Button>
                <Button onClick={this.onClickConfirmed}>
                New Confirmed
                </Button>
            </FormGroup>
        </Form>
        <ListGroup>
            <ListGroupItem bsStyle={this.state.status}>Your status</ListGroupItem>
        </ListGroup>
        </div>
    );
  }
  
}
  
  export default MyForm;