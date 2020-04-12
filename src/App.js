import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import * as firebase from 'firebase';
import 'firebase/firestore';

let db;

const hrWidth = '25%';

const apiKey = 'AIzaSyCWIg0OhhYc1_DEXwPOXcBypSNgumuB5t4';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCNuNDmyFCh76Wtznx7Wvp2O6WlSCZ_gYE",
  authDomain: "nlnrf-dev.firebaseapp.com",
  databaseURL: "https://nlnrf-dev.firebaseio.com",
  projectId: "nlnrf-dev",
  storageBucket: "nlnrf-dev.appspot.com",
  messagingSenderId: "697157600851",
  appId: "1:697157600851:web:dbc0422025a65c40c868a6",
  measurementId: "G-PT563E34CP"
};

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '800px',
  textAlign: 'center',
  display: 'inline-flex',
  justifyContent: 'center'
}

const mapStyles = {
  width: '90%',
  height: '800px'
};

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false,  //Hides or the shows the infoWindow
    activeMarker: {},          //Shows the active marker upon click
    selectedPlace: {},          //Shows the infoWindow to the selected place upon a marker

    locations: [],

    pendingLocationNameDescription: '',
    pendingLatitude: '',
    pendingLongitude: '',

    usersCurrentLatLong: null,

    currentMapCenterLat: 47.61785407164923,
    currentMapCenterLong: -122.31657144387441
  };

  componentDidMount() {
    let targetX = document.getElementById("demo");

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    db = firebase.firestore();

    db.collection("locations")
      // .where("state", "==", "CA")
      .onSnapshot((querySnapshot) => {
        var locations = [];
        querySnapshot.forEach(function (loc) {
          // locations.push(loc.data().geopoint.latitude);
          locations.push(loc.data());
        });
        console.log("Current cities in CA: ", locations.join(", "));
        this.setState({
          locations: locations
        });
      });

  }



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

  getLocation = () => {
    var x = document.getElementById("demo");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);



    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
  showPosition = (position) => {
    var x = document.getElementById("demo");

    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;
debugger;
    this.setState({
      currentMapCenterLat: position.coords.latitude,
      currentMapCenterLong: position.coords.longitude
    });
  }

  mapClicked = (mapProps, map, clickEvent) => {
    // console.log(mapProps);
    // console.log(map);
    console.log(clickEvent);
    // console.log(clickEvent.Za.x, clickEvent.Za.y);
    console.log(clickEvent.latLng.lat(), clickEvent.latLng.lng());
    this.setState({
      pendingLatitude: clickEvent.latLng.lat(),
      pendingLongitude: clickEvent.latLng.lng()
    });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    // Add a new document with a generated id.
    db.collection("locations").add({
      nameDescr: this.state.pendingLocationNameDescription,
      geopoint: new firebase.firestore.GeoPoint(this.state.pendingLatitude, this.state.pendingLongitude)
    })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });



    this.setState({
      pendingLocationNameDescription: '',
      pendingLatitude: '',
      pendingLongitude: ''
    });
  }

  render() {
    debugger;

    let locations = this.state.locations.map((loc) => {
      return (
        <Marker
          key={loc.geopoint.latitude + "_" + loc.geopoint.longitude}
          title={'The marker`s title will appear as a tooltip.'}
          name={'SOMA'}
          position={{ lat: loc.geopoint.latitude, lng: loc.geopoint.longitude }} />
      );
    });

    return (
      <div className="App">
        <h1 id="heroLogo">
          NLNRF<span style={{ fontSize: '18px', marginLeft: '-15px' }} >.com</span>
          &nbsp;
          <span className='slogan'>NOT LEFT. NOT RIGHT. FORWARD &gt;</span>
        </h1>

        <br />

        {/* <hr class="style3" style={{width: hrWidth }} ></hr> */}


        <Row>
          {/* <Col xs={1}>
            <Form inline>
              <Button variant="success">SUBMIT A LOCATION</Button>
            </Form>
          </Col> */}

          <Col xs={6}>
            <Navbar expand="lg" bg="dark" variant="dark">

              <Navbar.Brand>LANDMARKS</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">

                <Nav className="mr-auto">
                  {/* <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#link">Link</Nav.Link> */}

                  <NavDropdown title="Amazon SLU Campus" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown title="Seattle Center / Space Needle" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown title="Pike Place" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown title="University of Washington" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>


                  <NavDropdown title="Seattle University" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>

                  <NavDropdown title="Community Colleges" id="basic-nav-dropdown">
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

              <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>

            </Navbar>
          </Col>



          <Col xs={6}>
            <Navbar expand="lg" bg="dark" variant="dark">


              <Navbar.Brand>NEIGHBORHOODS</Navbar.Brand>
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


                  <NavDropdown title="Pioneer Square" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>


                  <NavDropdown title="West Seattle" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>


                  <NavDropdown title="Chinatown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>


                  <NavDropdown title="Fremont" id="basic-nav-dropdown">
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

              <Navbar.Collapse id="basic-navbar-nav"></Navbar.Collapse>

            </Navbar>
          </Col>


        </Row>


        <br />

        <Row>
          <Col xs={10}>
            <div style={containerStyle}>
              <Map
                google={this.props.google}
                zoom={13}
                style={mapStyles}
                initialCenter={{
                  lat: this.state.currentMapCenterLat,
                  lng: this.state.currentMapCenterLong
                }}
                center={{
                  lat: this.state.currentMapCenterLat,
                  lng: this.state.currentMapCenterLong
                }}
                onClick={this.mapClicked}
              >

                {locations}


                {/* <Marker
    title={'The marker`s title will appear as a tooltip.'}
    name={'SOMA'}
    position={{lat: 37.778519, lng: -122.405640}} />
  <Marker
    name={'Dolores park'}
    position={{lat: 37.759703, lng: -122.428093}} />
  <Marker />
  <Marker
    name={'Your position'}
    position={{lat: 37.762391, lng: -122.439192}}
    icon={{
      url: "/path/to/custom_icon.png",
      anchor: new this.props.google.maps.Point(32,32),
      scaledSize: new this.props.google.maps.Size(64,64)
    }} /> */}

              </Map>
            </div>

          </Col>

          <Col xs={2}>
            <h4>Latest Submissions</h4>
          </Col>
        </Row>

        <section className="add-item">
          <form onSubmit={this.handleSubmit}>
            <input type="text" name="pendingLocationNameDescription" placeholder="location name / description" onChange={this.handleChange} value={this.state.pendingLocationNameDescription} />
            <input type="text" name="pendingLatitude" placeholder="latitude" onChange={this.handleChange} value={this.state.pendingLatitude} />
            <input type="text" name="pendingLongitude" placeholder="longitude" onChange={this.handleChange} value={this.state.pendingLongitude} />

            <DropdownButton id="dropdown-basic-button" title="Visual Type">
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </DropdownButton>

            <button>Submit Location</button>
          </form>
        </section>

        <br /><br />

        {/* <p>🗺️ CENTER MAP TO YOUR LOCATION</p> */}

<button onClick={this.getLocation}>🗺️ CENTER MAP TO YOUR LOCATION</button>

<p id="demo"></p>

        <br /><br />

        <hr className="style3" style={{ width: hrWidth }} ></hr>

        <br /><br />

        <footer>
          <Row>
            <Col xs={4}>
              <h3>What is NLNRF?</h3>
              <p>NLNRF is an acronym for "Not left. Not right. Forward." It's a great slogan for uniting people to tackle the problems Andrew Yang is focused on solving world problems such as mass job displace due to automation, the ever-widening income inequality gap, and climate change.</p>
            </Col>
            <Col xs={4}>
              <h3>How can I help spread the NLNRF message?</h3>
              <p>
                <ol>
                  <li>Chalk, sticker, sharpie, graffiti the slogan "Not left. Not right. Forward." on surfaces where as much people will see! Use the map above to figure out where high trafficed or underrepresented locations are.</li>
                  <li>Post your work to this site, NLNRF.com! There's a green Submit button above, or you could also click this button <Button variant="success">SUBMIT A LOCATION</Button> </li>
                  <li>Reach out to new people and encourage them to spread the NLNRF message!</li>
                </ol>
              </p>
            </Col>
            <Col xs={4}>
              <h3>Tell me more about Andrew Yang.</h3>
              <p>Andrew Yang is a former Democratic presidential candidate (2020) and CNN political commentator,  focused on solving world problems such as mass job displace due to automation, the ever-widening income inequality gap, and climate change.</p>
            </Col>
          </Row>

          <section id="byline">
            <h6>
              NLNRF was designed and developed by <a href="BrentVLabasan.com" target="_blank">Brent Labasan X&gt;</a>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              If you would like to help Brent work on NLNRF.com, contact him at BrentLabasan@gmail.com or @BrentLabasan
          </h6>
          </section>

        </footer>


      </div>


    );
  }
}

export default GoogleApiWrapper({
  apiKey: apiKey
})(MapContainer);