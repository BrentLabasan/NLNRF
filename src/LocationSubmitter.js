import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button, Container, Row, Col, Dropdown, DropdownButton, ToggleButtonGroup, ToggleButton, Badge } from 'react-bootstrap';
import * as firebase from 'firebase';
import 'firebase/firestore';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';


function handleSubmit(e) {
  e.preventDefault();

  // Add a new document with a generated id.
  this.props.db.collection("locations").add({
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
        var pendingMediaRef = this.props.storageRef.child('locations/' + guid);

        pendingMediaRef.put(file).then((snapshot) => {
          console.log(`Media uploaded successfully :) GUID: ${guid}`);
          console.log(snapshot);

          document.getElementById('fileSelector').value = null;

          this.props.storageRef.child('locations/' + guid).getDownloadURL().then((url) => {
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



            var tempRef = this.props.db.collection("locations").doc(docRef.id);

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

export default function LocationSubmitter(props) {
  const [location, setLocation] = useState({
    latitude: 'a',
    longitude: 'b'
   });

   const [locationName, setLocationName] = useState({
    latitude: 'a',
    longitude: 'b'
   });

   const [pendingLatLong, setPendingLatLong] = useState('a');

  return (

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
              <Form.Control type="text" name="pendingLatitude" placeholder="latitude"  value={props.pendingLatitude + ', ' + props.pendingLongitude} />
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
              <Form.Control type="text" name="pendingLocationNameDescription" placeholder="location name / description" />
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
              {/* <button>Submit Location</button> */}

              {/* why doesn't this work? */}
              <Button onClick={handleSubmit} variant="success" size="lg">SUBMIT LOCATION</Button>
            </Form.Group>
          </Col>


        </Row>
      </Container>

    </Form>


  );
}