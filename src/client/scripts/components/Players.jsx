import React, { useRef, createRef } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Player from './Player.jsx';
import { useStateContext } from '../hooks.js';
import { getPlayerPositions } from '../utils.js';
import { logger } from '../log.js';
import * as constants from '../constants.js';

const playersTimeouts = {
  enter: constants.PLAYERS_ENTER_TIMEOUT,
  exit: constants.PLAYERS_EXIT_TIMEOUT
};

const playerTimeouts = {
  enter: constants.PLAYER_ENTER_TIMEOUT,
  exit: constants.PLAYER_EXIT_TIMEOUT
};

const Players = (props) => {
  logger.debug('Players render', props);

  const { isPlayersVisible, players } = useStateContext();
  const playersNodeRef = useRef(null);
  const positions = getPlayerPositions(players);

  return (
    <CSSTransition in={isPlayersVisible} nodeRef={playersNodeRef} timeout={playersTimeouts} mountOnEnter unmountOnExit>
      <div ref={playersNodeRef} className="players">
        <TransitionGroup component={null}>
          {players.map((player) => {
            const playerNodeRef = createRef(null);
            const position = positions.indexOf(player) + 1;
            return (
              <CSSTransition key={player.id} nodeRef={playerNodeRef} timeout={playerTimeouts}>
                <Player ref={playerNodeRef} player={player} position={position} />
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </div>
    </CSSTransition>
  );
};

export default Players;
