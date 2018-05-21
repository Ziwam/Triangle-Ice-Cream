import React, { Component } from 'react';
import scriptloader from 'react-async-script-loader';
import zomato_icon from './assets/zomato_icon.svg';
import maps_icon from './assets/maps_icon.svg';

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
         //removes google maps div & links from tab order
         window.google.maps.event.addListener(this.map, "tilesloaded", function(){
          [].slice.apply(document.querySelectorAll('#map a, #map div')).forEach(function(item) { 
     				item.setAttribute('tabindex','-1'); 
    			});
  			});
      } else {
      	alert("script not loaded");
      }
    }
  }

  componentDidUpdate(nextProps, nextState) {
  	//there are objects to be made into markers and no markers
    if (this.props.data.length > 0 && this.state.markers.length == 0) {
    	this.createMarkers();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
  	//checks for list changes
  	if(this.state.display != nextProps.display) {
  		
  		this.setState({display:nextProps.display});
  		//sets map for markers that are found in list
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
	    	//sets all markers to map if filtered list is empty
	    } else if(this.state.markers.length > 0 && nextProps.display.length == 0) {
	    	this.state.markers.map((marker) => {
	    		marker.setMap(this.map);
	    	});
	    }

	    //close infowindow
	    if(this.LargeInfoWindow)
	    	this.LargeInfoWindow.close();
  	}

    if(nextProps.clicked && this.state.markers.length > 0) {
    	this.populateInfoWindow(parseFloat(nextProps.clicked));
    }

    /*
    	return false is there are markers already showing on the map.
    	no need to rerender
    */
  	if(this.state.markers.length > 0){
  		return false;
  	}else {
  		return true;
  	}
  }

  //Creates markers from props and stores in state array
  createMarkers() {
  	//store new infowindow into global variable
  	this.LargeInfoWindow = new window.google.maps.InfoWindow();

  	let allMarks = [];
  	let bounds = new window.google.maps.LatLngBounds();

  	this.props.data.map((info) => {
  		//stores shop info into variables
  		let title = info.restaurant.name;
  		let id = info.restaurant.id;
  		let cuisines = info.restaurant.cuisines;
  		let url = info.restaurant.url;
  		let address = info.restaurant.location.address;
  		let rating = info.restaurant.user_rating.aggregate_rating;
  		let rating_color = info.restaurant.user_rating.rating_color;
  		let votes = info.restaurant.user_rating.votes;
  		let location = {
  			lat:parseFloat(info.restaurant.location.latitude),
  			lng:parseFloat(info.restaurant.location.longitude)};

  		let marker = new window.google.maps.Marker({
  			map: this.map,
  			position: location,
  			title: title,
  			cuisines: cuisines,
  			url: url,
  			address: address,
  			rating: rating,
  			rating_color: rating_color,
  			votes: votes,
  			animation: window.google.maps.Animation.DROP,
  			id: id
  		});

  		allMarks.push(marker);
  		bounds.extend(marker.position);

  		//adds listener to marker to pass id to populate infowindow
  		marker.addListener('click',() => {
  			this.populateInfoWindow(marker.id);
  		});
  	});

  	//set markers state to new markers
  	this.setState({markers: allMarks});
  	this.map.fitBounds(bounds);
  }

  populateInfoWindow = (id) => {
  	let marker = this.state.markers.filter(item => item.id == id)[0];
  	let infowindow = this.LargeInfoWindow;
  	if(infowindow.marker != marker){
  		infowindow.marker = marker;
  		infowindow.setContent(this.infoWindowContent(marker));
  		infowindow.open(this.map,marker);
  		infowindow.addListener('closeclick',() => {
  			infowindow.marker = null;
  		});
  	}
  	// this.clearBounce();
  }

  //adds bounce animation to marker that matches id
  emphasizeMarker = (id) => {
  	this.clearBounce();
  	let marker = this.state.markers.filter(item => item.id == id)[0];
  	this.map.panTo(marker.getPosition());
  	marker.setAnimation(window.google.maps.Animation.BOUNCE);
  	//stores bouncing marker in state variable
  	this.setState({bounceMarker:marker});
  }

  //stops bounce animation for selected marker
  clearBounce = () => {
  	if(this.state.bounceMarker)
  	this.state.bounceMarker.setAnimation(null);
  	this.props.clearMarker();
  }

  //creates markup for infowindow content
  infoWindowContent = (marker) => {
  	let directions = 'https://www.google.com/maps/dir//' + marker.address.split(" ").join("+");

  	//sets color for rating
  	let color = 'e2e2e2';
  	if(marker.votes > 0)
  		color = marker.rating_color;

  	const markup = `
<div id="infowindow">
	<h3>${marker.title}</h3>
  <div class="border1"><div class="border2"></div></div>
	<p class="address">${marker.address}</p>
	<div class="info">
		<div class="rating">${marker.rating}/5</div>
    <div class="list">
      ${marker.cuisines.map((elm)=>{
        return `<div className="cuisines">${elm}</div>`
      }).join('')}
    </div>
	</div>
  <div class="link-wrapper">
    <a href=${marker.url} target="_blank" role="Link" tabindex="0" aria-label="zomato page" class="zamoto_link">More Details</a>
    <a href=${directions} target="_blank" role="Link" tabindex="0" aria-label="directions" class="directions">Directions</a>
  </div>
</div>
  	`;
  	return markup;
  }

  render() {
    return (
    	<div id="map" role="application"></div>
    )
  }
}

export default scriptloader(
  [
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyAyEktfkxUCR6MWAIfB0ndH_oq_R2moMsM'
  ]
)(Map);
