const { clearCache } = require('../../database/cache.js');

const cleanCache = async (req, res, next) => {
    // wait for route handler to finish running
    await next(); 
    clearCache(req.params['product_id']);
}

module.exports = cleanCache;