import { Server } from 'socket.io';

const SYSTEM_ID = '';
const SYSTEM_NAME = 'Reactjack';
const DEALER_NAME = 'Dealer';
const MAX_CHAT_MESSAGES = 100;
const MAX_PLAYERS = 5;
const CHAT_COMMAND_KEY_REGEXP = /^\/(.+)/;

const cardSuits = [ 'spades', 'hearts', 'clubs', 'diamonds' ];
const cardRanks = [ 'ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king' ];
const cardValues = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10 ];
const shoeSize = 6;

const users = [];
const dealer = { name: DEALER_NAME, hand: { cards: [] } };
const players = [];
const chatMessages = [];
const chatCommands = {
  'list users': (socket, chatMessage) => socket.emit('list users', { users }),
  'list players': (socket, chatMessage) => socket.emit('list players', { players })
};

let gameInProgress = false;
let betCount = 0;
let playersReadyCount = 0;
let activePlayers = [];
let shoe = createShoe();

shuffle(shoe);

function createServer(httpServer, options) {
  const server = new Server(httpServer, options);

  server.on('connect', (socket) => {
    console.log('socket on connect', socket.id);

    socket.emit('connected');
    console.log('socket emit connected');

    // executed when a new user joins
    socket.on('new user', (data) => {
      console.log('socket on new user', data);

      const { user } = data;
      const isSeatAvailable = players.length < MAX_PLAYERS;
      const greetingMessage = [`Welcome, ${user.name}!`];

      if (isSeatAvailable && !gameInProgress) {
        greetingMessage.push('Please have a seat.');
      } else {
        greetingMessage.push('Please wait for a seat...');
      }

      user.id = socket.id;
      users.push(user);

      socket.emit('welcome', { user, dealer, players, chatMessages, greetingMessage });
      console.log('socket emit welcome');

      if (isSeatAvailable && !gameInProgress) {
        socket.emit('sit invite');
      }

      addSystemChatMessage(`${user.name} has joined`);
    });

    // rename "new player"?
    socket.on('deal me in', (data) => {
      console.log('socket on deal me in', data);

      const user = users.find((user) => user.id === socket.id);

      const newPlayer = {
        id: user.id,
        name: user.name,
        primary: false,
        active: false,
        chips: user.bankroll,
        hands: []
      };

      players.push(newPlayer);

      server.sockets.emit('new player', { players });
      console.log('sockets emit new player', players);

      if (players.length >= MAX_PLAYERS) {
        server.sockets.emit('sit uninvite');
        console.log('sockets emit sit uninvite');
      }
    });

    socket.on('place bet', (data) => {
      console.log('socket on place bet', data);

      const { bet } = data;
      const player = players.find((player) => player.id === socket.id);

      if (player) {
        const hand = { active: false, bet, cards: [] };
        player.hands.push(hand);
        player.chips -= bet;

        betCount++;

        console.log(`${player.name} bet ${bet}`);
        console.log(`${betCount} out of ${players.length} have bet so far`);

        server.sockets.emit('player bet', { player });
        console.log('sockets emit player bet', player);

        if (betCount === players.length) {
          setTimeout(startGame, 1000);
        }
      } else {
        console.error(`Expected to find player ${socket.id}`);
      }
    });

    socket.on('player ready', () => {
      console.log('socket on player ready', socket.id);

      playersReadyCount++;

      if (playersReadyCount === players.length) {
        testForBlackjacks();
      };
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

    function startGame() {
      gameInProgress = true;
      betCount = 0;

      dealCards();

      server.sockets.emit('sit uninvite');
      console.log('sockets emit sit uninvite');
    }

    function endGame() {
      // TODO
    }

    function resetGame() {
      dealer.hand = {};

      players.forEach((player) => {
        player.active = false;
        player.hands = [];
      });

      gameInProgress = false;
      betCount = 0;
      playersReadyCount = 0;
      activePlayers = [];

      if (shoe.length < 52) {
        shoe = createShoe();
        shuffle(shoe);
      }

      server.sockets.emit('sit invite');
    }

    function dealCards() {
      // deal two cards for each player
      players.forEach((player) => {
        const firstHand = player.hands[0];
        const firstCard = shoe.shift();
        const secondCard = shoe.shift();

        firstHand.cards.push(firstCard);
        console.log(`${player.name} receives ${firstCard.rank} of ${firstCard.suit}`);

        firstHand.cards.push(secondCard);
        console.log(`${player.name} receives ${secondCard.rank} of ${secondCard.suit}`);

        const { total, displayTotal } = calculateHand(firstHand);

        firstHand.total = total;
        firstHand.displayTotal = displayTotal;
      });

      // deal two cards for the dealer
      const firstCard = shoe.shift();
      const secondCard = shoe.shift();

      // hole card
      secondCard.hidden = true;

      dealer.hand.cards.push(firstCard);
      console.log(`${dealer.name} receives ${firstCard.rank} of ${firstCard.suit}`)

      dealer.hand.cards.push(secondCard);
      console.log(`${dealer.name} receives ${secondCard.rank} of ${secondCard.suit}`)

      const { total, displayTotal } = calculateHand(dealer.hand);

      dealer.hand.total = total;
      dealer.hand.displayTotal = displayTotal;

      console.log(`${shoe.length} cards left in shoe`);

      server.sockets.emit('deal cards', { dealer, players });
      console.log('sockets emit deal cards', dealer, players);
    }

    function testForBlackjacks() {
      // if dealer gets blackjack, game is over
      if (dealer.hand.total === 21) {
        console.log('dealer has blackjack');
        endGame();
        setTimeout(resetGame, 1000);
      } else {
        console.log('checking players for blackjack');
        activePlayers = players.filter((player) => {
          const firstHand = player.hands[0];
          if (firstHand.total === 21) {
            console.log(`${player.name} has blackjack!`);
            player.chips += (firstHand.bet + (firstHand.bet * 1.5)); // TODO: get blackjack multiplier from settings

            // let player know their turn is over
            server.to(player.id).emit('turn over');
            server.sockets.emit('player bet', { player });
          }

          return firstHand.total < 21;
        });

        if (activePlayers.length > 0) {
          server.sockets.emit('whose turn', { player: activePlayers[0] });
        } else {
          endGame();
          setTimeout(resetGame, 1000);
        }
      }
    }
  });

  return server;
}

function createDeck() {
  const deck = [];

  cardSuits.forEach((suit, suitIndex) => {
      cardRanks.forEach((rank, rankIndex) => {
          const card = { suit, rank, value: cardValues[rankIndex] };
          deck.push(card);
      });
  });

  return deck;
}

function createShoe() {
  const shoe = [];

  for (let i = 0; i < shoeSize; i++) {
      const deck = createDeck();
      shoe.push(...deck);
  }

  return shoe;
}

function shuffle(array) {
  // Fisher-Yates shuffle implementation:
  // https://javascript.info/task/shuffle
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ array[i], array[j] ] = [ array[j], array[i] ];
  }
}

function calculateHand(hand) {
  let total = hand.cards.reduce((total, card) => total + card.value, 0);
  let displayTotal;

  // if the hand is soft
  if (hasAce(hand) && total + 10 <= 21) {
    displayTotal = `${total} or ${total + 10}`;
    total += 10;
  } else if (total > 0) {
    displayTotal = `${total}`;
  } else {
    displayTotal = '';
  }

  return { total, displayTotal };
}

function hasAce(hand) {
  return !!hand.cards.find((card) => card.rank === 'ace');
}

export { createServer };
