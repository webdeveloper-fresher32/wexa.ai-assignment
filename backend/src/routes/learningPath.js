const express = require('express');
const { z } = require('zod');
const router = express.Router();
const learningPathService = require('../services/learningPathService');
const { cacheMiddleware } = require('../middleware/cache');
const { sendSuccess } = require('../middleware/responseHandler');

// GET /api/learning-path/*topic
router.get('/*topic', cacheMiddleware, async (req, res, next) => {
  try {
    let topicName = req.params.topic || req.path.substring(1);
    if (Array.isArray(topicName)) topicName = topicName[0];
    
    if (!topicName) {
      throw Object.assign(new Error('Goal topic is required'), { status: 400, code: 'VALIDATION_ERROR' });
    }

    const userId = req.query.userId;
    const pathData = await learningPathService.generatePath(topicName, userId);
    sendSuccess(res, pathData);
  } catch (error) {
    if (error.message.includes('not found')) {
      error.status = 404;
      error.code = 'TOPIC_NOT_FOUND';
    }
    next(error);
  }
});

module.exports = router;
