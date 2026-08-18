const express = require('express');
const router = express.Router();
const learningPathService = require('../services/learningPathService');

// GET /api/learning-path/*topic
router.get('/*topic', async (req, res) => {
  try {
    let topicName = req.params.topic || req.path.substring(1);
    if (Array.isArray(topicName)) topicName = topicName[0];
    const pathData = await learningPathService.generatePath(topicName);
    res.json(pathData);
  } catch (error) {
    console.error('Error generating learning path:', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
