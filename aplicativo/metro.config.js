// O conteúdo do app (perguntas, guia, criadores...) fica no arquivo
// dados.js, na pasta de cima, e é o mesmo usado pela versão web.
// Esta configuração deixa o app ler arquivos daquela pasta.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.watchFolders = [...(config.watchFolders || []), path.resolve(__dirname, '..')];

module.exports = config;
