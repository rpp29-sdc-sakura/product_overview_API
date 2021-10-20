const { clearCache, scanAll } = require('../../database/cache.js');

const cleanCache = async (productId) => {
    //Finds all keys with specified productId and removes them from the cache
    let result = await scanAll(`*.${productId}.*`);
    result.forEach(productListKey => {
        clearCache(productListKey);
    });
}

module.exports = cleanCache;