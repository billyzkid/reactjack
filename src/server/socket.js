import { Server } from 'socket.io';
import * as math from '../shared/math.js';

function createServer(httpServer, options) {
  const server = new Server(httpServer, options);

  server.on('connect', (socket) => {
    console.log('socket connected', socket.id);

    // Do server-side calculations using shared code
    console.log('math.sum(1, 2) = ', math.sum(1, 2));
    console.log('math.div(1, 2) = ', math.div(1, 2));
    console.log('math.mod(1, 2) = ', math.mod(1, 2));

    socket.emit('new user', { greeting: `Hello socket ${socket.id}!` });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  });

  return server;
}

export { createServer };
