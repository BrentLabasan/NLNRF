import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker, Polygon } from 'google-maps-react';
import { Paper } from '@material-ui/core';
import LocationDetailsMobile from './LocationDetailsMobile';
import * as constants from './constants';
import pulsing from './media/pulsing3.gif';
import wut from './media/wut.gif';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

var _ = require('lodash');

export class GoogleMap extends Component {

  state = {
    locations: [],
    centerLat: null,
    centerLong: null,

    currentMapCenterLat: 47.61785407164923,
    currentMapCenterLong: -122.31657144387441,

    open: false
  };

  // const [modalStyle] = React.useState(getModalStyle);
  // const [open, setOpen] = React.useState(false);

  onMarkerClick = (props, marker, e) => {
    // this.setState({
    //   selectedPlace: props,
    //   activeMarker: marker,
    //   showingInfoWindow: true
    // });
    // debugger;

    // this.props.handleMapMarkerClick(props, marker, e);

    this.setState({
      open: true
    });
  }

  handleClose = () => {
    // debugger;
    this.setState({
      open: false
    });
  };

  mapClicked = (mapProps, map, clickEvent) => {
    // console.log(mapProps);
    // console.log(map);
    console.log(clickEvent);
    // console.log(clickEvent.Za.x, clickEvent.Za.y);
    console.log(clickEvent.latLng.lat(), clickEvent.latLng.lng());

    // this.setState({
    //   pendingLatitude: clickEvent.latLng.lat(),
    //   pendingLongitude: clickEvent.latLng.lng()
    // });

    this.props.handlePendingLatLongChange(clickEvent.latLng.lat(), clickEvent.latLng.lng());
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props.locations, nextProps.locations) || this.props.currentMapCenter.lat === nextProps.currentMapCenter.lat;
    // return nextProps.isFavourite != this.props.isFavourite;
  }

  render() {
    console.log('GoogleMap.js render()');
    let locations = this.props.locations.map((loc) => {

      // const animationStyle = loc.id === this.state.featuredLocationId ? this.props.google.maps.Animation.DROP : false;

      return (
        <Marker
          key={loc.geopoint.latitude + "_" + loc.geopoint.longitude}
          title={loc.nameDescr}
          name={'SOMA'}
          position={{ lat: loc.geopoint.latitude, lng: loc.geopoint.longitude }}
          onClick={this.onMarkerClick}

          locationInfo={loc}

          // animation={false}
          // animation={this.props.google.maps.Animation.DROP}
          animation={false}
        />
      );
    });

    return (
      <div>
        <Modal
          open={this.state.open}
          onClose={this.state.handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div>
            {/* <div style={{ backgroundColor: 'yellow', position: 'fixed', width: '100%', height: '100%' }} onClick={this.handleClose}>
              &nbsp;
            </div> */}

            <Paper elevation={0} style={{ height: '90%', margin: '20px', padding: '10px' }}>
              <LocationDetailsMobile selectedLocation={this.state.selectedLocation} />
            </Paper>
          </div>

        </Modal>

        <Map
          google={this.props.google}
          zoom={13}
          style={
            {
              width: '90%',
              height: this.props.height || '800px'
            }
          }
          initialCenter={{
            lat: constants.DEFAULT_MAP_CENTER.LAT,
            lng: constants.DEFAULT_MAP_CENTER.LONG
          }}
          center={{
            lat: this.props.currentMapCenter.lat,
            lng: this.props.currentMapCenter.long
          }}
          onClick={this.mapClicked}
          containerStyle={this.props.containerStyle || null}
        >

          {locations}

          {this.props.isPulseVisible && <Marker
            name={'Your position'}
            position={{ lat: this.props.pulseGeopoint.latitude, lng: this.props.pulseGeopoint.longitude }}
            icon={{
              // url: 'https://loading.io/icon/i3ca9h',
              url: pulsing, // works
              // url: wut, // works
              anchor: new this.props.google.maps.Point(64, 64),
              scaledSize: new this.props.google.maps.Size(128, 128)
            }}
          />}

          {/* <Polygon
            paths={constants.TEST_COORDS}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor="#0000FF"
            fillOpacity={0.35} /> */}

        </Map>

      </div>
    );
  }


}

export default GoogleApiWrapper({
  apiKey: constants.GMAP_API_KEY
})(GoogleMap);