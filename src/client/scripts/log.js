import * as constants from './constants.js';

const levelMap = {
  trace: console.trace,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error
};

const levels = Object.keys(levelMap);
const noop = () => {};

function log(options = { level: 'info' }) {
  const logger = {};

  levels.forEach((level) => {
    logger[level] = levels.indexOf(level) < levels.indexOf(options.level) ? noop : log;

    function log() {
      const fn = levelMap[level];
      const args = Array.from(arguments);
      const { prefix } = options;

      if (prefix !== undefined) {
        if (typeof prefix === 'function') {
          args.unshift(prefix(level));
        } else {
          args.unshift(prefix);
        }
      }

      fn.apply(console, args);
    }
  });

  return logger;
}

const logger = log({ level: constants.LOG_LEVEL, prefix: '[Reactjack]' });

export default log;
export { logger };
