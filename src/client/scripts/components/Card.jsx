import React, { memo, forwardRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useIsMounted } from '../hooks.js';
import { logger } from '../log.js';
import * as constants from '../constants.js';

const Card = memo(forwardRef((props, ref) => {
  logger.debug('Card render', props);

  const { rank, suit, hidden } = props.card;
  const isMounted = useIsMounted();

  useLayoutEffect(() => {
    let timeoutId;

    if (isMounted) {
      if (hidden) {
        ref.current.className = `card ${rank}-of-${suit} flip`;
        timeoutId = setTimeout(() => { ref.current.className = 'card hidden'; }, constants.CARD_FLIP_TIMEOUT);
      } else {
        ref.current.className = `card hidden ${rank}-of-${suit} flip`;
        timeoutId = setTimeout(() => { ref.current.className = `card ${rank}-of-${suit}`; }, constants.CARD_FLIP_TIMEOUT);
      }
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [rank, suit, hidden]);

  return <div ref={ref} className={hidden ? 'card hidden' : `card ${rank}-of-${suit}`} />;
}));

Card.propTypes = {
  card: PropTypes.object.isRequired
};

Card.displayName = 'Card';

export default Card;
