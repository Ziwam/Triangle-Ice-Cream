import React, { Component } from 'react';
import './App.css';
import Map from './Map'
import scriptloader from 'react-async-script-loader';

class App extends Component {

  render() {
    return (
      <div className="app">
        <Map/>
      </div>
    )
  }
}

export default App
