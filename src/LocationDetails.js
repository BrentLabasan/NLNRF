import React, { useState, useEffect } from 'react';
import moment from 'moment';


export default function LocationDetails(props) {

    return (
        <div>
            <div>
                {props.selectedLocation?.mediaUrl && <img src={props.selectedLocation.mediaUrl} style={{ maxWidth: '300px' }} />}
            </div>

            <h4>LOCATION</h4>
            <p>
                {props.selectedLocation?.nameDescr}
            </p>

            <h4>DATETIME</h4>
            <p>
                {/* { moment(new Date()).format() } */}
                {/* { props.selectedLocation?.dateTime && moment( props.selectedLocation?.dateTime ).format() } */}
                {props.selectedLocation?.dateTime && moment(props.selectedLocation?.dateTime).fromNow()}
            </p>

            <h4>VISUAL TYPE</h4>
            <p>
                TODO chalk, bumper sticker, sharpie, mural, etc...
            </p>


            <h4>CHANCE THAT VISUALIZATION IS STILL RUNNING</h4>
            <p>
                TODO scale from 0% - 100%
  </p>

        </div>
    );
}