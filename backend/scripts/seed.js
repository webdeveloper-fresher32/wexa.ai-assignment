const neo4j = require('neo4j-driver');
require('dotenv').config({ path: '../.env' }); // Assuming .env is in the root directory

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !user || !password) {
  console.error('Error: Neo4j credentials missing. Please create a .env file with NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD in the root directory.');
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const topics = [
  // Foundations
  { name: 'Programming Basics', description: 'Core concepts of programming such as variables, loops, and logic.', difficulty: 'Beginner', category: 'Foundations' },
  { name: 'Git', description: 'Version control system for tracking changes in source code.', difficulty: 'Beginner', category: 'Foundations' },
  { name: 'Command Line', description: 'Interacting with your operating system via text commands.', difficulty: 'Beginner', category: 'Foundations' },
  { name: 'Linux', description: 'Operating system fundamentals for developers.', difficulty: 'Beginner', category: 'Foundations' },
  { name: 'Networking', description: 'How computers communicate over networks.', difficulty: 'Beginner', category: 'Foundations' },
  { name: 'HTTP', description: 'The foundation of data communication for the World Wide Web.', difficulty: 'Intermediate', category: 'Foundations' },

  // Web
  { name: 'HTML', description: 'Standard markup language for documents designed to be displayed in a web browser.', difficulty: 'Beginner', category: 'Web' },
  { name: 'CSS', description: 'Style sheet language used for describing the presentation of a document.', difficulty: 'Beginner', category: 'Web' },
  { name: 'JavaScript', description: 'High-level, often just-in-time compiled language that conforms to the ECMAScript standard.', difficulty: 'Beginner', category: 'Web' },
  { name: 'TypeScript', description: 'A strict syntactical superset of JavaScript and adds optional static typing.', difficulty: 'Intermediate', category: 'Web' },
  { name: 'REST APIs', description: 'Representational state transfer architectural style for web services.', difficulty: 'Intermediate', category: 'Web' },

  // Frontend
  { name: 'React', description: 'A JavaScript library for building user interfaces.', difficulty: 'Intermediate', category: 'Frontend' },
  { name: 'Next.js', description: 'The React Framework for Production.', difficulty: 'Advanced', category: 'Frontend' },
  { name: 'State Management', description: 'Managing the state of a user interface (e.g., Redux, Context API).', difficulty: 'Intermediate', category: 'Frontend' },
  { name: 'Frontend Architecture', description: 'Structuring large scale frontend applications.', difficulty: 'Advanced', category: 'Frontend' },

  // Backend
  { name: 'Node.js', description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine.', difficulty: 'Intermediate', category: 'Backend' },
  { name: 'Express', description: 'Fast, unopinionated, minimalist web framework for Node.js.', difficulty: 'Intermediate', category: 'Backend' },
  { name: 'Databases', description: 'Organized collections of data.', difficulty: 'Beginner', category: 'Backend' },
  { name: 'PostgreSQL', description: 'Advanced open source relational database.', difficulty: 'Intermediate', category: 'Backend' },
  { name: 'MongoDB', description: 'Document-based, distributed database.', difficulty: 'Intermediate', category: 'Backend' },
  { name: 'Authentication', description: 'Verifying the identity of a user or process.', difficulty: 'Intermediate', category: 'Backend' },
  { name: 'Caching', description: 'Storing data temporarily for faster retrieval.', difficulty: 'Intermediate', category: 'Backend' },

  // DevOps
  { name: 'Docker', description: 'Platform for developing, shipping, and running applications in containers.', difficulty: 'Intermediate', category: 'DevOps' },
  { name: 'CI/CD', description: 'Continuous Integration and Continuous Deployment practices.', difficulty: 'Intermediate', category: 'DevOps' },
  { name: 'Kubernetes', description: 'Open-source system for automating deployment, scaling, and management of containerized applications.', difficulty: 'Advanced', category: 'DevOps' },

  // Cloud
  { name: 'Cloud Computing', description: 'Delivery of computing services over the internet.', difficulty: 'Beginner', category: 'Cloud' },
  { name: 'AWS', description: 'Amazon Web Services cloud platform.', difficulty: 'Intermediate', category: 'Cloud' },
  { name: 'EC2', description: 'Elastic Compute Cloud - resizable compute capacity.', difficulty: 'Intermediate', category: 'Cloud' },
  { name: 'S3', description: 'Simple Storage Service - object storage.', difficulty: 'Intermediate', category: 'Cloud' },
  { name: 'Load Balancing', description: 'Distributing network traffic across multiple servers.', difficulty: 'Intermediate', category: 'Cloud' },
  { name: 'Auto Scaling', description: 'Automatically adjusting compute resources based on demand.', difficulty: 'Advanced', category: 'Cloud' },
  { name: 'IAM', description: 'Identity and Access Management - securely control access to resources.', difficulty: 'Intermediate', category: 'Cloud' },

  // Architecture
  { name: 'System Design', description: 'Process of defining the architecture, components, modules, and data for a system.', difficulty: 'Advanced', category: 'Architecture' },
  { name: 'Distributed Systems', description: 'A system whose components are located on different networked computers.', difficulty: 'Advanced', category: 'Architecture' },
  { name: 'Microservices', description: 'An architectural style that structures an application as a collection of services.', difficulty: 'Advanced', category: 'Architecture' },
  { name: 'Message Queues', description: 'Asynchronous service-to-service communication used in serverless and microservices architectures.', difficulty: 'Advanced', category: 'Architecture' }
];

const requiresRelations = [
  { source: 'Git', target: 'Programming Basics' },
  { source: 'Command Line', target: 'Programming Basics' },
  { source: 'Linux', target: 'Command Line' },
  { source: 'Networking', target: 'Linux' },
  
  { source: 'HTML', target: 'Programming Basics' },
  { source: 'CSS', target: 'HTML' },
  { source: 'JavaScript', target: 'HTML' },
  { source: 'TypeScript', target: 'JavaScript' },
  
  { source: 'React', target: 'JavaScript' },
  { source: 'React', target: 'HTML' },
  { source: 'State Management', target: 'React' },
  { source: 'Next.js', target: 'React' },
  { source: 'Frontend Architecture', target: 'Next.js' },

  { source: 'HTTP', target: 'Networking' },
  { source: 'REST APIs', target: 'HTTP' },
  { source: 'Databases', target: 'Programming Basics' },
  { source: 'PostgreSQL', target: 'Databases' },
  { source: 'MongoDB', target: 'Databases' },
  
  { source: 'Node.js', target: 'JavaScript' },
  { source: 'Node.js', target: 'Command Line' },
  { source: 'Express', target: 'Node.js' },
  { source: 'Express', target: 'REST APIs' },
  { source: 'Authentication', target: 'Express' },
  { source: 'Authentication', target: 'Databases' },
  { source: 'Caching', target: 'Node.js' },

  { source: 'Docker', target: 'Linux' },
  { source: 'CI/CD', target: 'Git' },
  { source: 'Kubernetes', target: 'Docker' },
  { source: 'Kubernetes', target: 'Networking' },

  { source: 'Cloud Computing', target: 'Networking' },
  { source: 'AWS', target: 'Cloud Computing' },
  { source: 'EC2', target: 'AWS' },
  { source: 'S3', target: 'AWS' },
  { source: 'IAM', target: 'AWS' },
  { source: 'Load Balancing', target: 'EC2' },
  { source: 'Load Balancing', target: 'Networking' },
  { source: 'Auto Scaling', target: 'Load Balancing' },

  { source: 'System Design', target: 'Databases' },
  { source: 'System Design', target: 'Networking' },
  { source: 'Distributed Systems', target: 'System Design' },
  { source: 'Microservices', target: 'Docker' },
  { source: 'Microservices', target: 'Distributed Systems' },
  { source: 'Message Queues', target: 'Distributed Systems' }
];

const leadsToRelations = [
  { source: 'Programming Basics', target: 'Git' },
  { source: 'Programming Basics', target: 'Command Line' },
  { source: 'Programming Basics', target: 'JavaScript' },
  { source: 'Command Line', target: 'Linux' },
  { source: 'Linux', target: 'Networking' },
  { source: 'Linux', target: 'Docker' },
  
  { source: 'JavaScript', target: 'TypeScript' },
  { source: 'TypeScript', target: 'React' },
  { source: 'React', target: 'Next.js' },
  
  { source: 'Networking', target: 'HTTP' },
  { source: 'Networking', target: 'Cloud Computing' },
  { source: 'HTTP', target: 'REST APIs' },
  
  { source: 'JavaScript', target: 'Node.js' },
  { source: 'Node.js', target: 'Express' },
  { source: 'Databases', target: 'PostgreSQL' },
  
  { source: 'Docker', target: 'Kubernetes' },
  
  { source: 'Cloud Computing', target: 'AWS' },
  { source: 'AWS', target: 'EC2' },
  { source: 'AWS', target: 'S3' },
  { source: 'EC2', target: 'Load Balancing' },
  { source: 'Load Balancing', target: 'Auto Scaling' }
];

const courses = [
  { title: 'The Complete Developer Bootcamp', provider: 'TechPath', difficulty: 'Beginner', duration: '50 hours', topic: 'Programming Basics' },
  { title: 'Linux Fundamentals for DevOps', provider: 'TechPath', difficulty: 'Beginner', duration: '10 hours', topic: 'Linux' },
  { title: 'Networking Demystified', provider: 'TechPath', difficulty: 'Beginner', duration: '8 hours', topic: 'Networking' },
  { title: 'Modern JavaScript from the Beginning', provider: 'TechPath', difficulty: 'Beginner', duration: '20 hours', topic: 'JavaScript' },
  { title: 'React - The Complete Guide', provider: 'TechPath', difficulty: 'Intermediate', duration: '40 hours', topic: 'React' },
  { title: 'Next.js & React - The Complete Guide', provider: 'TechPath', difficulty: 'Advanced', duration: '25 hours', topic: 'Next.js' },
  { title: 'Node.js, Express, MongoDB Bootcamp', provider: 'TechPath', difficulty: 'Intermediate', duration: '40 hours', topic: 'Node.js' },
  { title: 'Docker Mastery', provider: 'TechPath', difficulty: 'Intermediate', duration: '15 hours', topic: 'Docker' },
  { title: 'Kubernetes for the Absolute Beginners', provider: 'TechPath', difficulty: 'Advanced', duration: '10 hours', topic: 'Kubernetes' },
  { title: 'AWS Certified Cloud Practitioner', provider: 'TechPath', difficulty: 'Beginner', duration: '15 hours', topic: 'AWS' },
  { title: 'System Design Interview Prep', provider: 'TechPath', difficulty: 'Advanced', duration: '20 hours', topic: 'System Design' }
];

async function seedDatabase() {
  const session = driver.session();
  try {
    console.log('Clearing database...');
    await session.run('MATCH (n) DETACH DELETE n');

    console.log('Creating topics...');
    for (const topic of topics) {
      await session.run(
        `
        CREATE (t:Topic {
          name: $name, 
          description: $description, 
          difficulty: $difficulty, 
          category: $category
        })
        `,
        topic
      );
    }

    console.log('Creating REQUIRES relationships...');
    for (const rel of requiresRelations) {
      await session.run(
        `
        MATCH (source:Topic {name: $sourceName})
        MATCH (target:Topic {name: $targetName})
        CREATE (source)-[:REQUIRES]->(target)
        `,
        { sourceName: rel.source, targetName: rel.target }
      );
    }

    console.log('Creating LEADS_TO relationships...');
    for (const rel of leadsToRelations) {
      await session.run(
        `
        MATCH (source:Topic {name: $sourceName})
        MATCH (target:Topic {name: $targetName})
        CREATE (source)-[:LEADS_TO]->(target)
        `,
        { sourceName: rel.source, targetName: rel.target }
      );
    }

    console.log('Creating courses and TAUGHT_BY relationships...');
    for (const course of courses) {
      await session.run(
        `
        MATCH (t:Topic {name: $topicName})
        CREATE (c:Course {
          title: $title,
          provider: $provider,
          difficulty: $difficulty,
          duration: $duration
        })
        CREATE (t)-[:TAUGHT_BY]->(c)
        `,
        {
          topicName: course.topic,
          title: course.title,
          provider: course.provider,
          difficulty: course.difficulty,
          duration: course.duration
        }
      );
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedDatabase();
