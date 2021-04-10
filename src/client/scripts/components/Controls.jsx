import React, { useRef, useState, useCallback, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useStateContext, useDispatchContext } from '../hooks.js';
import { formatMoney, handleEnterKeyDown } from '../utils.js';
import { logger } from '../log.js';
import * as constants from '../constants.js';

const controlsTimeouts = {
  enter: constants.CONTROLS_ENTER_TIMEOUT,
  exit: constants.CONTROLS_EXIT_TIMEOUT
};

const controlTimeouts = {
  enter: constants.CONTROL_ENTER_TIMEOUT,
  exit: constants.CONTROL_EXIT_TIMEOUT
};

const Controls = (props) => {
  logger.debug('Controls render', props);

  const { isControlsVisible } = useStateContext();
  const controlsNodeRef = useRef(null);

  return (
    <CSSTransition in={isControlsVisible} nodeRef={controlsNodeRef} timeout={controlsTimeouts} mountOnEnter unmountOnExit>
      <div ref={controlsNodeRef} className="controls">
        <NameControl />
        <SitControl />
        <InOutControl />
        <BuyInControl />
        <BetControl />
        <InsuranceControl />
        <EvenMoneyControl />
        <DecisionControl />
      </div>
    </CSSTransition>
  );
};

const NameControl = (props) => {
  logger.debug('NameControl render', props);

  const { isNameControlVisible, user } = useStateContext();
  const [name, setName] = useState(user.name);
  const dispatch = useDispatchContext();
  const nameContainerRef = useRef(null);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.select(); // set initial focus when the app first launches
    }
  }, []);

  const onEnter = useCallback(() => nameInputRef.current.select(), []);
  const onGoButtonClick = useCallback(() => dispatch({ type: 'setName', name }), [name]);
  const onNameInputChange = useCallback((event) => setName(event.currentTarget.value), []);
  const onNameInputKeyDown = useCallback((event) => handleEnterKeyDown(event, onGoButtonClick), [onGoButtonClick]);

  return (
    <CSSTransition nodeRef={nameContainerRef} in={isNameControlVisible} timeout={controlTimeouts} onEnter={onEnter} mountOnEnter unmountOnExit>
      <div ref={nameContainerRef} className="name-container">
        <p>What's your name?</p>
        <div>
          <input ref={nameInputRef} type="text" minLength="1" maxLength="20" placeholder="Name" spellCheck="false" value={name} onChange={onNameInputChange} onKeyDown={onNameInputKeyDown} />
          <button className="silver" onClick={onGoButtonClick}>Go</button>
        </div>
      </div>
    </CSSTransition>
  );
};

const SitControl = (props) => {
  logger.debug('SitControl render', props);

  const { isSitControlVisible } = useStateContext();
  const dispatch = useDispatchContext();
  const sitContainerRef = useRef(null);
  const sitButtonRef = useRef(null);

  const onEnter = useCallback(() => sitButtonRef.current.focus(), []);
  const onSitButtonClick = useCallback(() => dispatch({ type: 'sit' }), []);

  return (
    <CSSTransition nodeRef={sitContainerRef} in={isSitControlVisible} timeout={controlTimeouts} onEnter={onEnter} mountOnEnter unmountOnExit>
      <div ref={sitContainerRef} className="sit-container">
        <button ref={sitButtonRef} className="silver" onClick={onSitButtonClick}>Sit</button>
      </div>
    </CSSTransition>
  );
};

const InOutControl = (props) => {
  logger.debug('InOutControl render', props);

  const { isInOutControlVisible } = useStateContext();
  const inOutContainerRef = useRef(null);
  const inButtonRef = useRef(null);
  const outButtonRef = useRef(null);

  const onEnter = useCallback(() => inButtonRef.current.focus(), []);
  const onInButtonClick = useCallback(() => logger.debug('in'), []);
  const onOutButtonClick = useCallback(() => logger.debug('out'), []);

  return (
    <CSSTransition nodeRef={inOutContainerRef} in={isInOutControlVisible} timeout={controlTimeouts} onEnter={onEnter} mountOnEnter unmountOnExit>
      <div ref={inOutContainerRef} className="in-out-container">
        <button ref={inButtonRef} className="silver" onClick={onInButtonClick}>I'm In</button>
        <button ref={outButtonRef} className="silver" onClick={onOutButtonClick}>I'm Out</button>
      </div>
    </CSSTransition>
  );
};

const BuyInControl = (props) => {
  logger.debug('BuyInControl render', props);

  const { isBuyInControlVisible, settings, user } = useStateContext();
  const { minBet, minBuyIn, maxBuyIn } = settings;
  const [buyIn, setBuyIn] = useState(user.bankroll);
  const buyInContainerRef = useRef(null);
  const buyInInputRef = useRef(null);

  const onEnter = useCallback(() => buyInInputRef.current.select(), []);
  const onBuyInInputChange = useCallback((event) => setBuyIn(event.currentTarget.value), []);
  const onBuyInButtonClick = useCallback(() => logger.debug('buy in', buyIn), [buyIn]);

  return (
    <CSSTransition nodeRef={buyInContainerRef} in={isBuyInControlVisible} timeout={controlTimeouts} onEnter={onEnter} mountOnEnter unmountOnExit>
      <div ref={buyInContainerRef} className="buy-in-container">
        <p>The minimum bet is {formatMoney(minBet)}. Need more chips?</p>
        <div>
          <input ref={buyInInputRef} type="number" min={minBuyIn} max={maxBuyIn} placeholder="Amount" value={buyIn} onChange={onBuyInInputChange} />
          <button className="silver" onClick={onBuyInButtonClick}>Buy In</button>
        </div>
      </div>
    </CSSTransition>
  );
};

