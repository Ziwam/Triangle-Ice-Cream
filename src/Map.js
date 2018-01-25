import React, { Component } from 'react';
import scriptloader from 'react-async-script-loader';

class Map extends Component {
  constructor(props){
    super(props);
    this.map = null;
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
      }
      else alert("script not loaded");
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
)(Map)
