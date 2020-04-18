import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker, Polygon } from 'google-maps-react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container, Row, Col, Dropdown, DropdownButton, ToggleButtonGroup, ToggleButton, Badge } from 'react-bootstrap';
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import * as firebase from 'firebase';
import 'firebase/firestore';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import { AddLocation, Favorite, AccountCircle, Photo } from '@material-ui/icons';
import * as constants from './constants';
import LocationSubmitter from './LocationSubmitter';

import GoogleMap from './GoogleMap';

import CrossUnite from './media/xu.png';
import PoopAndNeedles from './media/poopandneedles.png';

let db, storage, storageRef;

const hrWidth = '25%';

const apiKey = 'AIzaSyCWIg0OhhYc1_DEXwPOXcBypSNgumuB5t4';

const containerStyle = {
  position: 'relative',
  width: '100%',
  height: '800px',
  // textAlign: 'center',
  // display: 'inline-flex',
  // justifyContent: 'center'
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

    pendingPicVid: null,

    usersCurrentLatLong: null,

    currentMapCenterLat: 47.61785407164923,
    currentMapCenterLong: -122.31657144387441,

    selectedLocation: null,

    featuredLocationId: null,

    mobiCurrentSection: 'add'
  };

  handlePendingLatLongChange = (lat, long) => {

    this.setState({
      pendingLatitude: lat,
      pendingLongitude: long
    });
  }

  handleMobiCurrSectionChange = (event, value) => {
    this.setState({ mobiCurrentSection: value })
  }

  componentDidMount() {
    let targetX = document.getElementById("demo");

    // Initialize Firebase
    firebase.initializeApp(constants.FIREBASE_CONFIG);
    firebase.analytics();

    db = firebase.firestore();

    // Get a reference to the storage service, which is used to create references in your storage bucket
    storage = firebase.storage();
    storageRef = storage.ref();

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
    this.setState({
      currentMapCenterLat: position.coords.latitude,
      currentMapCenterLong: position.coords.longitude
    });
  }





  handleSubmit = (e) => {
    e.preventDefault();

    // Add a new document with a generated id.
    db.collection("locations").add({
      nameDescr: this.state.pendingLocationNameDescription,
      geopoint: new firebase.firestore.GeoPoint(this.state.pendingLatitude, this.state.pendingLongitude),
      dateTime: moment().format(),
      mediaUrl: null
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);

        this.setState({
          pendingLocationNameDescription: '',
          pendingLatitude: '',
          pendingLongitude: ''
        });

        if (document.getElementById('fileSelector').files[0]) {
          let file = document.getElementById('fileSelector').files[0];

          const guid = uuidv4();
          var pendingMediaRef = storageRef.child('locations/' + guid);

          pendingMediaRef.put(file).then((snapshot) => {
            console.log(`Media uploaded successfully :) GUID: ${guid}`);
            console.log(snapshot);

            document.getElementById('fileSelector').value = null;

            storageRef.child('locations/' + guid).getDownloadURL().then((url) => {
              // `url` is the download URL for 'images/stars.jpg'

              /*
              // This can be downloaded directly:
              var xhr = new XMLHttpRequest();
              xhr.responseType = 'blob';
              xhr.onload = function(event) {
                var blob = xhr.response;
              };
              xhr.open('GET', url);
              xhr.send();
              */

              // Or inserted into an <img> element:
              // var img = document.getElementById('myimg');
              // img.src = url;



              var tempRef = db.collection("locations").doc(docRef.id);

              // Set the "capital" field of the city 'DC'
              return tempRef.update({
                id: docRef.id,
                mediaUrl: url
              })
                .then(() => {
                  console.log("Document successfully updated with the media URL :)");
                })
                .catch((error) => {
                  // The document probably doesn't exist.
                  console.error("Error updating document: ", error);
                });


            }).catch((error) => {
              // Handle any errors
            });


          });
        }


      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });

  }

  onMarkerClick = (props, marker, e) => {
    console.log(props);
    console.log(marker);
    console.log(e);

    console.log(props.locationInfo);

    this.setState({
      selectedLocation: props.locationInfo
    });
  }

  render() {
    console.log("App.js render()");

    let locations = this.state.locations.map((loc) => {

      const animationStyle = loc.id === this.state.featuredLocationId ? this.props.google.maps.Animation.DROP : false;

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
          animatioin={animationStyle}
        />
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

          <Col xs={6} xl={12}>
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



          <Col xs={6} xl={12}>
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
          <Col xs={7}>
            <div style={containerStyle}>

              {/* TODO */}

              {/* <Map
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

              </Map> */}

              <GoogleMap locations={this.state.locations} handlePendingLatLongChange={this.handlePendingLatLongChange} />

            </div>

          </Col>

          <Col xs={5}>
            <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
              <ToggleButton value={1}>LATEST</ToggleButton>
              <ToggleButton value={2}>MOST UPVOTED</ToggleButton>
            </ToggleButtonGroup>

            <br /><br />

            <div>
              {this.state.selectedLocation?.mediaUrl && <img src={this.state.selectedLocation.mediaUrl} style={{ maxWidth: '300px' }} />}
            </div>

            <h4>LOCATION</h4>
            <p>
              {this.state.selectedLocation?.nameDescr}
            </p>

            <h4>DATETIME</h4>
            <p>
              {/* { moment(new Date()).format() } */}
              {/* { this.state.selectedLocation?.dateTime && moment( this.state.selectedLocation?.dateTime ).format() } */}
              {this.state.selectedLocation?.dateTime && moment(this.state.selectedLocation?.dateTime).fromNow()}
            </p>

            <h4>VISUAL TYPE</h4>
            <p>
              TODO chalk, bumper sticker, sharpie, mural, etc...
            </p>


            <h4>CHANCE THAT VISUALIZATION IS STILL RUNNING</h4>
            <p>
              TODO scale from 0% - 100%
            </p>
          </Col>
        </Row>

        <br /><br />

        <section className="add-item">


          {/* <Form onSubmit={this.handleSubmit} inline={false}> */}
          
          {/*
          <Form inline={false}>
            <Container fluid={true}>

              <Row>
                <Col xs="auto">
                  STEP<br />
                  1
              </Col>
                <Col xs={2}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>LATITUDE / LONGITUDE</Form.Label>
                    <Form.Control type="text" name="pendingLatitude" placeholder="latitude" onChange={this.handleChange} value={this.state.pendingLatitude + ', ' + this.state.pendingLongitude} />
                    <Form.Text className="text-muted">
                      Click on the map to automatically fill in the lat/long coordinates.
    </Form.Text>
                  </Form.Group>
                </Col>
                <Col xs="auto">
                  STEP<br />
                  2
              </Col>
                <Col xs={2}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>VISUAL TYPE</Form.Label>
                    <DropdownButton id="dropdown-basic-button" title="Visual Type" variant="primary">
                      <Dropdown.Item href="#/action-1">business card</Dropdown.Item>
                      <Dropdown.Item href="#/action-1">chalk</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">sharpie</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">paint / permanent marker</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">sticker</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">poster</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">mural</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">other</Dropdown.Item>
                    </DropdownButton>
                    <Form.Text className="text-muted">
                      Select which category best describes your medium.
    </Form.Text>
                  </Form.Group>
                </Col>
                <Col xs="auto">
                  STEP<br />
                  3
              </Col>

                <Col xs={2}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>LOCATION NAME / DESCRIPTION</Form.Label>
                    <Form.Control type="text" name="pendingLocationNameDescription" placeholder="location name / description" onChange={this.handleChange} value={this.state.pendingLocationNameDescription} />
                    <Form.Text className="text-muted">
                      example: Space Needle, Pike Place Market, Fremont Troll
    </Form.Text>
                  </Form.Group>
                </Col>

                <Col xs="auto">
                  STEP<br />
                  4
              </Col>
                <Col xs={1}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>PIC / VIDEO</Form.Label>

                    <input type="file" id="fileSelector"></input>

                  </Form.Group>
                </Col>

                <Col xs="auto">
                  STEP<br />
                  5
              </Col>
                <Col xs={1}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>&nbsp;</Form.Label>
                    <br />


                    <Button onClick={this.handleSubmit} variant="success" size="lg">SUBMIT LOCATION</Button>
                  </Form.Group>
                </Col>


              </Row>
            </Container>

          </Form>
        */}

        <LocationSubmitter db={db} storageRef={storageRef} pendingLatitude={this.state.pendingLatitude} pendingLongitude={this.state.pendingLongitude} />

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
                  <li>And then post your work to this site!</li>
                  <li>Reach out to new people and encourage them to spread the NLNRF message!</li>
                  <li>If you're a programmer/developer, check out the To-Do List below, communicate an choose a task to work on, pair program with Brent if necessary, and then submit a pull request. <a href="https://github.com/BrentLabasan/NLNRF" target="_blank">GitHub</a></li>
                </ol>
              </p>
            </Col>
            <Col xs={4}>
              <h3>Tell me more about Andrew Yang.</h3>
              <p>Andrew Yang is a former Democratic presidential candidate (2020) and CNN political commentator,  focused on solving world problems such as mass job displace due to automation, the ever-widening income inequality gap, and climate change.</p>
            </Col>
          </Row>

          <Row>
            <Col>
              <h4>To-Do List</h4>
            </Col>
          </Row>

          <Row>
            <Col xs={3}>
              <h5>Functional</h5>
              <ul>
                <li>create mobile-friendly layout <Badge variant="light">NOT STARTED</Badge> <Badge variant="danger">HIGHEST PRIORITY</Badge> </li>
                <li>submit imgur, YouTube, Instagram media</li>
                {/* <li></li> */}
              </ul>
            </Col>

            <Col xs={3}>
              <h5>Social</h5>
              <ul>
                <li>implement user account system <Badge variant="light">NOT STARTED</Badge></li>
                <li>users can favorite their favorite NLNRF locations <Badge variant="light">NOT STARTED</Badge></li>
                <li>users can upvote an NLNRF location <Badge variant="light">NOT STARTED</Badge></li>
              </ul>
            </Col>

            <Col xs={3}>
              <h5>Cosmetic</h5>
              <ul>
                <li>Is the blue color scheme good? <Badge variant="light">NOT STARTED</Badge></li>
                {/* <li></li>
                <li></li> */}
              </ul>
            </Col>

            <Col xs={3}>
              <h5>Underneath The Hood</h5>
              <ul>
                <li>The app is one big component. Separate the components into separate, especially because even simple actions like clicking on the map or typing one letter for the location description causes map and NLNRF locations to re-render. <Badge variant="light">NOT STARTED</Badge></li>
                {/* <li></li>
                <li></li> */}
              </ul>
            </Col>

          </Row>

          <section id="byline">
            <h6>
              NLNRF was designed and developed by <a href="BrentVLabasan.com" target="_blank">Brent Labasan X&gt;</a>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              If you would like to help Brent work on NLNRF.com, contact him at BrentLabasan@gmail.com or @BrentLabasan <a href="https://github.com/BrentLabasan/NLNRF" target="_blank">GitHub</a>
            </h6>
          </section>

          <br /><br />

          <section id="logos">
            <img src={CrossUnite} className="" alt="" style={{ maxHeight: '50px' }} />

            <a href="https://FabricatorMusic.com" className="FabricatorMusic" target="_blank">
              <span className="FabricatorMusic">Fabricator Music</span>
            </a>

            <img src={PoopAndNeedles} className="" alt="" style={{ maxHeight: '50px' }} />


          </section>

        </footer>

        <BottomNavigation value={this.state.mobiCurrentSection} onChange={this.handleMobiCurrSectionChange} className={null}>
          <BottomNavigationAction label="Add Location" value="add" icon={<AddLocation />} />
          <BottomNavigationAction label="Latest" value="latest" icon={<Photo />} />
          <BottomNavigationAction label="Favorites" value="favorites" icon={<Favorite />} />
          <BottomNavigationAction label="Account" value="account" icon={<AccountCircle />} />
        </BottomNavigation>


      </div>


    );
  }
}

export default GoogleApiWrapper({
  apiKey: constants.GMAP_API_KEY
})(MapContainer);