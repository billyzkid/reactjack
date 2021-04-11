import React, { Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { useStateContext } from '../hooks.js';
import { formatMoney } from '../utils.js';
import { logger } from '../log.js';
import * as constants from '../constants.js';

const bannerTimeouts = {
  enter: constants.BANNER_ENTER_TIMEOUT,
  exit: constants.BANNER_EXIT_TIMEOUT
};

const bannerItemTimeouts = {
  enter: constants.BANNER_ITEM_ENTER_TIMEOUT,
  exit: constants.BANNER_ITEM_EXIT_TIMEOUT
};

const Banner = (props) => {
  logger.debug('Banner render', props);

  const { isBannerVisible, dealer, players, message } = useStateContext();
  const bannerNodeRef = useRef(null);
  const primaryPlayer = players.find((player) => player.primary);

  return (
    <CSSTransition in={isBannerVisible} nodeRef={bannerNodeRef} timeout={bannerTimeouts} mountOnEnter unmountOnExit>
      <div ref={bannerNodeRef} className="banner">
        <hr />
        <div>
          <div>
            <PlayerChips player={primaryPlayer} />
            <PlayerBet player={primaryPlayer} />
          </div>
          <div>
            <Message message={message} />
          </div>
          <div>
            <PlayerHandTotal player={primaryPlayer} />
            <DealerHandTotal dealer={dealer} />
          </div>
        </div>
        <hr />
      </div>
    </CSSTransition>
  );
};

const PlayerChips = (props) => {
  logger.debug('PlayerChips render', props);

  const { player } = props;
  const containerNodeRef = useRef(null);
  const isVisible = !!player;

  return (
    <SwitchTransition>
      <CSSTransition key={isVisible} nodeRef={containerNodeRef} timeout={bannerItemTimeouts}>
        <Fragment>
          {isVisible && (
            <div ref={containerNodeRef} className="player-chips">
              <p>Chips</p>
              <p>{formatMoney(player.chips)}</p>
            </div>
          )}
        </Fragment>
      </CSSTransition>
    </SwitchTransition>
  );
};

PlayerChips.propTypes = {
  player: PropTypes.object
};

const PlayerBet = (props) => {
  logger.debug('PlayerBet render', props);

  const { player } = props;
  const containerNodeRef = useRef(null);
  const isVisible = player && player.hands.length > 0;

  return (
    <SwitchTransition>
      <CSSTransition key={isVisible} nodeRef={containerNodeRef} timeout={bannerItemTimeouts}>
        <Fragment>
          {isVisible && (
            <div ref={containerNodeRef} className="player-bet">
              <p>Bet</p>
              <p>
                {player.hands.map((hand, index) => (
                  <span key={index}>{formatMoney(hand.bet)}</span>
                ))}
              </p>
            </div>
          )}
        </Fragment>
      </CSSTransition>
    </SwitchTransition>
  );
};

PlayerBet.propTypes = {
  player: PropTypes.object
};

const PlayerHandTotal = (props) => {
  logger.debug('PlayerHandTotal render', props);

  const { player } = props;
  const containerNodeRef = useRef(null);
  const isVisible = player && player.hands.length > 0;

  return (
    <SwitchTransition>
      <CSSTransition key={isVisible} nodeRef={containerNodeRef} timeout={bannerItemTimeouts}>
        <Fragment>
          {isVisible && (
            <div ref={containerNodeRef} className="player-hand-total">
              <p>{player.name}</p>
              <p>
                {player.hands.map((hand, index) => (
                  <span key={index}>{hand.displayTotal}</span>
                ))}
              </p>
            </div>
          )}
        </Fragment>
      </CSSTransition>
    </SwitchTransition>
  );
};

PlayerHandTotal.propTypes = {
  player: PropTypes.object
};

const DealerHandTotal = (props) => {
  logger.debug('DealerHandTotal render', props);

  const { dealer } = props;
  const containerNodeRef = useRef(null);
  const isVisible = dealer && dealer.hand.cards.length > 1 && !dealer.hand.cards[1].hidden;

  return (
    <SwitchTransition>
      <CSSTransition key={isVisible} nodeRef={containerNodeRef} timeout={bannerItemTimeouts}>
        <Fragment>
          {isVisible && (
            <div ref={containerNodeRef} className="dealer-hand-total">
              <p>{dealer.name}</p>
              <p>{dealer.hand.displayTotal}</p>
            </div>
          )}
        </Fragment>
      </CSSTransition>
    </SwitchTransition>
  );
};

DealerHandTotal.propTypes = {
  dealer: PropTypes.object
};

const Message = (props) => {
  logger.debug('Message render', props);

  const { message } = props;
  const containerNodeRef = useRef(null);
  const isVisible = message && message.length > 0;

  return (
    <SwitchTransition>
      <CSSTransition key={isVisible} nodeRef={containerNodeRef} timeout={bannerItemTimeouts}>
        <Fragment>
          {isVisible && (
            <div ref={containerNodeRef} className="message">
              <p>
                {message.map((line, index) => (
                  <span key={index}>{line}</span>
                ))}
              </p>
            </div>
          )}
        </Fragment>
      </CSSTransition>
    </SwitchTransition>
  );
};

Message.propTypes = {
  message: PropTypes.array
};

export default Banner;
