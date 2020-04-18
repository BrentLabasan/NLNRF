import React, { useState } from 'react';

export default function LatestSubmissions(props) {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  const latestSubmissions = props.locations.map((loc) => {
    return <li>
        {loc.dateTime}
        a
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