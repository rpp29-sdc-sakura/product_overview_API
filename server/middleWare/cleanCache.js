const { clearCache } = require('../../database/cache.js');

const cleanCache = async (productId) => {
    clearCache(productId);
}

module.exports = cleanCache;