const cache = require('node-cache');

const appCache = new cache({stdTTL: 10});

module.exports = appCache;