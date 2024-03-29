import React, { useRef, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useStateContext, useDispatchContext } from '../hooks.js';
import { logger } from '../log.js';
import * as constants from '../constants.js';

const mainMenuTimeouts = {
  enter: constants.MAIN_MENU_ENTER_TIMEOUT,
  exit: constants.MAIN_MENU_EXIT_TIMEOUT
};

const MainMenu = (props) => {
  logger.debug('MainMenu render', props);

  const { isMainMenuVisible } = useStateContext();
  const dispatch = useDispatchContext();
  const mainMenuNodeRef = useRef(null);

  const openInfoPopup = useCallback(() => dispatch({ type: 'toggleInfoPopup', isOpen: true }), []);
  const openProfilePopup = useCallback(() => dispatch({ type: 'toggleProfilePopup', isOpen: true }), []);
  const openChatPopup = useCallback(() => dispatch({ type: 'toggleChatPopup', isOpen: true }), []);
  const openMusicPopup = useCallback(() => dispatch({ type: 'toggleMusicPopup', isOpen: true }), []);
  const openSettingsPopup = useCallback(() => dispatch({ type: 'toggleSettingsPopup', isOpen: true }), []);
  const openQuitPopup = useCallback(() => dispatch({ type: 'toggleQuitPopup', isOpen: true }), []);

  return (
    <CSSTransition in={isMainMenuVisible} nodeRef={mainMenuNodeRef} timeout={mainMenuTimeouts} mountOnEnter unmountOnExit>
      <div ref={mainMenuNodeRef} className="main-menu">
        <button className="popup-button info-popup-button" aria-label="Information" onClick={openInfoPopup} />
        <button className="popup-button profile-popup-button" aria-label="Profile" onClick={openProfilePopup} />
        <button className="popup-button chat-popup-button" aria-label="Chat" onClick={openChatPopup} />
        <button className="popup-button music-popup-button" aria-label="Music" onClick={openMusicPopup} />
        <button className="popup-button settings-popup-button" aria-label="Settings" onClick={openSettingsPopup} />
        <button className="popup-button quit-popup-button" aria-label="Quit" onClick={openQuitPopup} />
      </div>
    </CSSTransition>
  );
};

export default MainMenu;
