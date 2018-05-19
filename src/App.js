import React, { Component } from 'react';
import Map from './Map';
import List from './List';
import Fill from './Fill';
import * as ZomatoAPI from './ZomatoAPI';
import scriptloader from 'react-async-script-loader';

class App extends Component {
  state = {
    Data: [],
    Display: [],
    Clicked: null,
    ShowList: false,
  	FetchData: true,
    Cuisines: []
  }

  componentDidMount() {
  	//fetch data and change state based on results
    ZomatoAPI.getAll()
    .then(Data => {
    	if(Data.length > 0){
        Data = this.divideCusines(Data);
      	this.setState({
      		Data: Data,
      		ShowList: true,
      		FetchData: false
      	});
      }else {
        this.setState({FetchData: false}); 
      }
    })
  }

  divideCusines = (data) => {
    let arrayOfCuisines = [];
    data.forEach((elm)=>{
      let elmCuisines = elm.restaurant.cuisines.split(", ");
      arrayOfCuisines.push(...elmCuisines);
      elm.restaurant.cuisines = elmCuisines;
    });
    this.setState({Cuisines: [...new Set(arrayOfCuisines)]})
    return data;
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
        <header><h2>Triangle Ice Cream</h2></header>
        <div className="map-wrapper">
          {content}
        </div>
        {/*checks Data.length to see it there's anything to show*/}
        {this.state.Data.length > 0 && (<div className="content">
          <List
            clearMarker={this.clearMarker}
            setDisplay={this.setDisplay}
            data={this.state.Data}
            alrt={this.callMarker}
            cuisineList={this.state.Cuisines}/>
        </div>)}
      </div>
    )
  }
}

export default App;
