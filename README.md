# Snowpack React App Template

> ✨ Bootstrapped with [Create Snowpack App](https://github.com/snowpackjs/snowpack/tree/main/create-snowpack-app/cli) starting with [app-template-react](https://github.com/snowpackjs/snowpack/tree/main/create-snowpack-app/app-template-react) and enhanced with [Socket.IO](https://socket.io/), [Sass](https://sass-lang.com/), [Prettier](https://prettier.io/), and [uvu](https://github.com/lukeed/uvu).

## Features

* All source code is using [ES Modules](https://nodejs.org/api/esm.html)
* [ESM-HMR](https://github.com/snowpackjs/esm-hmr) is enabled for development
* Includes client/server modules demonstrating web socket integration
* Minimal build process; no bundling, minifying, or transpiling is used by default
* Deployed to Heroku: https://snowpack-react-app.herokuapp.com/

## Scripts

### npm run dev

Runs the app in development mode with support for dynamic [HMR](https://www.snowpack.dev/concepts/hot-module-replacement). Open http://localhost:3000 to view it in the browser.

### npm start

Runs the app in production mode after it has been built using `npm run build`. Open http://localhost:4000 to view it in the browser.

### npm run build

Builds a static, ready-to-deploy copy of the app to the `build` directory with options for bundling and other optimizations.

### npm run format

Formats the source code for the app.

### npm run lint

Lints the source code for the app.

### npm test

Runs tests for the app.
