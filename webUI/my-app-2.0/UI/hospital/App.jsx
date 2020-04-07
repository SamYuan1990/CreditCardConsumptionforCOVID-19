import React from 'react';
import MyForm from '../lib/CDCForm.jsx';


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    
    };

  }
  render() {
  return (
    <div id="layout" class="content">
      <MyForm />
     </div>
  )
  }
}

export default App;
