// Polyfill essencial para compatibilidade do Three.js no React Native (evita erro de process.emitWarning no Hermes/JSC)
if (typeof globalThis.process === 'undefined') {
  globalThis.process = {};
}
if (typeof globalThis.process.emitWarning !== 'function') {
  globalThis.process.emitWarning = () => {};
}

// `require` e intencional aqui: imports estaticos sao avaliados antes do
// polyfill e o Three.js pode acessar process.emitWarning durante o bootstrap.
const { registerRootComponent } = require('expo');
const App = require('./App').default;

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
