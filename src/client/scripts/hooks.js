import { useContext, useState, useEffect } from 'react';
import { SocketContext, StateContext, DispatchContext } from './components/ContextProvider.jsx';

function useSocketContext() {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error('useSocketContext must be used within ContextProvider');
  }

  return context;
}

function useStateContext() {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error('useStateContext must be used within ContextProvider');
  }

  return context;
}

function useDispatchContext() {
  const context = useContext(DispatchContext);

  if (!context) {
    throw new Error('useDispatchContext must be used within ContextProvider');
  }

  return context;
}

function useIsMounted() {
  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    setisMounted(true);

    return () => {
      setisMounted(false);
    };
  }, []);

  return isMounted;
}

export { useSocketContext, useStateContext, useDispatchContext, useIsMounted };
