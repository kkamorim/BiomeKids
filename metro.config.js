// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adiciona suporte a modelos 3D (.glb, .gltf, .bin) para o Three.js e R3F
config.resolver.assetExts.push('glb', 'gltf', 'bin');

module.exports = config;
