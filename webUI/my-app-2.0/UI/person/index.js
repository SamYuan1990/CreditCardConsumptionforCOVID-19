import React from 'react';
import App from './App.jsx';
import ReactDOM from 'react-dom';

function display(){
  ReactDOM.render(
  <div>
    <App />
  </div>,
  document.getElementById('first-note')
  );
}

display();