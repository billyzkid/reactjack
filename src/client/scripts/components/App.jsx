import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import * as math from '../../../shared/math.js';

const App = (props) => {
  console.log('App render', props);

  // Do client-side calculations using shared code
  console.log('math.sum(1, 2) = ', math.sum(1, 2));
  console.log('math.div(1, 2) = ', math.div(1, 2));
  console.log('math.mod(1, 2) = ', math.mod(1, 2));

  const { prop1, prop2 } = props;
  const [greeting, setGreeting] = useState();

  useEffect(() => {
    const socket = io();

    socket.on('new user', (data) => {
      setGreeting(data.greeting);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="app">
      <h1>{greeting}</h1>
      <p>{`prop1 = ${prop1}`}</p>
      <p>{`prop2 = ${prop2}`}</p>
    </div>
  );
};

App.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.string
};

App.defaultProps = {
  prop1: 'foo',
  prop2: 'bar'
};

export default App;
