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
    Clicked: null,
    showList: true
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

  callMarker = (Clicked) => {
  	this.setState({Clicked});
  }

  clearMarker = () => {
  	this.setState({Clicked:null});
  }

  setDisplay = (Display) => {
  	this.setState({Display});
  }

  render() {
    return (
      <div className="app">
      	<div className="side-content">
	      	<ToggleDisplay show={this.state.showList}>
		      	<List
		      		clearMarker={this.clearMarker}
		      		setDisplay={this.setDisplay}
		      		data={this.state.Data}
		      		alrt={this.callMarker}/>
		      </ToggleDisplay>
		      <div className="button-wrapper">
		      	<button onClick={ () => this.handleClick() }>Side View</button>
		      </div>
	      </div>
      	<div className="content">
      		<header></header>
	        <Map
	        	clearMarker={this.clearMarker}
	        	clicked={this.state.Clicked}
	        	display={this.state.Display}
	        	data={this.state.Data}/>
      	</div>
      </div>
    )
  }
}

export default App;
