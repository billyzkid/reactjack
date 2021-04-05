import React from 'react';
import Dealer from './Dealer.jsx';
import Banner from './Banner.jsx';
import Controls from './Controls.jsx';
import Players from './Players.jsx';
import { logger } from '../log.js';

const Table = (props) => {
  logger.debug('Table render', props);

  return (
    <div className="table">
      <h1>Reactjack</h1>
      <Dealer />
      <Banner />
      <Controls />
      <Players />
    </div>
  );
};

export default Table;
