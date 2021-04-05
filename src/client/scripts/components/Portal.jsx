import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { logger } from '../log.js';

const Portal = (props) => {
  logger.debug('Portal render', props);

  const { rootId, className, children } = props;
  const containerRef = useRef(null);

  useEffect(() => {
    const existingRootElement = document.getElementById(rootId);
    const rootElement = existingRootElement || Object.assign(document.createElement('div'), { id: rootId });

    if (!existingRootElement) {
      document.body.appendChild(rootElement);
    }

    rootElement.appendChild(containerRef.current);

    return () => {
      containerRef.current.remove();

      if (!existingRootElement && !rootElement.childElementCount) {
        rootElement.remove();
      }
    };
  }, [rootId]);

  if (!containerRef.current) {
    containerRef.current = Object.assign(document.createElement('div'), { className });
  }

  return createPortal(children, containerRef.current);
};

Portal.propTypes = {
  rootId: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

Portal.defaultProps = {
  rootId: 'root',
  className: 'portal',
  children: null
};

export default Portal;
