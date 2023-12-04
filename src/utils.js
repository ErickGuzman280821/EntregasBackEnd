const { dirname, join } = require('path');

const currentDirectory = dirname(require.main.filename || process.mainModule.filename);

module.exports = currentDirectory;