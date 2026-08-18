const express = require('express');
const router = express.Router();
const topicService = require('../services/topicService');

// GET /api/topics
router.get('/', async (req, res) => {
  try {
    const topics = await topicService.getAllTopics();
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/topics/*name/courses
router.get('/*name/courses', async (req, res) => {
  try {
    let topicName = req.params.name;
    if (Array.isArray(topicName)) topicName = topicName[0];
    const courses = await topicService.getCoursesForTopic(topicName);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/topics/*name
router.get('/*name', async (req, res) => {
  try {
    let topicName = req.params.name || req.path.substring(1);
    if (Array.isArray(topicName)) topicName = topicName[0];
    const topic = await topicService.getTopicByName(topicName);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    res.json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
