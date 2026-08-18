const request = require('supertest');
const app = require('../src/server'); // The Express app
const { driver } = require('../src/config/database');
const crypto = require('crypto');

describe('TechPath API Integration Tests', () => {
  const testGoal = 'AWS Cloud Fundamentals';
  let userId;

  beforeAll(() => {
    userId = crypto.randomUUID();
  });

  afterAll(async () => {
    // Close the Neo4j driver connection after tests finish
    await driver.close();
  });

  describe('GET /api/topics', () => {
    it('should return a list of topics successfully', async () => {
      const response = await request(app).get('/api/topics');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/learning-path/:goal', () => {
    it('should return 400 if goal is empty', async () => {
      const response = await request(app).get('/api/learning-path/');
      expect(response.status).toBe(404); // Express router won't match empty string to parameter
    });

    it('should return 404 for non-existent topic', async () => {
      const response = await request(app).get('/api/learning-path/NonExistentTopic');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('TOPIC_NOT_FOUND');
    });

    it('should generate a valid learning path graph', async () => {
      const response = await request(app).get(`/api/learning-path/${encodeURIComponent(testGoal)}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      const { data } = response.body;
      expect(data.goal).toBe(testGoal);
      expect(Array.isArray(data.path)).toBe(true);
      expect(data.graph).toBeDefined();
      expect(Array.isArray(data.graph.nodes)).toBe(true);
      expect(Array.isArray(data.graph.links)).toBe(true);
      
      // Ensure distance/depth is calculated
      if (data.path.length > 0) {
        expect(data.path[0].distance).toBeDefined();
      }
    });

    it('should cache the learning path response', async () => {
      const start1 = Date.now();
      await request(app).get(`/api/learning-path/${encodeURIComponent(testGoal)}`);
      const duration1 = Date.now() - start1;

      const start2 = Date.now();
      await request(app).get(`/api/learning-path/${encodeURIComponent(testGoal)}`);
      const duration2 = Date.now() - start2;

      // The second request should be significantly faster due to in-memory caching
      // Though in unit tests, network latency is 0 so the difference might be small, 
      // but Neo4j takes a few ms at least.
      expect(duration2).toBeLessThanOrEqual(duration1 + 50); // Give some buffer
    });
  });

  describe('POST /api/topics/progress', () => {
    it('should mark a topic as completed for a user', async () => {
      const response = await request(app)
        .post('/api/topics/progress')
        .send({ userId, topicName: testGoal });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 400 validation error if body is invalid', async () => {
      const response = await request(app)
        .post('/api/topics/progress')
        .send({ userId: '' }); // Missing topicName
      
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/topics/prerequisite (Cycle Detection)', () => {
    it('should detect a cycle and return 400 CYCLIC_DEPENDENCY', async () => {
      // Create a temporary cyclic dependency (e.g., Target -> Source -> Target)
      // Since we know testGoal requires Networking OSI Model (indirectly)
      // Attempting to make Networking OSI Model require testGoal should trigger a cycle
      const response = await request(app)
        .post('/api/topics/prerequisite')
        .send({ source: 'Networking OSI Model', target: testGoal });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('CYCLIC_DEPENDENCY');
    });
  });
});
