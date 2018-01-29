import React, { Component } from 'react';
import scriptloader from 'react-async-script-loader';
import zomato_icon from './icons/zomato_icon.svg';
import maps_icon from './icons/maps_icon.svg';

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
  		infowindow.setContent(this.infoWindowContent(marker));
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

  infoWindowContent = (marker) => {
  	let directions = 'https://www.google.com/maps/dir//' + marker.address.split(" ").join("+");

  	let color = 'e2e2e2';
  	if(marker.votes > 0)
  		color = marker.rating_color;

  	const markup = `
<div id="infowindow">
	<h3>${marker.title}</h3>
	<h4>${marker.cuisines}</h4>
	<section>
		<div class="rating" style="background-color:#${color}"><p>${marker.rating}</p></div>
		<div class="icon-wrapper">
			<a href=${marker.url} target="_blank"><img class="icon" src=${zomato_icon}></a>
			<a href=${directions} target="_blank"><img class="icon" src=${maps_icon}></a>
		</div>
	</section>
</div>
  	`;
  	return markup;
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
