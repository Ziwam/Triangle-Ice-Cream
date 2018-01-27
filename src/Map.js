import React, { Component } from 'react';
import scriptloader from 'react-async-script-loader';

class Map extends Component {
  constructor(props){
    super(props);
    this.map = null;
    this.LargeInfoWindow = null;
  }

  state = {
  	markers: []
  }

  //Async script loader waits until google maps api loades
  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 2
        });
      } else {
      	alert("script not loaded");
      }
    }
  }

  componentDidUpdate() {
    if (this.props.data.length > 0 && this.state.markers.length == 0) {
    	this.createMarkers();
    } else if(this.state.markers.length > 0 && this.props.display.length > 0){
    	this.state.markers.map((marker) => {
    		for(let item of this.props.display) {
    			if(item.restaurant.name == marker.title){
    				marker.setMap(this.map);
    				break;
    			}else{
    				marker.setMap(null);
    			}
    		}
    	});
    } else if(this.state.markers.length > 0 && this.props.display.length == 0){
    	this.state.markers.map((marker) => {
    		marker.setMap(this.map);
    	});
    }

    if(this.props.clicked && this.state.markers.length > 0){
    	this.populateInfoWindow(parseFloat(this.props.clicked));
    }
  }

  //Creates markers from props and stores in state array
  createMarkers() {
  	this.LargeInfoWindow = new window.google.maps.InfoWindow();
  	
  	let allMarks = [];
  	let bounds = new window.google.maps.LatLngBounds();

  	this.props.data.map((info) => {
  		let location = {
  			lat:parseFloat(info.restaurant.location.latitude),
  			lng:parseFloat(info.restaurant.location.longitude)};
  		let title = info.restaurant.name;
  		let id = info.restaurant.id;
  		let marker = new window.google.maps.Marker({
  			map: this.map,
  			position: location,
  			title: title,
  			animation: window.google.maps.Animation.DROP,
  			id: id
  		});

  		allMarks.push(marker);
  		bounds.extend(marker.position);

  		marker.addListener('click',() => {
  			this.populateInfoWindow(marker.id);
  		});
  	});

  	this.setState({markers: allMarks});
  	this.map.fitBounds(bounds);
  }

  populateInfoWindow = (id) => {
  	let marker = this.state.markers.filter(item => item.id == id)[0];
  	let infowindow = this.LargeInfoWindow;
  	if(infowindow.marker != marker){
  		infowindow.marker = marker;
  		infowindow.setContent('<div>'+marker.title+'</div>');
  		infowindow.open(this.map,marker);
  		infowindow.addListener('closeclick',function(){
  			infowindow.marker = null;
  			this.props.clearMarker();
  		});
  	}
  }

  render() {
    return (
    	<div id="map"></div>
    )
  }
}

export default scriptloader(
  [
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyAyEktfkxUCR6MWAIfB0ndH_oq_R2moMsM'
  ]
)(Map);
