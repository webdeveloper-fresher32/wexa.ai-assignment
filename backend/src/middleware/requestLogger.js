const { v4: uuidv4 } = require('uuid');

const requestLogger = (req, res, next) => {
  req.id = uuidv4().substring(0, 8); // Short ID for easier reading
  const start = Date.now();

  // Log on request finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[req_${req.id}] ${req.method} ${req.originalUrl} status=${res.statusCode} duration=${duration}ms`);
  });

  next();
};

module.exports = { requestLogger };
