import React, { Component } from 'react';
import scriptloader from 'react-async-script-loader';

class Map extends Component {
  constructor(props){
    super(props);
    this.map = null;
    this.LargeInfoWindow = null;
  }

  state = {
  	markers: [],
  	display: [],
  	bounceMarker: null
  }

  //Async script loader waits until google maps api loads
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

  componentDidUpdate(nextProps, nextState) {
    if (this.props.data.length > 0 && this.state.markers.length == 0) {
    	this.createMarkers();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
  	if(this.state.display != nextProps.display) {
  		
  		this.setState({display:nextProps.display});

			if(this.state.markers.length > 0 && nextProps.display.length > 0) {
	    	this.state.markers.map((marker) => {
	    		for(let item of nextProps.display) {
	    			if(item.restaurant.name == marker.title){
	    				marker.setMap(this.map);
	    				break;
	    			}else{
	    				marker.setMap(null);
	    			}
	    		}
	    	});
	    } else if(this.state.markers.length > 0 && nextProps.display.length == 0) {
	    	this.state.markers.map((marker) => {
	    		marker.setMap(this.map);
	    	});
	    }

	    if(this.LargeInfoWindow)
	    	this.LargeInfoWindow.close();
  	}

    if(nextProps.clicked && this.state.markers.length > 0) {
    	this.emphasizeMarker(parseFloat(nextProps.clicked));
    }

  	if(this.state.markers.length > 0){
  		return false;
  	}else {
  		return true;
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
  		infowindow.addListener('closeclick',() => {
  			infowindow.marker = null;
  		});
  	}
  	this.clearBounce();
  }

  emphasizeMarker = (id) => {
  	this.clearBounce();
  	let marker = this.state.markers.filter(item => item.id == id)[0];
  	this.map.panTo(marker.getPosition());
  	marker.setAnimation(window.google.maps.Animation.BOUNCE);
  	this.setState({bounceMarker:marker});
  }

  clearBounce = () => {
  	if(this.state.bounceMarker)
  	this.state.bounceMarker.setAnimation(null);
  	this.props.clearMarker();
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
