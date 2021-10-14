const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://localhost:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;


mongoose.Query.prototype.cache = function(options = {}) {
    this.enableCache = true;
    this.hashKey = JSON.stringify(options.key || 'default');

    return this;
};

mongoose.Query.prototype.exec = async function() {
    if (!this.enableCache) {
        console.log('Data Source: Database');
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name,
    }));
    const cachedValue = await client.hget(this.hashKey, key);

    if (cachedValue) {
        const productsProjection = { '_id': false, '__v': false, 'features': false, 'styles': false};
        const productProjection = { "_id": false, "__v": false }

        const parsedCache = JSON.parse(cachedValue);

        console.log('Data Source: Cache');
        return parsedCache;
            // return Array.isArray(parsedCache) 
            // ?  parsedCache.map(doc => new this.model(doc, productsProjection)) 
            // :  new this.model(parsedCache, productProjection);
        }

    const result = await exec.apply(this, arguments);
    
    client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 300);

    console.log('Data Source: Database');
    return result;
}

module.exports = {
    clearCache(hashKey) {
        client.del(hashKey);
    }
}