
import React from 'react';
import * as reactBootstrap from 'react-bootstrap';



class MyForm extends React.Component {

 render() {
    return (
        <reactBootstrap.Form horizontal>
            <reactBootstrap.FormGroup controlId="formInlineName">
                <reactBootstrap.ControlLabel>信用卡信息</reactBootstrap.ControlLabel>
                {' '}
                <reactBootstrap.FormControl type="text"/>
            </reactBootstrap.FormGroup>  
            <reactBootstrap.ControlLabel>症状</reactBootstrap.ControlLabel>
            <reactBootstrap.FormGroup controlId="formInlineName">   
                <reactBootstrap.Checkbox>
                咳嗽
                </reactBootstrap.Checkbox>
            </reactBootstrap.FormGroup>  
            <reactBootstrap.FormGroup controlId="formInlineName">   
                <reactBootstrap.Checkbox>
                家人感染
                </reactBootstrap.Checkbox>
            </reactBootstrap.FormGroup>  
            <reactBootstrap.FormGroup controlId="formInlineName">   
                <reactBootstrap.Checkbox>
                胸痛
                </reactBootstrap.Checkbox>
            </reactBootstrap.FormGroup>  
            <reactBootstrap.FormGroup controlId="formInlineName">   
                <reactBootstrap.InputGroup>
                发烧？天
                <reactBootstrap.FormControl type="text" />
                </reactBootstrap.InputGroup>    
            </reactBootstrap.FormGroup>  
            <reactBootstrap.FormGroup>
                <reactBootstrap.Button type="submit">
                提交
                </reactBootstrap.Button>
            </reactBootstrap.FormGroup>
            </reactBootstrap.Form>
    );
  }
  
}
  
  export default MyForm;