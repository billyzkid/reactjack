import React, { useRef } from 'react';
import Hand from './Hand.jsx';
import { CSSTransition } from 'react-transition-group';
import { useStateContext } from '../hooks.js';
import { logger } from '../log.js';
import * as constants from '../constants.js';

const timeouts = {
  enter: constants.DEALER_ENTER_TIMEOUT,
  exit: constants.DEALER_EXIT_TIMEOUT
};

const Dealer = (props) => {
  logger.debug('Dealer render', props);

  const { isDealerVisible, dealer } = useStateContext();
  const dealerNodeRef = useRef(null);

  return (
    <CSSTransition in={isDealerVisible} nodeRef={dealerNodeRef} timeout={timeouts}>
      <div ref={dealerNodeRef} className="dealer">
        <Hand hand={dealer.hand} />
      </div>
    </CSSTransition>
  );
};

export default Dealer;
