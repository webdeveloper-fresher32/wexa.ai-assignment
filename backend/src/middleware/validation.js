const { z } = require('zod');

/**
 * Validates request data against a Zod schema.
 * @param {z.ZodSchema} schema 
 * @param {'body' | 'query' | 'params'} property 
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[property]);
      req[property] = parsed; // Replace with validated/coerced data
      next();
    } catch (err) {
      if (err.name === 'ZodError' || err instanceof z.ZodError || (err && Array.isArray(err.errors))) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
          }
        });
      }
      next(err);
    }
  };
};

module.exports = { validate };
