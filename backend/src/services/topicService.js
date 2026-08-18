const { driver } = require('../config/database');

class TopicService {
  async getAllTopics() {
    const session = driver.session();
    try {
      const result = await session.run('MATCH (t:Topic) RETURN t');
      return result.records.map(record => record.get('t').properties);
    } finally {
      await session.close();
    }
  }

  async getTopicByName(name) {
    const session = driver.session();
    try {
      const result = await session.run(
        `
        MATCH (t:Topic {name: $name})
        OPTIONAL MATCH (t)-[:REQUIRES]->(prereq:Topic)
        OPTIONAL MATCH (next:Topic)-[:REQUIRES]->(t)
        OPTIONAL MATCH (course:Course)-[:TEACHES]->(t)
        RETURN t, collect(DISTINCT prereq) AS prerequisites, collect(DISTINCT next) AS leadsTo, collect(DISTINCT course) AS courses
        `,
        { name }
      );
      
      if (result.records.length === 0) {
        return null;
      }

      const record = result.records[0];
      const topic = record.get('t').properties;
      const prerequisites = record.get('prerequisites').filter(p => p !== null).map(p => p.properties);
      const leadsTo = record.get('leadsTo').filter(l => l !== null).map(l => l.properties);
      const courses = record.get('courses').filter(c => c !== null).map(c => c.properties);

      return {
        ...topic,
        prerequisites,
        leadsTo,
        courses
      };
    } finally {
      await session.close();
    }
  }

  async getCoursesForTopic(name) {
    const session = driver.session();
    try {
      const result = await session.run(
        'MATCH (c:Course)-[:TEACHES]->(t:Topic {name: $name}) RETURN c',
        { name }
      );
      return result.records.map(record => record.get('c').properties);
    } finally {
      await session.close();
    }
  }

  async addPrerequisite(source, target) {
    const session = driver.session();
    try {
      // 1. Validate both topics exist
      const checkTopics = await session.run(
        'MATCH (s:Topic {name: $source}), (t:Topic {name: $target}) RETURN s, t',
        { source, target }
      );
      if (checkTopics.records.length === 0) {
        throw new Error('One or both topics do not exist.');
      }

      // 2. Cycle Detection: Check if TARGET already REQUIRES SOURCE (at any depth)
      // If we add (source)-[:REQUIRES]->(target), and a path (target)-[:REQUIRES*]->(source) exists, it creates a cycle.
      const cycleCheck = await session.run(
        'MATCH p = (target:Topic {name: $target})-[:REQUIRES*]->(source:Topic {name: $source}) RETURN p',
        { source, target }
      );

      if (cycleCheck.records.length > 0) {
        throw new Error(`Cycle detected! Adding this prerequisite would create a cyclic dependency because ${target} already depends on ${source}.`);
      }

      // 3. Create relationship
      await session.run(
        `
        MATCH (s:Topic {name: $source})
        MATCH (t:Topic {name: $target})
        MERGE (s)-[:REQUIRES]->(t)
        `,
        { source, target }
      );

      return { success: true, message: `Successfully added ${target} as a prerequisite for ${source}.` };
    } finally {
      await session.close();
    }
  }
}

module.exports = new TopicService();