const BetControl = (props) => {
  logger.debug('BetControl render', props);

  const { isBetControlVisible, settings, user } = useStateContext();
  const { minBet, maxBet } = settings;
  const [bet, setBet] = useState(user.bet);
  const dispatch = useDispatchContext();
  const betContainerRef = useRef(null);
  const betInputRef = useRef(null);

  const onEnter = useCallback(() => betInputRef.current.select(), []);
  const onBetButtonClick = useCallback(() => dispatch({ type: 'setBet', bet }), [bet]);
  const onBetInputChange = useCallback((event) => setBet(event.currentTarget.value), []);
  const onBetInputKeyDown = useCallback((event) => handleEnterKeyDown(event, onBetButtonClick), [onBetButtonClick]);

  return (
    <CSSTransition nodeRef={betContainerRef} in={isBetControlVisible} timeout={controlTimeouts} onEnter={onEnter} mountOnEnter unmountOnExit>
      <div ref={betContainerRef} className="bet-container">
        <input ref={betInputRef} type="number" min={minBet} max={maxBet} placeholder="Amount" value={bet} onChange={onBetInputChange} onKeyDown={onBetInputKeyDown} />
        <button className="silver" onClick={onBetButtonClick}>Bet</button>
      </div>
    </CSSTransition>
  );
};

const InsuranceControl = (props) => {
  logger.debug('InsuranceControl render', props);

  const { isInsuranceControlVisible } = useStateContext();
  const insuranceContainerRef = useRef(null);
  const yesButtonRef = useRef(null);
  const noButtonRef = useRef(null);

  const onEnter = useCallback(() => noButtonRef.current.focus(), []);
  const onYesButtonClick = useCallback(() => logger.debug('yes'), []);
  const onNoButtonClick = useCallback(() => logger.debug('no'), []);

  return (
    <CSSTransition nodeRef={insuranceContainerRef} in={isInsuranceControlVisible} timeout={controlTimeouts} onEnter={onEnter} mountOnEnter unmountOnExit>
      <div ref={insuranceContainerRef} className="insurance-container">
        <p>Insurance?</p>
        <div>
          <button ref={yesButtonRef} className="silver" onClick={onYesButtonClick}>Yes</button>
          <button ref={noButtonRef} className="silver" onClick={onNoButtonClick}>No</button>
        </div>
      </div>
    </CSSTransition>
  );
};

const EvenMoneyControl = (props) => {
  logger.debug('EvenMoneyControl render', props);

  const { isEvenMoneyControlVisible } = useStateContext();
  const evenMoneyContainerRef = useRef(null);
  const yesButtonRef = useRef(null);
  const noButtonRef = useRef(null);

  const onEnter = useCallback(() => noButtonRef.current.focus(), []);
  const onYesButtonClick = useCallback(() => logger.debug('yes'), []);
  const onNoButtonClick = useCallback(() => logger.debug('no'), []);

  return (
    <CSSTransition nodeRef={evenMoneyContainerRef} in={isEvenMoneyControlVisible} timeout={controlTimeouts} onEnter={onEnter} mountOnEnter unmountOnExit>
      <div ref={evenMoneyContainerRef} className="even-money-container">
        <p>Even money?</p>
        <div>
          <button ref={yesButtonRef} className="silver" onClick={onYesButtonClick}>Yes</button>
          <button ref={noButtonRef} className="silver" onClick={onNoButtonClick}>No</button>
        </div>
      </div>
    </CSSTransition>
  );
};

const DecisionControl = (props) => {
  logger.debug('DecisionControl render', props);

  const { isDecisionControlVisible } = useStateContext();
  const decisionContainerRef = useRef(null);

  const onHitButtonClick = useCallback(() => logger.debug('hit'), []);
  const onStandButtonClick = useCallback(() => logger.debug('stand'), []);
  const onSplitButtonClick = useCallback(() => logger.debug('split'), []);
  const onDoubleButtonClick = useCallback(() => logger.debug('double'), []);
  const onSurrenderButtonClick = useCallback(() => logger.debug('surrender'), []);

  return (
    <CSSTransition nodeRef={decisionContainerRef} in={isDecisionControlVisible} timeout={controlTimeouts} mountOnEnter unmountOnExit>
      <div ref={decisionContainerRef} className="decision-container">
        <button className="gold" onClick={onHitButtonClick}>Hit</button>
        <button className="gold" onClick={onStandButtonClick}>Stand</button>
        <button className="gold" onClick={onSplitButtonClick}>Split</button>
        <button className="gold" onClick={onDoubleButtonClick}>Double</button>
        <button className="gold" onClick={onSurrenderButtonClick}>Surrender</button>
      </div>
    </CSSTransition>
  );
};

export default Controls;
