import { Server } from 'socket.io';

const SYSTEM_ID = '';
const SYSTEM_NAME = 'Reactjack';
const DEALER_NAME = 'Dealer';
const MAX_CHAT_MESSAGES = 100;
const MAX_PLAYERS = 5;
const CHAT_COMMAND_KEY_REGEXP = /^\/(.+)/;

function createServer(httpServer, options) {
  const server = new Server(httpServer, options);
  const users = [];
  const dealer = {
    name: DEALER_NAME,
    hand: {
      cards: [
        { rank: 'ace', suit: 'hearts' },
        { rank: 'two', suit: 'spades' }
      ]
    }
  };
  const players = [{
      id: '1',
      name: 'Avery',
      primary: false,
      active: false,
      chips: 1000,
      hands: [{ active: false, bet: 10, cards: [{ rank: 'ace', suit: 'hearts' }, { rank: 'two', suit: 'spades' }] }
    ]}, {
      id: '2',
      name: 'Billy',
      primary: false,
      active: true,
      chips: 1000,
      hands: [
        { active: false, bet: 10, cards: [{ rank: 'ace', suit: 'hearts' }, { rank: 'two', suit: 'spades' }] },
        { active: true, bet: 10, cards: [{ rank: 'ace', suit: 'hearts' }, { rank: 'two', suit: 'spades' }] }
      ]
    }, {
      id: '3',
      name: 'Charles',
      primary: true,
      active: false,
      chips: 1000,
      hands: [
        { active: false, bet: 10, cards: [{ rank: 'ace', suit: 'hearts' }, { rank: 'two', suit: 'spades' }] }
      ]
    }
  ];
  const chatMessages = [];
  const chatCommands = {
    'list users': (socket, chatMessage) => socket.emit('list users', { users }),
    'list players': (socket, chatMessage) => socket.emit('list players', { players })
  };

  server.on('connect', (socket) => {
    console.log('socket on connect', socket.id);

    // executed when a new user joins
    socket.on('new user', (data) => {
      console.log('socket on new user', data);

      const { user } = data;
      const isSeatAvailable = players.length < MAX_PLAYERS;
      const greetingMessage = [`Welcome, ${user.name}!`];

      if (isSeatAvailable) {
        greetingMessage.push('Please have a seat.');
      } else {
        greetingMessage.push('Please wait for a seat...');
      }

      user.id = socket.id;
      users.push(user);

      socket.emit('welcome', { user, dealer, players, chatMessages, greetingMessage });
      console.log('socket emit welcome');

      addSystemChatMessage(`${user.name} has joined`);
    });

    // executed when the user changes their name
    socket.on('name change', (data) => {
      console.log('socket on name change', data);

      const { name } = data;
      const user = users.find((user) => user.id === socket.id);
      const player = players.find((player) => player.id === socket.id);

      const oldName = user.name;
      const newName = user.name = name;

      if (player) {
        player.name = name;
      }

      addSystemChatMessage(`${oldName} shall now be known as ${newName}`);
    });

    // executed when the user sends a chat message
    socket.on('chat message', (data) => {
      console.log('socket on chat message', data);

      const { text } = data;
      const user = users.find((user) => user.id === socket.id);
      const chatMessage = { authorId: user.id, authorName: user.name, text };

      addChatMessage(chatMessage);
    });

    // executed when the user clicks the quit button
    socket.on('quit', (data) => {
      console.log('socket on quit', data);

      disconnect(socket.id);
    });

    // executed when the user disconnects from the socket (e.g. closes the browser)
    socket.on('disconnect', () => {
      console.log('socket on disconnect', socket.id);

      disconnect(socket.id);
    });

    function addSystemChatMessage(text) {
      const chatMessage = { authorId: SYSTEM_ID, authorName: SYSTEM_NAME, text };
      addChatMessage(chatMessage);
    }

    function addChatMessage(chatMessage) {
      // chat commands must start with '/'
      const match = CHAT_COMMAND_KEY_REGEXP.exec(chatMessage.text);
      const commandKey = match && match[1];

      if (chatCommands[commandKey]) {
        // execute chat command
        chatCommands[commandKey](socket, chatMessage);
      } else {
        // limit the number of chat messages stored on the server
        while (chatMessages.length >= MAX_CHAT_MESSAGES) {
          chatMessages.pop();
        }

        chatMessages.push(chatMessage);

        // send the chat message to all users
        server.sockets.emit('chat message', { chatMessage });
        console.log('sockets emit chat message', chatMessage);
      }
    }

    function disconnect(id) {
      const user = users.find((user) => user.id === id);

      if (user) {
        removeUser(id);
        removePlayer(id);
        addSystemChatMessage(`${user.name} has left`);
      }
    }

    function removeUser(id) {
      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex >= 0) {
        users.splice(userIndex, 1);
      }
    }

    function removePlayer(id) {
      const playerIndex = players.findIndex((player) => player.id === id);

      if (playerIndex >= 0) {
        players.splice(playerIndex, 1);
      }
    }
  });

  return server;
}

export { createServer };
