import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const apiKey = 'AIzaSyCWIg0OhhYc1_DEXwPOXcBypSNgumuB5t4';

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%'
}

const mapStyles = {
  width: '90%',
  height: '800px'
};

export class MapContainer extends Component {
  render() {
    return (
      <div className="App">
        <h1 id="heroLogo">
          NLNRF
          &nbsp;
          <span className='slogan'>NOT LEFT. NOT RIGHT. FORWARD.</span>
        </h1>

        <div style={containerStyle}>
          <Map
            google={this.props.google}
            zoom={19}
            style={mapStyles}
            initialCenter={{
              lat: 47.6180376,
              lng: -122.3256017
            }}
          />F
</div>


      </div>


    );
  }
}

export default GoogleApiWrapper({
  apiKey: apiKey
})(MapContainer);