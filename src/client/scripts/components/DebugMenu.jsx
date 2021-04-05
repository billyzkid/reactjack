import React, { useCallback } from 'react';
import { useStateContext, useDispatchContext } from '../hooks.js';
import { generateRandomId } from '../utils.js';
import { logger } from '../log.js';
import * as constants from '../constants.js';

const DebugMenu = (props) => {
  logger.debug('DebugMenu render', props);

  const {
    isDealerVisible,
    isBannerVisible,
    isControlsVisible,
    isPlayersVisible,
    isMainMenuVisible,
    isDebugMenuVisible,
    isNameControlVisible,
    isSitControlVisible,
    isInOutControlVisible,
    isBuyInControlVisible,
    isBetControlVisible,
    isInsuranceControlVisible,
    isEvenMoneyControlVisible,
    isDecisionControlVisible,
    isInfoPopupOpen,
    isProfilePopupOpen,
    isChatPopupOpen,
    isMusicPopupOpen,
    isSettingsPopupOpen,
    isQuitPopupOpen,
    user,
    players
  } = useStateContext();

  const dispatch = useDispatchContext();
  const lastPlayer = players[players.length - 1];
  const primaryPlayer = players.find((player) => player.primary);

  const toggleDealer = useCallback(() => dispatch({ type: 'toggleDealer', isVisible: !isDealerVisible  }), [isDealerVisible]);
  const toggleBanner = useCallback(() => dispatch({ type: 'toggleBanner', isVisible: !isBannerVisible  }), [isBannerVisible]);
  const toggleControls = useCallback(() => dispatch({ type: 'toggleControls', isVisible: !isControlsVisible  }), [isControlsVisible]);
  const togglePlayers = useCallback(() => dispatch({ type: 'togglePlayers', isVisible: !isPlayersVisible  }), [isPlayersVisible]);
  const toggleMainMenu = useCallback(() => dispatch({ type: 'toggleMainMenu', isVisible: !isMainMenuVisible  }), [isMainMenuVisible]);
  const toggleDebugMenu = useCallback(() => dispatch({ type: 'toggleDebugMenu', isVisible: !isDebugMenuVisible  }), [isDebugMenuVisible]);
  const toggleNameControl = useCallback(() => dispatch({ type: 'toggleNameControl', isVisible: !isNameControlVisible  }), [isNameControlVisible]);
  const toggleSitControl = useCallback(() => dispatch({ type: 'toggleSitControl', isVisible: !isSitControlVisible  }), [isSitControlVisible]);
  const toggleInOutControl = useCallback(() => dispatch({ type: 'toggleInOutControl', isVisible: !isInOutControlVisible  }), [isInOutControlVisible]);
  const toggleBuyInControl = useCallback(() => dispatch({ type: 'toggleBuyInControl', isVisible: !isBuyInControlVisible  }), [isBuyInControlVisible]);
  const toggleBetControl = useCallback(() => dispatch({ type: 'toggleBetControl', isVisible: !isBetControlVisible  }), [isBetControlVisible]);
  const toggleInsuranceControl = useCallback(() => dispatch({ type: 'toggleInsuranceControl', isVisible: !isInsuranceControlVisible  }), [isInsuranceControlVisible]);
  const toggleEvenMoneyControl = useCallback(() => dispatch({ type: 'toggleEvenMoneyControl', isVisible: !isEvenMoneyControlVisible  }), [isEvenMoneyControlVisible]);
  const toggleDecisionControl = useCallback(() => dispatch({ type: 'toggleDecisionControl', isVisible: !isDecisionControlVisible  }), [isDecisionControlVisible]);
  const toggleInfoPopup = useCallback(() => dispatch({ type: 'toggleInfoPopup', isOpen: !isInfoPopupOpen  }), [isInfoPopupOpen]);
  const toggleProfilePopup = useCallback(() => dispatch({ type: 'toggleProfilePopup', isOpen: !isProfilePopupOpen  }), [isProfilePopupOpen]);
  const toggleChatPopup = useCallback(() => dispatch({ type: 'toggleChatPopup', isOpen: !isChatPopupOpen  }), [isChatPopupOpen]);
  const toggleMusicPopup = useCallback(() => dispatch({ type: 'toggleMusicPopup', isOpen: !isMusicPopupOpen  }), [isMusicPopupOpen]);
  const toggleSettingsPopup = useCallback(() => dispatch({ type: 'toggleSettingsPopup', isOpen: !isSettingsPopupOpen  }), [isSettingsPopupOpen]);
  const toggleQuitPopup = useCallback(() => dispatch({ type: 'toggleQuitPopup', isOpen: !isQuitPopupOpen  }), [isQuitPopupOpen]);
  const showMessage = useCallback(() => dispatch({ type: 'showMessage', message: ['Message line one.', 'Message line two.'] }), []);
  const hideMessage = useCallback(() => dispatch({ type: 'hideMessage' }), []);
  const addSystemChatMessage = useCallback(() => dispatch({ type: 'addChatMessage', chatMessage: { authorId: constants.SYSTEM_ID, authorName: constants.SYSTEM_NAME, text: 'Hello world!' } }), []);
  const addUserChatMessage = useCallback(() => dispatch({ type: 'addChatMessage', chatMessage: { authorId: user.id, authorName: user.name, text: 'Hello world!' } }), [user]);
  const addPlayer = useCallback(() => dispatch({ type: 'addPlayer', player: { id: generateRandomId(), name: 'Avery', primary: false, active: false, chips: 1000, hands: [] } }), []);
  const removePlayer = useCallback(() => dispatch({ type: 'removePlayer', playerId: lastPlayer.id }), [lastPlayer]);
  const addPrimaryPlayer = useCallback(() => dispatch({ type: 'addPlayer', player: { id: generateRandomId(), name: 'Avery', primary: true, active: false, chips: 1000, hands: [] } }), []);
  const removePrimaryPlayer = useCallback(() => dispatch({ type: 'removePlayer', playerId: primaryPlayer.id }), [primaryPlayer]);
  const addPlayerHand = useCallback(() => dispatch({ type: 'addPlayerHand', playerId: lastPlayer.id, hand: { active: false, bet: 10, cards: [] }}), [lastPlayer]);
  const removePlayerHand = useCallback(() => dispatch({ type: 'removePlayerHand', playerId: lastPlayer.id, handIndex: lastPlayer.hands.length - 1 }), [lastPlayer]);
  const dealCardToDealer = useCallback(() => dispatch({ type: 'dealCardToDealer', card: { rank: 'ace', suit: 'spades' } }), []);
  const dealCardToPlayer = useCallback(() => dispatch({ type: 'dealCardToPlayer', playerId: lastPlayer.id, handIndex: lastPlayer.hands.length - 1, card: { rank: 'ace', suit: 'spades' } }), [lastPlayer]);
  const sweepDealerHand = useCallback(() => dispatch({ type: 'sweepDealerHand' }), []);
  const sweepPlayerHand = useCallback(() => dispatch({ type: 'sweepPlayerHand', playerId: lastPlayer.id, handIndex: lastPlayer.hands.length - 1 }), [lastPlayer]);
  const flipHoleCard = useCallback(() => dispatch({ type: 'flipHoleCard' }), []);
  const changeName = useCallback(() => dispatch({ type: 'changeName', name: 'Foo' }), []);
  const quit = useCallback(() => dispatch({ type: 'quit' }), []);

  return isDebugMenuVisible && (
    <div className="debug-menu">
      <button onClick={toggleDealer}>toggleDealer</button>
      <button onClick={toggleBanner}>toggleBanner</button>
      <button onClick={toggleControls}>toggleControls</button>
      <button onClick={togglePlayers}>togglePlayers</button>
      <button onClick={toggleMainMenu}>toggleMainMenu</button>
      <button onClick={toggleDebugMenu}>toggleDebugMenu</button>
      <button onClick={toggleNameControl}>toggleNameControl</button>
      <button onClick={toggleSitControl}>toggleSitControl</button>
      <button onClick={toggleInOutControl}>toggleInOutControl</button>
      <button onClick={toggleBuyInControl}>toggleBuyInControl</button>
      <button onClick={toggleBetControl}>toggleBetControl</button>
      <button onClick={toggleInsuranceControl}>toggleInsuranceControl</button>
      <button onClick={toggleEvenMoneyControl}>toggleEvenMoneyControl</button>
      <button onClick={toggleDecisionControl}>toggleDecisionControl</button>
      <button onClick={toggleInfoPopup}>toggleInfoPopup</button>
      <button onClick={toggleProfilePopup}>toggleProfilePopup</button>
      <button onClick={toggleChatPopup}>toggleChatPopup</button>
      <button onClick={toggleMusicPopup}>toggleMusicPopup</button>
      <button onClick={toggleSettingsPopup}>toggleSettingsPopup</button>
      <button onClick={toggleQuitPopup}>toggleQuitPopup</button>
      <button onClick={showMessage}>showMessage</button>
      <button onClick={hideMessage}>hideMessage</button>
      <button onClick={addSystemChatMessage}>addSystemChatMessage</button>
      <button onClick={addUserChatMessage}>addUserChatMessage</button>
      <button onClick={addPlayer}>addPlayer</button>
      <button onClick={removePlayer}>removePlayer</button>
      <button onClick={addPrimaryPlayer}>addPrimaryPlayer</button>
      <button onClick={removePrimaryPlayer}>removePrimaryPlayer</button>
      <button onClick={addPlayerHand}>addPlayerHand</button>
      <button onClick={removePlayerHand}>removePlayerHand</button>
      <button onClick={dealCardToDealer}>dealCardToDealer</button>
      <button onClick={dealCardToPlayer}>dealCardToPlayer</button>
      <button onClick={sweepDealerHand}>sweepDealerHand</button>
      <button onClick={sweepPlayerHand}>sweepPlayerHand</button>
      <button onClick={flipHoleCard}>flipHoleCard</button>
      <button onClick={changeName}>changeName</button>
      <button onClick={quit}>quit</button>
    </div>
  );
};

export default DebugMenu;
