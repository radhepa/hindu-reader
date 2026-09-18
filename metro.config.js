// Metro config: adds .wasm asset handling so expo-sqlite's web worker
// can bundle. Default Metro config does not include wasm in assetExts.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (!config.resolver.assetExts.includes('wasm')) {
  config.resolver.assetExts.push('wasm');
}

module.exports = config;
