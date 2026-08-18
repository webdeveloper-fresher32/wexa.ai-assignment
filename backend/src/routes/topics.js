const express = require('express');
const { z } = require('zod');
const router = express.Router();
const topicService = require('../services/topicService');
const { sendSuccess } = require('../middleware/responseHandler');
const { validate } = require('../middleware/validation');

// GET /api/topics
router.get('/', async (req, res, next) => {
  try {
    const topics = await topicService.getAllTopics();
    sendSuccess(res, topics);
  } catch (error) {
    next(error);
  }
});

// GET /api/topics/*name/courses
router.get('/*name/courses', async (req, res, next) => {
  try {
    let topicName = req.params.name;
    if (Array.isArray(topicName)) topicName = topicName[0];
    const courses = await topicService.getCoursesForTopic(topicName);
    sendSuccess(res, courses);
  } catch (error) {
    next(error);
  }
});

// POST /api/topics/prerequisite
const prereqSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1)
});

router.post('/prerequisite', validate(prereqSchema, 'body'), async (req, res, next) => {
  try {
    const { source, target } = req.body;
    const result = await topicService.addPrerequisite(source, target);
    sendSuccess(res, result, 201);
  } catch (error) {
    if (error.message.includes('cycle')) {
      error.status = 400;
      error.code = 'CYCLIC_DEPENDENCY';
    }
    next(error);
  }
});

// POST /api/topics/progress
const progressSchema = z.object({
  userId: z.string().min(1),
  topicName: z.string().min(1)
});

router.post('/progress', validate(progressSchema, 'body'), async (req, res, next) => {
  try {
    const { userId, topicName } = req.body;
    await topicService.markTopicCompleted(userId, topicName);
    sendSuccess(res, { success: true, message: `Topic ${topicName} marked as completed for ${userId}` });
  } catch (error) {
    next(error);
  }
});

// GET /api/topics/*name
router.get('/*name', async (req, res, next) => {
  try {
    let topicName = req.params.name || req.path.substring(1);
    if (Array.isArray(topicName)) topicName = topicName[0];
    const topic = await topicService.getTopicByName(topicName);
    if (!topic) {
      throw Object.assign(new Error('Topic not found'), { status: 404, code: 'TOPIC_NOT_FOUND' });
    }
    sendSuccess(res, topic);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
