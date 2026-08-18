const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

const cacheMiddleware = (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`[req_${req.id || 'unknown'}] Cache HIT: ${key}`);
    return res.json(cachedResponse);
  }

  console.log(`[req_${req.id || 'unknown'}] Cache MISS: ${key}`);
  
  // Override res.json to cache the response before sending it
  const originalJson = res.json;
  res.json = (body) => {
    // Only cache successful responses
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, body);
    }
    originalJson.call(res, body);
  };
  
  next();
};

module.exports = { cacheMiddleware, cache };
