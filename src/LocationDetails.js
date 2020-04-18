import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Input, OutlinedInput } from '@material-ui/core';
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

            {/* <h4>DATETIME</h4> */}
            <p>
                {/* { moment(new Date()).format() } */}
                {/* { props.selectedLocation?.dateTime && moment( props.selectedLocation?.dateTime ).format() } */}

                {/* {props.selectedLocation?.dateTime && moment(props.selectedLocation?.dateTime).fromNow()} */}
                {props.selectedLocation?.dateTime &&                 <FormControl>
                    <InputLabel htmlFor="component-outlined">Date & Time</InputLabel>
                    <Input id="component-outlined" value={moment(props.selectedLocation?.dateTime).fromNow()} label="Name" />
                </FormControl>}
            </p>
{/* 
            <h4>VISUAL TYPE</h4> */}
            <p>
                <FormControl>
                    <InputLabel htmlFor="component-outlined">Visual Type</InputLabel>
                    <Input id="component-outlined" value={'VALUE'} label="VisualType" />
                </FormControl>
            </p>


            {/* <h4>CHANCE THAT VISUALIZATION IS STILL RUNNING</h4>
            <p>
                TODO scale from 0% - 100%
  </p> */}

        </div>
    );
}