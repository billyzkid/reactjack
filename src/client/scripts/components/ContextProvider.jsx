import React, { createContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { useImmerReducer } from 'use-immer';
import { playCardFlipSound, playCardSlideSound, playChipsStackSound, playHandSweepSound } from '../utils.js';
import { logger } from '../log.js';
import * as constants from '../constants.js';

const initialState = {
  isDealerVisible: false,
  isBannerVisible: false,
  isControlsVisible: true,
  isPlayersVisible: false,
  isDebugMenuVisible: true,
  isMainMenuVisible: false,
  isInfoPopupOpen: false,
  isProfilePopupOpen: false,
  isChatPopupOpen: false,
  isMusicPopupOpen: false,
  isSettingsPopupOpen: false,
  isQuitPopupOpen: false,
  isNameControlVisible: true,
  isSitControlVisible: false,
  isInOutControlVisible: false,
  isBuyInControlVisible: false,
  isBetControlVisible: false,
  isInsuranceControlVisible: false,
  isEvenMoneyControlVisible: false,
  isDecisionControlVisible: false,
  settings: {
    soundEffects: false,
    shuffleAfterEveryRound: false,
    numDecks: 6,
    blackjackPayout: 1.5,
    insurancePayout: 2,
    dealerStandsOn: 'S17',
    dealerPeeksOn: 'P',
    playersCanDoubleOn: 'D2',
    playersCanDoubleAfterSplit: true,
    playersCanSplitAnyTens: true,
    playersCanSplitAces: true,
    playersCanResplitAces: true,
    playersCanHitSplitAces: true,
    maxNumSplits: 3,
    cardNumBonus: 'NCC',
    surrender: 'LS',
    minBet: 10,
    maxBet: 1000,
    minBuyIn: 10,
    maxBuyIn: 10000
  },
  user: {},
  dealer: { hand: { cards: [] } },
  players: [],
  chatMessages: [],
  message: []
};

const reducer = (draft, action) => {
  switch (action.type) {
    case 'toggleDealer': {
      draft.isDealerVisible = action.isVisible;
      return;
    }

    case 'toggleBanner': {
      draft.isBannerVisible = action.isVisible;
      return;
    }

    case 'toggleControls': {
      draft.isControlsVisible = action.isVisible;
      return;
    }

    case 'togglePlayers': {
      draft.isPlayersVisible = action.isVisible;
      return;
    }

    case 'toggleMainMenu': {
      draft.isMainMenuVisible = action.isVisible;
      return;
    }

    case 'toggleDebugMenu': {
      draft.isDebugMenuVisible = action.isVisible;
      return;
    }

    case 'toggleNameControl':
    case 'toggleSitControl':
    case 'toggleInOutControl':
    case 'toggleBuyInControl':
    case 'toggleBetControl':
    case 'toggleInsuranceControl':
    case 'toggleEvenMoneyControl':
    case 'toggleDecisionControl': {
      if (action.isVisible) {
        draft.isNameControlVisible = false;
        draft.isSitControlVisible = false;
        draft.isInOutControlVisible = false;
        draft.isBuyInControlVisible = false;
        draft.isBetControlVisible = false;
        draft.isInsuranceControlVisible = false;
        draft.isEvenMoneyControlVisible = false;
        draft.isDecisionControlVisible = false;
      }

      const control = action.type.slice(6);
      const key = `is${control}Visible`;
      draft[key] = action.isVisible;
      return;
    }

    case 'toggleInfoPopup':
    case 'toggleProfilePopup':
    case 'toggleChatPopup':
    case 'toggleMusicPopup':
    case 'toggleSettingsPopup':
    case 'toggleQuitPopup': {
      if (action.isOpen) {
        draft.isInfoPopupOpen = false;
        draft.isProfilePopupOpen = false;
        draft.isChatPopupOpen = false;
        draft.isMusicPopupOpen = false;
        draft.isSettingsPopupOpen = false;
        draft.isQuitPopupOpen = false;
      }

      const popup = action.type.slice(6);
      const key = `is${popup}Open`;
      draft[key] = action.isOpen;
      return;
    }

    case 'showMessage': {
      draft.message = action.message;
      return;
    }

    case 'hideMessage': {
      draft.message = [];
      return;
    }

    case 'addChatMessage': {
      draft.chatMessages.push(action.chatMessage);
      return;
    }

    case 'sendChatMessage': {
      logger.info('socket emit chat message')
      socket.emit('chat message', { text: action.message });
      return;
    }

    case 'addPlayer': {
      draft.players.push(action.player);
      return;
    }

    case 'removePlayer': {
      const index = draft.players.findIndex((player) => player.id === action.playerId);
      draft.players.splice(index, 1);
      return;
    }

    case 'addPlayerHand': {
      const player = draft.players.find((player) => player.id === action.playerId);
      player.hands.push(action.hand);
      return;
    }

    case 'removePlayerHand': {
      const player = draft.players.find((player) => player.id === action.playerId);
      player.hands.splice(action.handIndex, 1);
      return;
    }

    case 'dealCardToDealer': {
      draft.dealer.hand.cards.push(action.card);

      if (draft.settings.soundEffects) {
        playCardSlideSound();
      }

      return;
    }

    case 'dealCardToPlayer': {
      const player = draft.players.find((player) => player.id === action.playerId);
      const hand = player.hands[action.handIndex];
      hand.cards.push(action.card);

      if (draft.settings.soundEffects) {
        playCardSlideSound();
      }

      return;
    }

    case 'sweepDealerHand': {
      draft.dealer.hand.cards.splice(0, draft.dealer.hand.cards.length);

      if (draft.settings.soundEffects) {
        playHandSweepSound();
      }

      return;
    }

    case 'sweepPlayerHand': {
      const player = draft.players.find((player) => player.id === action.playerId);
      const hand = player.hands[action.handIndex];
      hand.cards.splice(0, hand.cards.length);

      if (draft.settings.soundEffects) {
        playHandSweepSound();
      }

      return;
    }

    case 'flipHoleCard': {
      const holeCard = draft.dealer.hand.cards[1];
      holeCard.hidden = !holeCard.hidden;

      if (draft.settings.soundEffects) {
        playCardFlipSound();
      }

      return;
    }

    case 'setInitialState': {
      draft.user = action.user;
      draft.dealer = action.dealer;
      draft.players = action.players;
      draft.chatMessages = action.chatMessages;

      return;
    }

    case 'setName': {
      draft.user.name = action.name;
      localStorage.setItem(constants.USER_NAME_KEY, draft.user.name);

      logger.info('socket emit new user', draft.user)
      socket.emit('new user', { user: draft.user });

      return;
    }

    case 'changeName': {
      draft.user.name = action.name;
      localStorage.setItem(constants.USER_NAME_KEY, draft.user.name);

      logger.info('socket emit name change', draft.user.name)
      socket.emit('name change', { name: draft.user.name });

      return;
    }

    case 'bet': {
      const primaryPlayer = draft.players.find((player) => player.primary);
      const hand = { active: false, bet: action.bet, cards: [] };
      primaryPlayer.hands.push(hand);

      if (draft.settings.soundEffects) {
        playChipsStackSound();
      }

      return;
    }

    case 'updateSettings': {
      draft.settings = action.settings;
      return;
    }

    case 'quit': {
      logger.info('socket emit quit')
      socket.emit('quit');

      return initialState;
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const socket = io();
const SocketContext = createContext();
const StateContext = createContext();
const DispatchContext = createContext();

const ContextProvider = (props) => {
  logger.debug('ContextProvider render', props);

  const { children } = props;
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {

    // "welcome" is server's response to "new user"
    // providing initial data for the new user when they join
    socket.on('welcome', (data) => {
      logger.debug('socket on welcome', data);

      const { user, dealer, players, chatMessages, greetingMessage } = data;

      dispatch({ type: 'setInitialState', user, dealer, players, chatMessages });
      dispatch({ type: 'toggleDealer', isVisible: true });
      dispatch({ type: 'toggleBanner', isVisible: true });
      dispatch({ type: 'toggleControls', isVisible: true });
      dispatch({ type: 'togglePlayers', isVisible: true });
      dispatch({ type: 'toggleMainMenu', isVisible: true });
      dispatch({ type: 'toggleNameControl', isVisible: false });
      dispatch({ type: 'showMessage', message: greetingMessage });
    });

    // "chat message" is received when a chat message is sent by the system or user
    // providing the new chat message to append to the chat popup
    socket.on('chat message', (data) => {
      logger.debug('socket on chat message', data);

      const { chatMessage } = data;

      dispatch({ type: 'addChatMessage', chatMessage });
    });

    // "list users" is received when the chat command message "/list users" is sent
    // displays a list of users from the server
    socket.on('list users', (data) => {
      logger.debug('socket on list users', data);

      const { users } = data;
      const otherUsers = users.filter((user) => user.id !== socket.id);
      const chatMessage = { authorId: constants.SYSTEM_ID, name: constants.SYSTEM_NAME };

      if (otherUsers.length > 0) {
        chatMessage.text = 'You\'re with:\n';
        chatMessage.text += otherUsers.map((user) => `\u2022 ${user.name}`).join('\n');
      } else {
        chatMessage.text = 'You\'re alone, sadly.';
      }

      dispatch({ type: 'addChatMessage', chatMessage });
    });

    // "list players" is received when the chat command message "/list players" is sent
    // displays a list of players from the server
    socket.on('list players', (data) => {
      logger.debug('socket on list players', data);

      const { players } = data;
      const otherPlayers = players.filter((player) => player.id !== socket.id);
      const chatMessage = { authorId: constants.SYSTEM_ID, name: constants.SYSTEM_NAME };

      if (players.length > otherPlayers.length && otherPlayers.length > 0) {
        chatMessage.text = 'You\'re playing with:\n';
        chatMessage.text += otherPlayers.map((player) => `\u2022 ${player.name}`).join('\n');
      } else if (players.length > 0) {
        chatMessage.text = 'You\'re playing alone, sadly.';
      } else {
        chatMessage.text = 'The dealer is playing with himself.';
      }

      dispatch({ type: 'addChatMessage', chatMessage });
    });

    return () => {
      socket.disconnect();
    };
  }, [socket])

  return (
    <SocketContext.Provider value={socket}>
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch} children={children} />
      </StateContext.Provider>
    </SocketContext.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ContextProvider;
export { SocketContext, StateContext, DispatchContext };
