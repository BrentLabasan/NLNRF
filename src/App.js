import React, { Component } from 'react';
import { GoogleMapReact, Map, GoogleApiWrapper } from 'google-maps-react';

const apiKey = 'AIzaSyCWIg0OhhYc1_DEXwPOXcBypSNgumuB5t4';

const mapStyles = {
  width: '90%',
  height: '90%'
};

export class MapContainer extends Component {
  render() {
    return (
      <div className="App">
        <h1 id="heroLogo">NLNRF</h1>

        <div style={{ height: '500px', width: '900px' }}>

          <Map
            google={this.props.google}
            zoom={19}
            style={mapStyles}
            initialCenter={{
              lat: 47.6180376,
              lng: -122.3256017
            }}
          />
        </div>

      </div>


    );
  }
}

export default GoogleApiWrapper({
  apiKey: apiKey
})(MapContainer);