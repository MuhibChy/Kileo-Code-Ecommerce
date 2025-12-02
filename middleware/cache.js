const redis = require('redis');
const { promisify } = require('util');
const ErrorResponse = require('../utils/errorResponse');

// Create Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

// Promisify Redis methods
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// Cache middleware
const cache = (req, res, next) => {
  const key = req.originalUrl || req.url;

  redisClient.get(key, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.set('X-Cache', 'HIT');
      res.send(JSON.parse(data));
    } else {
      res.set('X-Cache', 'MISS');
      next();
    }
  });
};

// Cache response
const cacheResponse = (duration) => {
  return (req, res, next) => {
    if (res.statusCode === 200) {
      const key = req.originalUrl || req.url;
      redisClient.setex(key, duration, JSON.stringify(res.locals.data));
    }
    next();
  };
};

// Clear cache
const clearCache = (key) => {
  return async (req, res, next) => {
    try {
      await delAsync(key);
      next();
    } catch (err) {
      next(new ErrorResponse('Cache clearing failed', 500));
    }
  };
};

module.exports = {
  cache,
  cacheResponse,
  clearCache
};