const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const { REDIS_HOST } = require('../config.js');

const redisUrl = `redis://${REDIS_HOST}`;
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
client.scan = util.promisify(client.scan);

const exec = mongoose.Query.prototype.exec;


mongoose.Query.prototype.cache = function(options = {}) {
    this.enableCache = true;
    this.hashKey = JSON.stringify(options.key || 'default');

    return this;
};

mongoose.Query.prototype.exec = async function() {
    if (!this.enableCache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name,
    }));
    console.log(`Key: ${key}`)
    console.log(`Hash Key: ${this.hashKey}`);
    const cachedValue = await client.hget(this.hashKey, key);
    console.log(`Cached Value: ${cachedValue}`);
    if (cachedValue) {
        const parsedCache = JSON.parse(cachedValue);

        return parsedCache;
        }

    const result = await exec.apply(this, arguments);
    console.log(client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 300))

    return result;
}

// Scanns all keys for given patten, returns array of matching keys
const scanAll = async (pattern) => {
    const found = [];
    let cursor = '0';
  
    do {
      const reply = await client.scan(cursor, 'MATCH', pattern);
  
      cursor = reply[0];
      found.push(...reply[1]);
    } while (cursor !== '0');
  
    return found;
}

// Removes data associated with given key from cache
const clearCache = (hashKey) => {
    client.del(hashKey);
}

module.exports = {
    scanAll,
    clearCache
}