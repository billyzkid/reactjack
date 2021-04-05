import * as constants from './constants.js';

function getFocusableChildren(node) {
  const focusableSelectors = constants.FOCUSABLE_SELECTORS.join(',');
  const focusableNodes = node.querySelectorAll(focusableSelectors);

  return Array.from(focusableNodes);
}

function isTabFocusable(node) {
  return node.getAttribute('tabindex') >= 0;
}

function setAriaHidden(node) {
  node.setAttribute('aria-hidden', 'true');
}

function setAriaVisible(node) {
  node.removeAttribute('aria-hidden');
}

function getNumberOrString(value) {
  const number = Number(value);

  return !isNaN(number) ? number : value;
}

function getClassNames(obj) {
  return Object.keys(obj).filter((name) => obj[name]).join(' ');
}

function getPlayerPositions(players) {
  const primaryPlayer = players.find((player) => player.primary);
  const otherPlayers = players.filter((player) => !player.primary);
  const positions = [undefined, undefined, primaryPlayer, undefined, undefined];

  otherPlayers.forEach((player) => {
    if (!positions[0]) {
      positions[0] = player;
    } else if (!positions[4]) {
      positions[4] = player;
    } else if (!positions[2]) {
      positions[2] = player;
    } else if (!positions[1]) {
      positions[1] = player;
    } else if (!positions[3]) {
      positions[3] = player;
    } else {
      throw new Error('Table is full.');
    }
  });

  return positions;
}

function getHandPositions(hands) {
  const positions = [];

  if (hands.length > 0) {
    const initialX = -constants.HAND_DISTANCE_X * (hands.length - 1) / 2;
    const initialY = -constants.HAND_DISTANCE_Y * (hands.length - 1) / 2;

    hands.forEach((hand, index) => {
      const x = initialX + constants.HAND_DISTANCE_X * index;
      const y = initialY + constants.HAND_DISTANCE_Y * index;

      positions.push({ x, y });
    });
  }

  return positions;
}

function getHandTotal(hand) {
  let total = hand.cards.reduce((total, card) => total + getCardValue(card), 0);
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

function getCardValue(card) {
  switch (card.rank) {
    case 'ace':
      return 1;

    case 'two':
      return 2;

    case 'three':
      return 3;

    case 'four':
      return 4;

    case 'five':
      return 5;

    case 'six':
      return 6;

    case 'seven':
      return 7;

    case 'eight':
      return 8;

    case 'nine':
      return 9;

    case 'ten':
    case 'jack':
    case 'queen':
    case 'king':
      return 10;

    default:
      throw new Error(`Invalid card rank: ${rank}`);
  }
}

function formatMoney(value) {
  if (value % 1) {
    return `$${value.toFixed(2)}`;
  } else {
    return `$${value}`;
  }
}

function preloadImages() {
  const imageFiles = [
    `${constants.IMAGES_PATH}cards/back.png`
  ];

  for (let i = 0; i < 54; i++) {
    imageFiles.push(`${constants.IMAGES_PATH}cards/front-${i}.png`);
  }

  imageFiles.forEach((imageFile) => {
    const link = Object.assign(document.createElement('link'), { rel: 'preload', href: imageFile, as: 'image' });
    document.head.appendChild(link);
  });
}

function preloadSounds() {
  const soundFiles = [
    `${constants.SOUNDS_PATH}deck-shuffle.ogg`,
    `${constants.SOUNDS_PATH}hand-sweep.ogg`
  ];

  for (let i = 0; i < 4; i++) {
    soundFiles.push(`${constants.SOUNDS_PATH}card-flip-${i}.ogg`);
  }

  for (let i = 0; i < 8; i++) {
    soundFiles.push(`${constants.SOUNDS_PATH}card-slide-${i}.ogg`);
  }

  for (let i = 0; i < 6; i++) {
    soundFiles.push(`${constants.SOUNDS_PATH}chips-stack-${i}.ogg`);
  }

  soundFiles.forEach((soundFile) => {
    const link = Object.assign(document.createElement('link'), { rel: 'prefetch', href: soundFile }); // preload as "audio" is not yet supported in most browsers, including Chrome
    document.head.appendChild(link);
  });
}

function playCardFlipSound() {
  const randomInt = getRandomIntBetween(0, 3);
  const audio = new Audio(`${constants.SOUNDS_PATH}card-flip-${randomInt}.ogg`);
  audio.play();
}

function playCardSlideSound() {
  const randomInt = getRandomIntBetween(0, 7);
  const audio = new Audio(`${constants.SOUNDS_PATH}card-slide-${randomInt}.ogg`);
  audio.play();
}

function playChipsStackSound() {
  const randomInt = getRandomIntBetween(0, 5);
  const audio = new Audio(`${constants.SOUNDS_PATH}chips-stack-${randomInt}.ogg`);
  audio.play();
}

function playDeckShuffleSound() {
  const audio = new Audio(`${constants.SOUNDS_PATH}deck-shuffle.ogg`);
  audio.play();
}

function playHandSweepSound() {
  const audio = new Audio(`${constants.SOUNDS_PATH}hand-sweep.ogg`);
  audio.play();
}

function groupChatMessages(chatMessages) {
  let previousAuthorId;
  let previousItem;

  return chatMessages.reduce((array, chatMessage) => {
    const { authorId, authorName, text } = chatMessage;

    if (authorId !== previousAuthorId) {
      previousAuthorId = authorId;
      previousItem = { authorId, authorName, messages: [text] };
      array.push(previousItem);
    } else {
      previousItem.messages.push(text);
    }

    return array;
  }, []);
}

function getRandomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRandomId() {
  return getRandomIntBetween(1000000, 9999999).toString();
}

function handleEnterKeyDown(event, action) {
  if (event.key === 'Enter') {
    event.preventDefault();
    action();
  }
}

export {
  getFocusableChildren,
  isTabFocusable,
  setAriaHidden,
  setAriaVisible,
  getNumberOrString,
  getClassNames,
  getPlayerPositions,
  getHandPositions,
  getHandTotal,
  formatMoney,
  preloadImages,
  preloadSounds,
  playCardFlipSound,
  playCardSlideSound,
  playChipsStackSound,
  playDeckShuffleSound,
  playHandSweepSound,
  groupChatMessages,
  getRandomIntBetween,
  generateRandomId,
  handleEnterKeyDown
};
