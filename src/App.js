import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import * as ZomatoAPI from './ZomatoAPI';
import scriptloader from 'react-async-script-loader';

class App extends Component {
  state = {
    list: []
  }

  componentDidMount() {
    ZomatoAPI.getAll().then((list) => {
      this.setState({list});
    });
  }

  render() {
    return (
      <div className="app">
      </div>
    )
  }
}

export default App;
