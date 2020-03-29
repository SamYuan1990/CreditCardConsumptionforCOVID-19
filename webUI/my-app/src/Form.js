
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
    let family=document.getElementById("family").checked;
    let xiong=document.getElementById("xiong").checked;
    let days=document.getElementById("days").value;
    let mydata = {};
    await axios.get("http://localhost:5000/mystaus?"+
    "credit_card="+credit_card+
    "&zhengzhuang="+zhengzhuang+
    "&family="+family+
    "&xiong="+xiong+
    "&days"+days).then(function(response) {
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
                <ControlLabel>信用卡信息</ControlLabel>
                {' '}
                <FormControl id="formInlineName" type="text"/>
            </FormGroup>  
            <ControlLabel>症状</ControlLabel>
            <FormGroup>   
                <Checkbox id="zhengzhuang">
                咳嗽
                </Checkbox>
            </FormGroup>  
            <FormGroup>   
                <Checkbox id="family">
                家人感染
                </Checkbox>
            </FormGroup>  
            <FormGroup>   
                <Checkbox id="xiong">
                胸痛
                </Checkbox>
            </FormGroup>  
            <FormGroup>   
                <InputGroup>
                发烧？天
                <FormControl id="days" type="text" />
                </InputGroup>    
            </FormGroup>  
            <FormGroup>
                <Button onClick={this.onClick}>
                提交
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