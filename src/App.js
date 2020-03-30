import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

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
  state = {
    showingInfoWindow: false,  //Hides or the shows the infoWindow
    activeMarker: {},          //Shows the active marker upon click
    selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    return (
      <div className="App">
        <h1 id="heroLogo">
          NLNRF
          &nbsp;
          <span className='slogan'>NOT LEFT. NOT RIGHT. FORWARD.</span>
        </h1>

        <Navbar expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">NEIGHBORHOODS</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {/* <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#link">Link</Nav.Link> */}

              <NavDropdown title="Downtown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Capitol Hill" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="First Hill" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>

            </Nav>
            {/* <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-success">Search</Button>
    </Form> */}
          </Navbar.Collapse>
        </Navbar>

        <div style={containerStyle}>
          <Map
            google={this.props.google}
            zoom={19}
            style={mapStyles}
            initialCenter={{
              lat: 47.6180376,
              lng: -122.3256017
            }}
          >
            <Marker
              onClick={this.onMarkerClick}
              name={'Kenyatta International Convention Centre'}
            />
            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
              onClose={this.onClose}
            >
              <div>
                <h4>{this.state.selectedPlace.name}</h4>
              </div>
            </InfoWindow>
          </Map>
        </div>


      </div>


    );
  }
}

export default GoogleApiWrapper({
  apiKey: apiKey
})(MapContainer);