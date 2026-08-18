const { driver } = require('../config/database');

class LearningPathService {
  async generatePath(goalTopic, userId = null) {
    const session = driver.session();
    try {
      // Find the topic first to ensure it exists
      const topicCheck = await session.run(
        'MATCH (t:Topic {name: $goalTopic}) RETURN t',
        { goalTopic }
      );
      
      if (topicCheck.records.length === 0) {
        throw new Error(`Topic '${goalTopic}' not found.`);
      }

      // Fetch user's completed topics if userId is provided
      let completedTopics = new Set();
      if (userId) {
        const completedResult = await session.run(
          'MATCH (u:User {id: $userId})-[:COMPLETED]->(t:Topic) RETURN t.name AS name',
          { userId }
        );
        completedResult.records.forEach(r => completedTopics.add(r.get('name')));
      }

      // Fetch all paths to prerequisites
      const result = await session.run(
        `
        MATCH p = (goal:Topic {name: $goalTopic})-[:REQUIRES*0..]->(prereq:Topic)
        RETURN p
        `,
        { goalTopic }
      );

      const nodesMap = new Map();
      const linksMap = new Map();

      result.records.forEach(record => {
        const path = record.get('p');
        
        // Add all nodes in this path
        path.segments.forEach(segment => {
          const startNode = segment.start.properties;
          const endNode = segment.end.properties;
          
          if (!nodesMap.has(startNode.name)) nodesMap.set(startNode.name, { ...startNode, requiredBy: [] });
          if (!nodesMap.has(endNode.name)) nodesMap.set(endNode.name, { ...endNode, requiredBy: [] });
          
          // endNode (prerequisite) is required by startNode
          if (!nodesMap.get(endNode.name).requiredBy.includes(startNode.name)) {
            nodesMap.get(endNode.name).requiredBy.push(startNode.name);
          }

          // Add relationship
          const linkId = `${startNode.name}-${endNode.name}`;
          if (!linksMap.has(linkId)) {
            linksMap.set(linkId, { source: startNode.name, target: endNode.name });
          }
        });
        
        // Ensure goal node is in map if path length is 0
        if (path.segments.length === 0) {
          const node = path.start.properties;
          if (!nodesMap.has(node.name)) nodesMap.set(node.name, { ...node, requiredBy: [] });
        }
      });

      // Calculate depth (distance from goal) for sequential learning path
      const depthMap = new Map();
      depthMap.set(goalTopic, 0);

      // Simple BFS or iterative depth calculation
      let changed = true;
      while (changed) {
        changed = false;
        for (const link of linksMap.values()) {
          const sourceDepth = depthMap.get(link.source);
          if (sourceDepth !== undefined) {
            const currentTargetDepth = depthMap.get(link.target) || 0;
            if (currentTargetDepth < sourceDepth + 1) {
              depthMap.set(link.target, sourceDepth + 1);
              changed = true;
            }
          }
        }
      }

      // Format nodes for response and mark completion status
      const allNodes = Array.from(nodesMap.values()).map(n => ({
        ...n,
        distance: depthMap.get(n.name) || 0,
        completed: completedTopics.has(n.name)
      }));

      // Sort by distance descending (furthest prerequisites first)
      const pathNodes = [...allNodes].sort((a, b) => b.distance - a.distance);
      const allLinks = Array.from(linksMap.values());
      
      // Calculate progress
      const totalNodes = pathNodes.length;
      const completedCount = pathNodes.filter(n => n.completed).length;
      const progressPercent = totalNodes === 0 ? 0 : Math.round((completedCount / totalNodes) * 100);

      return {
        goal: goalTopic,
        path: pathNodes,
        progress: {
          total: totalNodes,
          completed: completedCount,
          percent: progressPercent
        },
        graph: {
          nodes: allNodes,
          links: allLinks
        }
      };
    } finally {
      await session.close();
    }
  }
}

module.exports = new LearningPathService();
