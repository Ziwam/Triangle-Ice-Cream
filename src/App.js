import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import List from './List';
import Fill from './Fill';
import * as ZomatoAPI from './ZomatoAPI';
import scriptloader from 'react-async-script-loader';
import ToggleDisplay from 'react-toggle-display';

class App extends Component {
  state = {
    Data: [],
    Display: [],
    Clicked: null,
    ShowList: false,
  	FetchData: true
  }

  componentDidMount() {
    ZomatoAPI.getAll()
    .then(Data => {
    	if(Data.length > 0)
      	this.setState({
      		Data: [],
      		ShowList: true,
      		FetchData: false
      	});
    })
    .catch(err => {
      this.setState({FetchData: false});
    })
  }

  handleClick() {
    this.setState({
      ShowList: !this.state.ShowList
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
  	let content = null;
  	if(this.state.Data.length > 0 && !this.state.FetchData) {
			content = <Map
		        	clearMarker={this.clearMarker}
		        	clicked={this.state.Clicked}
		        	display={this.state.Display}
		        	data={this.state.Data}/>;
		}else if(this.state.Data.length == 0 && !this.state.FetchData) {
			content = <Fill
							fill_id={"fill-error"}/>;
		}else {
			content = <Fill
							fill_id={"fill-fetch"}/>;
		}

    return (
      <div className="app">
      	{/*checks Data.length to see it there's anything to show*/}
      	{ this.state.Data.length > 0 && (<div className="side-content">
	      	<ToggleDisplay show={this.state.ShowList}>
		      	<List
		      		clearMarker={this.clearMarker}
		      		setDisplay={this.setDisplay}
		      		data={this.state.Data}
		      		alrt={this.callMarker}/>
		      </ToggleDisplay>
		      <div className="button-wrapper">
		      	<button onClick={ () => this.handleClick() }>Side View</button>
		      </div>
	      </div>)}
      	<div className="content">
      		<header></header>
	        {content}
      	</div>
      </div>
    )
  }
}

export default App;
