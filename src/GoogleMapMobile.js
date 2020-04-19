import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker, Polygon } from 'google-maps-react';
import { Modal } from 'react-bootstrap';

import { Grid } from '@material-ui/core';
import LocationDetailsMobile from './LocationDetailsMobile';
import LocationSubmitterMobile from './LocationSubmitterMobile';
import * as constants from './constants';
import pulsing from './media/pulsing3.gif';
import wut from './media/wut.gif';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { LocationOn, AddLocation, Favorite, AccountCircle, Photo, Backdrop, ViewComfy } from '@material-ui/icons';

var _ = require('lodash');

export class GoogleMapMobile extends Component {

  state = {
    locations: [],
    centerLat: null,
    centerLong: null,

    currentMapCenterLat: 47.61785407164923,
    currentMapCenterLong: -122.31657144387441,

    show: false,

    modalMode: 'locationDetails' // locationDetails | addLocation
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

    this.props.handleMapMarkerClick(props, marker, e);

    this.setState({
      show: true,
      modalMode: 'locationDetails'
    });
  }

  handleClose = () => {
    // debugger;
    this.setState({
      show: false
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

  // this is the Add Location button underneath the map. It is not the Submit Location button.
  handleAddLocationButtonClick = () => {
    this.setState({
      show: true,
      modalMode: 'addLocation'
    });

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


        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>LOCATION DETAILS</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            {this.state.modalMode === 'locationDetails' && <LocationDetailsMobile selectedLocation={this.props.selectedLocation} />}
            {this.state.modalMode === 'addLocation' && <LocationSubmitterMobile selectedLocation={this.props.selectedLocation} />}

          </Modal.Body>
          <Modal.Footer>
            <Button variant="contained" color="primary" onClick={this.handleClose}>
              Close
          </Button>
            {/* <Button variant="contained" onClick={this.handleClose}>
            Save Changes
          </Button> */}
          </Modal.Footer>
        </Modal>

        {/* container div around GMap to force Add Location button to be below map didn't work */}
        <div>
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



        {/* displays LocationSubmitterMobile in a modal */}
        <div style={{ textAlign: '', position: 'absolute', bottom: '50px', width: '100%' }}>

          <Grid container spacing={3}>

            <Grid item xs={6}>

              <Button variant="contained" color="primary" onClick={this.handleAddLocationButtonClick}>
                <AddLocation /> Add Location
          </Button>
            </Grid>
            <Grid item xs={6}>
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Position the map so that <br/>the center is on the location<br/> you want to add.</span>
            </Grid>

          </Grid>


        </div>


      </div>
    );
  }


}

export default GoogleApiWrapper({
  apiKey: constants.GMAP_API_KEY
})(GoogleMapMobile);