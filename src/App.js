import React, { Component } from 'react';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container, Row, Col } from 'react-bootstrap';

const hrWidth = '25%';

const apiKey = 'AIzaSyCWIg0OhhYc1_DEXwPOXcBypSNgumuB5t4';

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
          NLNRF<span style={{ fontSize: '18px', marginLeft: '-15px' }} >.com</span>
          &nbsp;
          <span className='slogan'>NOT LEFT. NOT RIGHT. FORWARD &gt;</span>
        </h1>

        <br />

        {/* <hr class="style3" style={{width: hrWidth }} ></hr> */}


        <Row>
          <Col xs={1}>
            <Form inline>
              <Button variant="success">SUBMIT A LOCATION</Button>
            </Form>
          </Col>

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



          <Col xs={5}>
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

          </Col>

          <Col xs={2}>

          </Col>
        </Row>



        <br /><br />

        <hr class="style3" style={{ width: hrWidth }} ></hr>

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