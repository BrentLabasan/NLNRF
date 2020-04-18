import React, { useState } from 'react';
import moment from 'moment';

export default function LatestSubmissions(props) {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);

    const style = {
        padding: '10px',
        border: '1px solid grey'
    };

    function compare(a, b) {
        // debugger;
        console.log('HMMM', moment(a.dateTime).format(),  moment(b.dateTime).format());
        console.log('return value', a.dateTime > b.dateTime ? 1 : -1);
        return a.dateTime < b.dateTime ? 1 : -1;
    }

    // debugger;
    // console.table(props.locations.slice(0, 10).sort(compare));
    let sorted = props.locations.slice(0, 10).sort(compare);
    const latestSubmissions = sorted.map((loc) => {
        // debugger;
        return <li style={style}>
            {loc.nameDescr}
            <br />
            {moment(loc.dateTime).fromNow()}

        </li>
    });


    return (
        <div>
            {/* <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button> */}

            <ul>
                {latestSubmissions}
            </ul>

        </div>
    );
}