// Polyfill essencial para compatibilidade do Three.js no React Native (evita erro de process.emitWarning no Hermes/JSC)
if (typeof process === 'undefined') {
  global.process = {};
}
if (typeof process.emitWarning !== 'function') {
  process.emitWarning = () => {};
}

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
