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
  	//fetch data and change state based on results
    ZomatoAPI.getAll()
    .then(Data => {
    	if(Data.length > 0)
      	this.setState({
      		Data: Data,
      		ShowList: true,
      		FetchData: false
      	});
    })
    .catch(err => {
      this.setState({FetchData: false});
    })
  }

  //show/hide menu on menu click
  handleClick() {
    this.setState({
      ShowList: !this.state.ShowList
    });
  }

  //set clicked marker from list click to state clicked
  callMarker = (Clicked) => {
  	this.setState({Clicked});
  }

  clearMarker = () => {
  	this.setState({Clicked:null});
  }

  //set filtered results from list search to state display
  setDisplay = (Display) => {
  	this.setState({Display});
  }

  //Sets the main content based on data.
  setContent = () => {
  	let content = null;
  	if(this.state.Data.length > 0 && !this.state.FetchData) {
  		//show map if there is data
			return <Map
		        	clearMarker={this.clearMarker}
		        	clicked={this.state.Clicked}
		        	display={this.state.Display}
		        	data={this.state.Data}/>;
		}else if(this.state.Data.length == 0 && !this.state.FetchData) {
			//show error if no data and  fetch finished
			return <Fill
							text={"Error: Could Not Reach Servers."}
							fill_class={"error"}/>;
		}else {
			//show loading animation
			return <Fill
							fill_class={"fetch"}/>;
		}
  }

  render() {
    let content = this.setContent();

    return (
      <div className="app">
      	{/*checks Data.length to see it there's anything to show*/}
      	{this.state.Data.length > 0 && (<div className="side-content">
	      	<ToggleDisplay show={this.state.ShowList}>
		      	<List
		      		clearMarker={this.clearMarker}
		      		setDisplay={this.setDisplay}
		      		data={this.state.Data}
		      		alrt={this.callMarker}/>
		      </ToggleDisplay>
		      <div className="button-wrapper" >
		      	<div className="icon" role="button" tabIndex="0" aria-label="menu" onClick={ () => this.handleClick() }>
		      		<i className="fa fa-bars"></i>
		      	</div>
		      </div>
	      </div>)}
      	<div className="content">
      		<header><h1>Triangle Ice Cream</h1></header>
	        {content}
      	</div>
      </div>
    )
  }
}

export default App;
