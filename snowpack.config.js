export default {
  mount: {
    'src/client': { url: '/' }
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-sass'
  ],
  routes: [
  ],
  optimize: {
    //bundle: true,
    //minify: true,
  },
  packageOptions: {
  },
  devOptions: {
    port: 3000,
    open: 'default',
    hmr: true
  },
  buildOptions: {
    //watch: true,
  }
};

