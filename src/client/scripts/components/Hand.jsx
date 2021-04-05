import React, { memo, forwardRef, createRef } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Card from './Card.jsx';
import { getClassNames } from '../utils.js';
import { logger } from '../log.js';
import * as constants from '../constants.js';

const timeouts = {
  enter: constants.CARD_ENTER_TIMEOUT,
  exit: constants.CARD_EXIT_TIMEOUT
};

const Hand = memo(forwardRef((props, ref) => {
  logger.debug('Hand render', props);

  const { hand, position } = props;
  const { active, cards } = hand;

  const classNames = getClassNames({
    hand: true,
    active: active
  });

  const style = {};

  if (position) {
    style.transform = `translate3d(${position.x}em, ${position.y}em, 0)`;
  }

  return (
    <div ref={ref} className={classNames} style={style}>
      <TransitionGroup component={null}>
        {cards.map((card, index) => {
          const cardRef = createRef(null); // avoids findDOMNode warning
          return (
            <CSSTransition key={index} nodeRef={cardRef} timeout={timeouts}>
              <Card ref={cardRef} card={card} />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </div>
  );
}));

Hand.propTypes = {
  hand: PropTypes.object.isRequired
};

Hand.displayName = 'Hand';

export default Hand;
