const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configurações para suprimir warnings específicos
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configuração personalizada para desenvolvimento
if (process.env.NODE_ENV === 'development') {
  // Configurações específicas para desenvolvimento
  config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];
}

module.exports = config;
