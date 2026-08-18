const neo4j = require('neo4j-driver');
require('dotenv').config({ path: '../../.env' });

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !user || !password) {
  console.error('Error: Neo4j credentials missing. Please create a .env file with NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD in the root directory.');
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

module.exports = {
  driver,
  close: () => driver.close()
};
