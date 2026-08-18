const neo4j = require('neo4j-driver');
require('dotenv').config({ path: '../.env' }); // Fallback for local development

const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

if (!uri || !user || !password) {
  console.error('Error: Neo4j credentials missing. Please configure NEO4J_URI, NEO4J_USERNAME, and NEO4J_PASSWORD.');
  process.exit(1);
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// Generated from Professional SkillVault Architecture
const topics = [
  // Core Computer Science & Networking
  { name: 'Computer Fundamentals', description: 'CPU, Memory architecture, and core OS concepts.', difficulty: 'Beginner', category: 'Fundamentals' },
  { name: 'Operating Systems', description: 'Process management, concurrency, threading, and I/O.', difficulty: 'Intermediate', category: 'Fundamentals' },
  { name: 'Networking OSI Model', description: 'TCP/IP stack, DNS, HTTP/HTTPS, and routing protocols.', difficulty: 'Intermediate', category: 'Fundamentals' },
  { name: 'Shell Scripting', description: 'Bash/Zsh mastery, pipes, grep, sed, awk, and cron jobs.', difficulty: 'Intermediate', category: 'Fundamentals' },
  
  // Software Engineering Principles
  { name: 'Git & GitHub Actions', description: 'Version control branching strategies, rebasing, and CI/CD pipelines.', difficulty: 'Intermediate', category: 'Engineering' },
  { name: 'Low-Level Design (LLD)', description: 'Design patterns (SOLID, GoF) and object-oriented modeling.', difficulty: 'Advanced', category: 'Engineering' },
  { name: 'High-Level Design (HLD)', description: 'System architecture, CAP theorem, and distributed systems.', difficulty: 'Advanced', category: 'Engineering' },

  // Programming Languages
  { name: 'JavaScript Deep Dive', description: 'Event loop, closures, prototypes, and async programming.', difficulty: 'Intermediate', category: 'Language' },
  { name: 'TypeScript Mastery', description: 'Generics, utility types, structural typing, and advanced inference.', difficulty: 'Advanced', category: 'Language' },
  { name: 'Java Internals', description: 'JVM architecture, Garbage Collection, and multithreading.', difficulty: 'Advanced', category: 'Language' },

  // Frontend Ecosystem
  { name: 'React Foundations', description: 'Virtual DOM, components, props, and declarative UI.', difficulty: 'Beginner', category: 'Frontend' },
  { name: 'React Hooks & State', description: 'useState, useEffect, custom hooks, and React Context.', difficulty: 'Intermediate', category: 'Frontend' },
  { name: 'Advanced State Management', description: 'Redux Toolkit, Zustand, or Recoil for complex global state.', difficulty: 'Intermediate', category: 'Frontend' },
  { name: 'Next.js Architecture', description: 'App Router, Server Components (RSC), SSR, and SSG.', difficulty: 'Advanced', category: 'Frontend' },

  // Backend Frameworks
  { name: 'Node.js Core', description: 'Streams, buffers, worker threads, and event emitter.', difficulty: 'Intermediate', category: 'Backend' },
  { name: 'Express/NestJS', description: 'Middleware patterns, routing, dependency injection (NestJS), and controllers.', difficulty: 'Intermediate', category: 'Backend' },
  { name: 'Spring Boot', description: 'IoC container, Spring MVC, Spring Data JPA, and actuator.', difficulty: 'Advanced', category: 'Backend' },
  
  // Databases & Distributed Systems
  { name: 'Relational Databases (SQL)', description: 'ACID properties, indexing, normalization, and execution plans.', difficulty: 'Intermediate', category: 'Database' },
  { name: 'NoSQL & Graph Databases', description: 'Document stores (MongoDB) and Graph DBs (Neo4j, Cypher).', difficulty: 'Intermediate', category: 'Database' },
  { name: 'Caching & Redis', description: 'In-memory data stores, caching strategies, and eviction policies.', difficulty: 'Advanced', category: 'Database' },
  { name: 'Message Brokers', description: 'Kafka, RabbitMQ, event-driven architectures, and pub/sub.', difficulty: 'Advanced', category: 'Database' },
  { name: 'Microservices Design', description: 'Saga pattern, API gateways, circuit breakers, and service discovery.', difficulty: 'Advanced', category: 'Architecture' },

  // Cloud & DevOps (AWS)
  { name: 'AWS Cloud Fundamentals', description: 'Regions, AZs, Global Infrastructure, and shared responsibility model.', difficulty: 'Beginner', category: 'Cloud' },
  { name: 'AWS IAM & Security', description: 'Policies, roles, least privilege, and KMS encryption.', difficulty: 'Intermediate', category: 'Cloud' },
  { name: 'AWS VPC & Networking', description: 'Subnets, NAT Gateways, Internet Gateways, and Route53.', difficulty: 'Advanced', category: 'Cloud' },
  { name: 'AWS Compute & Scaling', description: 'EC2, Auto Scaling Groups (ASG), and Application Load Balancers (ALB).', difficulty: 'Intermediate', category: 'Cloud' },
  { name: 'AWS Serverless', description: 'AWS Lambda, API Gateway, DynamoDB, and Step Functions.', difficulty: 'Advanced', category: 'Cloud' },
  
  // Containers & Orchestration
  { name: 'Docker Fundamentals', description: 'Images, containers, Dockerfiles, and layered file systems.', difficulty: 'Beginner', category: 'DevOps' },
  { name: 'Docker Networking & Volumes', description: 'Bridge networks, overlay networks, and persistent storage.', difficulty: 'Intermediate', category: 'DevOps' },
  { name: 'Kubernetes (K8s) Core', description: 'Pods, Deployments, Services, and ReplicaSets.', difficulty: 'Advanced', category: 'DevOps' },
  { name: 'Kubernetes Advanced', description: 'Ingress controllers, StatefulSets, ConfigMaps, and Helm charts.', difficulty: 'Expert', category: 'DevOps' },
  { name: 'Terraform (IaC)', description: 'Infrastructure as Code, providers, state management, and modules.', difficulty: 'Advanced', category: 'DevOps' },

  // AI & Modern Concepts
  { name: 'Retrieval-Augmented Generation (RAG)', description: 'Vector databases, embeddings, LLM orchestration, and prompt engineering.', difficulty: 'Expert', category: 'AI' }
];

const requiresRelations = [
  // Fundamentals
  { source: 'Computer Fundamentals', target: 'Operating Systems' },
  { source: 'Operating Systems', target: 'Shell Scripting' },
  { source: 'Networking OSI Model', target: 'Computer Fundamentals' },

  // Engineering & Design
  { source: 'Git & GitHub Actions', target: 'Shell Scripting' },
  { source: 'Low-Level Design (LLD)', target: 'Java Internals' },
  { source: 'Low-Level Design (LLD)', target: 'TypeScript Mastery' },
  { source: 'High-Level Design (HLD)', target: 'Low-Level Design (LLD)' },
  { source: 'High-Level Design (HLD)', target: 'Networking OSI Model' },

  // Frontend Track
  { source: 'JavaScript Deep Dive', target: 'Computer Fundamentals' },
  { source: 'TypeScript Mastery', target: 'JavaScript Deep Dive' },
  { source: 'React Foundations', target: 'JavaScript Deep Dive' },
  { source: 'React Hooks & State', target: 'React Foundations' },
  { source: 'Advanced State Management', target: 'React Hooks & State' },
  { source: 'Next.js Architecture', target: 'React Hooks & State' },
  { source: 'Next.js Architecture', target: 'TypeScript Mastery' },

  // Backend Track
  { source: 'Node.js Core', target: 'JavaScript Deep Dive' },
  { source: 'Node.js Core', target: 'Operating Systems' },
  { source: 'Express/NestJS', target: 'Node.js Core' },
  { source: 'Express/NestJS', target: 'TypeScript Mastery' },
  { source: 'Spring Boot', target: 'Java Internals' },

  // Databases & Distributed Systems
  { source: 'Relational Databases (SQL)', target: 'Computer Fundamentals' },
  { source: 'NoSQL & Graph Databases', target: 'Relational Databases (SQL)' },
  { source: 'Caching & Redis', target: 'Relational Databases (SQL)' },
  { source: 'Message Brokers', target: 'High-Level Design (HLD)' },
  { source: 'Microservices Design', target: 'High-Level Design (HLD)' },
  { source: 'Microservices Design', target: 'Message Brokers' },
  { source: 'Microservices Design', target: 'Caching & Redis' },

  // Cloud & DevOps Track
  { source: 'AWS Cloud Fundamentals', target: 'Networking OSI Model' },
  { source: 'AWS IAM & Security', target: 'AWS Cloud Fundamentals' },
  { source: 'AWS Compute & Scaling', target: 'AWS IAM & Security' },
  { source: 'AWS VPC & Networking', target: 'AWS Compute & Scaling' },
  { source: 'AWS Serverless', target: 'AWS IAM & Security' },
  { source: 'AWS Serverless', target: 'Node.js Core' },

  // Containers
  { source: 'Docker Fundamentals', target: 'Operating Systems' },
  { source: 'Docker Networking & Volumes', target: 'Docker Fundamentals' },
  { source: 'Docker Networking & Volumes', target: 'Networking OSI Model' },
  { source: 'Kubernetes (K8s) Core', target: 'Docker Networking & Volumes' },
  { source: 'Kubernetes Advanced', target: 'Kubernetes (K8s) Core' },
  { source: 'Kubernetes Advanced', target: 'AWS VPC & Networking' }, // Assuming EKS
  { source: 'Terraform (IaC)', target: 'AWS Cloud Fundamentals' },
  { source: 'Terraform (IaC)', target: 'Docker Fundamentals' },

  // RAG / AI
  { source: 'Retrieval-Augmented Generation (RAG)', target: 'NoSQL & Graph Databases' },
  { source: 'Retrieval-Augmented Generation (RAG)', target: 'Node.js Core' }
];

const courses = [
  { title: 'The OS and CPU Internal Masterclass', provider: 'SkillVault Learning', difficulty: 'Intermediate', duration: '20 hours', topic: 'Operating Systems' },
  { title: 'Bash Scripting for DevOps Engineers', provider: 'SkillVault Learning', difficulty: 'Beginner', duration: '12 hours', topic: 'Shell Scripting' },
  { title: 'Advanced React Patterns & RSC', provider: 'SkillVault Learning', difficulty: 'Advanced', duration: '35 hours', topic: 'Next.js Architecture' },
  { title: 'Node.js Under The Hood', provider: 'SkillVault Learning', difficulty: 'Advanced', duration: '18 hours', topic: 'Node.js Core' },
  { title: 'Designing Distributed Systems', provider: 'SkillVault Learning', difficulty: 'Expert', duration: '40 hours', topic: 'High-Level Design (HLD)' },
  { title: 'Microservices with Spring Boot & Kafka', provider: 'SkillVault Learning', difficulty: 'Expert', duration: '45 hours', topic: 'Microservices Design' },
  { title: 'AWS Solutions Architect Deep Dive', provider: 'SkillVault Learning', difficulty: 'Advanced', duration: '60 hours', topic: 'AWS VPC & Networking' },
  { title: 'Kubernetes CKA Certification Prep', provider: 'SkillVault Learning', difficulty: 'Expert', duration: '50 hours', topic: 'Kubernetes Advanced' },
  { title: 'Enterprise Terraform & IaC', provider: 'SkillVault Learning', difficulty: 'Advanced', duration: '25 hours', topic: 'Terraform (IaC)' },
  { title: 'Building RAG Pipelines with Vector DBs', provider: 'SkillVault Learning', difficulty: 'Advanced', duration: '15 hours', topic: 'Retrieval-Augmented Generation (RAG)' }
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

    console.log('Creating courses and TEACHES relationships...');
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
        CREATE (c)-[:TEACHES]->(t)
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
