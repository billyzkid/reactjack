import React, { memo, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Portal from './Portal.jsx';
import { CSSTransition } from 'react-transition-group';
import { getFocusableChildren, isTabFocusable, setAriaHidden, setAriaVisible } from '../utils.js';
import { logger } from '../log.js';
import * as constants from '../constants.js';

const timeouts = {
  enter: constants.POPUP_ENTER_TIMEOUT,
  exit: constants.POPUP_EXIT_TIMEOUT
};

const animations = {
  center: 'popup-zoom',
  top: 'popup-slide-down',
  bottom: 'popup-slide-up',
  left: 'popup-slide-right',
  right: 'popup-slide-left'
};

const Popup = memo((props) => {
  logger.debug('Popup render', props);

  const {
    ariaRole,
    ariaLabel,
    className,
    position,
    isOpen,
    lockFocus,
    closeOnMaskMouseDown,
    closeOnEscapeKeyDown,
    unmountOnClose,
    onAfterOpen,
    onAfterClose,
    onRequestClose,
    children
  } = props;

  const popupRef = useRef(null);
  const maskRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    let timeout;
    let previousFocusedElement;

    if (isOpen) {
      if (popupRef.current.hidden) {
        // open popup and set initial focus
        popupRef.current.hidden = false;
        document.documentElement.classList.add('popup-open', `${className}-open`);
        document.querySelectorAll(Popup.ariaHiddenSelector).forEach(setAriaHidden);
        previousFocusedElement = document.activeElement;
        contentRef.current.focus();
        onAfterOpen();
      }
    } else {
      if (!popupRef.current.hidden) {
        // hide popup after exit animation completes
        timeout = setTimeout(() => {
          popupRef.current.hidden = true;
          document.documentElement.classList.remove('popup-open', `${className}-open`);
          document.querySelectorAll(Popup.ariaHiddenSelector).forEach(setAriaVisible);
          onAfterClose();
        }, timeouts.exit);
      }
    }

    return () => {
      // cleanup exit timer
      if (timeout) {
        clearTimeout(timeout);
      }

      // restore previous focus
      if (previousFocusedElement) {
        previousFocusedElement.focus();
      }
    };
  }, [isOpen]);

  const onMaskMouseDown = useCallback((event) => {
    // close popup on mask mouse/touch interaction
    if (closeOnMaskMouseDown) {
      event.preventDefault();
      onRequestClose();
    }
  }, [closeOnMaskMouseDown]);

  const onContentKeyDown = useCallback((event) => {
    if (event.key === 'Tab') {
      // prevent tab focus from escaping popup
      if (lockFocus) {
        const focusedElement = document.activeElement;
        const focusableChildren = getFocusableChildren(event.currentTarget).filter(isTabFocusable);
        const firstFocusableChild = focusableChildren[0];
        const lastFocusableChild = focusableChildren[focusableChildren.length - 1];

        if (focusedElement === firstFocusableChild && event.shiftKey) {
          event.preventDefault();
          lastFocusableChild.focus();
        } else if (focusedElement === lastFocusableChild && !event.shiftKey) {
          event.preventDefault();
          firstFocusableChild.focus();
        }
      }
    } else if (event.key === 'Escape') {
      // close popup on escape key
      if (closeOnEscapeKeyDown) {
        event.preventDefault();
        onRequestClose();
      }
    }
  }, [lockFocus, closeOnEscapeKeyDown]);

  return (
    <Portal>
      <div ref={popupRef} className={`popup popup-${position} ${className}`} hidden>
        <CSSTransition nodeRef={maskRef} in={isOpen} classNames="popup-fade" timeout={timeouts} unmountOnExit={unmountOnClose}>
          <div ref={maskRef} className="popup-mask" onMouseDown={onMaskMouseDown} />
        </CSSTransition>
        <CSSTransition nodeRef={contentRef} in={isOpen} classNames={animations[position]} timeout={timeouts} unmountOnExit={unmountOnClose}>
          <div ref={contentRef} className="popup-content" tabIndex="-1" role={ariaRole} aria-label={ariaLabel} onKeyDown={onContentKeyDown} children= {children} />
        </CSSTransition>
      </div>
    </Portal>
  );
});

Popup.ariaHiddenSelector = '#app';

Popup.propTypes = {
  ariaRole: PropTypes.string,
  ariaLabel: PropTypes.string,
  className: PropTypes.string.isRequired,
  position: PropTypes.oneOf(['center', 'top', 'bottom', 'left', 'right']),
  isOpen: PropTypes.bool.isRequired,
  lockFocus: PropTypes.bool,
  closeOnMaskMouseDown: PropTypes.bool,
  closeOnEscapeKeyDown: PropTypes.bool,
  unmountOnClose: PropTypes.bool,
  onAfterOpen: PropTypes.func,
  onAfterClose: PropTypes.func,
  onRequestClose: PropTypes.func,
  children: PropTypes.node.isRequired
};

Popup.defaultProps = {
  ariaRole: 'dialog',
  ariaLabel: null,
  className: null,
  position: 'center',
  isOpen: false,
  lockFocus: true,
  closeOnMaskMouseDown: true,
  closeOnEscapeKeyDown: true,
  unmountOnClose: false,
  onAfterOpen: () => {},
  onAfterClose: () => {},
  onRequestClose: () => {},
  children: null
};

Popup.displayName = 'Popup';

export default Popup;
