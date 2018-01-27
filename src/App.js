import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import List from './List';
import * as ZomatoAPI from './ZomatoAPI';
import scriptloader from 'react-async-script-loader';
import ToggleDisplay from 'react-toggle-display';

class App extends Component {
  state = {
    Data: [],
    Display: [],
    showList: false
  }

  componentDidMount() {
    ZomatoAPI.getAll().then((Data) => {
      this.setState({Data});
    });
  }

  handleClick() {
    this.setState({
      showList: !this.state.showList
    });
  }

  render() {
    return (
      <div className="app">
      	<div className="side-content">
	      	<ToggleDisplay show={this.state.showList}>
		      	<List/>
		      </ToggleDisplay>
		      <div className="button-wrapper">
		      	<button onClick={ () => this.handleClick() }>Side View</button>
		      </div>
	      </div>
      	<div className="content">
      		<header></header>
	        <Map/>
      	</div>
      </div>
    )
  }
}

export default App;
