import React, { useState } from 'react';
import Masonry from 'react-masonry-css'

export default function MasonryForLocations(props) {
  // Declare a new state variable, which we'll call "count"
  //   const [count, setCount] = useState(0);

  function compare(a, b) {
    // debugger;
    // console.log('HMMM', moment(a.dateTime).format(), moment(b.dateTime).format());
    // console.log('return value', a.dateTime > b.dateTime ? 1 : -1);
    return a.dateTime < b.dateTime ? 1 : -1;
}
  
  let array =  props.locations.sort(compare).slice(0, 7);
  let elements = array.map((loc) => {
    return <img src={loc.mediaUrl} />
  });

  return (
    <div>
      {/* <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button> */}

      <Masonry
        breakpointCols={3}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column">

        {/* array of JSX items */}
        {elements}

      </Masonry>
    </div>
  );
}