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
        OPTIONAL MATCH (t)-[:LEADS_TO]->(next:Topic)
        OPTIONAL MATCH (t)-[:TAUGHT_BY]->(course:Course)
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
        'MATCH (t:Topic {name: $name})-[:TAUGHT_BY]->(c:Course) RETURN c',
        { name }
      );
      return result.records.map(record => record.get('c').properties);
    } finally {
      await session.close();
    }
  }
}

module.exports = new TopicService();
