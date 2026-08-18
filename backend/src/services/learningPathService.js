const { driver } = require('../config/database');

class LearningPathService {
  async generatePath(goalTopic) {
    const session = driver.session();
    try {
      console.log('generatePath called with:', typeof goalTopic, JSON.stringify(goalTopic));
      // Find the topic first to ensure it exists
      const topicCheck = await session.run(
        'MATCH (t:Topic {name: $goalTopic}) RETURN t',
        { goalTopic }
      );
      
      if (topicCheck.records.length === 0) {
        throw new Error(`Topic '${goalTopic}' not found.`);
      }

      // Find the learning path using a multi-hop query
      // This query finds all prerequisites required to reach the goal topic
      // We order them by the depth of the dependency tree so we get a sequential path
      const result = await session.run(
        `
        MATCH p = (goal:Topic {name: $goalTopic})-[:REQUIRES*0..]->(prereq:Topic)
        WITH prereq, length(p) AS depth
        ORDER BY depth DESC
        RETURN prereq { .*, distance: depth } AS node
        `,
        { goalTopic }
      );

      // We might get duplicates if multiple paths lead to the same prerequisite.
      // So we filter duplicates, keeping the one with the highest depth (the one that needs to be learned first).
      const nodesMap = new Map();
      
      result.records.forEach(record => {
        const node = record.get('node');
        if (!nodesMap.has(node.name) || nodesMap.get(node.name).distance < node.distance) {
          nodesMap.set(node.name, node);
        }
      });

      // Convert map to array and sort by distance descending (furthest prerequisites first)
      const pathNodes = Array.from(nodesMap.values()).sort((a, b) => Number(b.distance) - Number(a.distance));
      
      return {
        goal: goalTopic,
        path: pathNodes
      };
    } finally {
      await session.close();
    }
  }
}

module.exports = new LearningPathService();
