# System Design: TechPath

This document outlines the architectural decisions, data modeling, and engineering patterns used to build the TechPath application for the Wexa AI Take-Home Assignment.

## 1. High-Level Architecture

The system is designed as a modern, decoupled web application deployed on a Serverless infrastructure. 

*   **Frontend**: React (bootstrapped with Vite)
*   **Backend**: Node.js with Express
*   **Database**: CognoDB (Managed Neo4j Graph Database)
*   **Hosting/Deployment**: Vercel (Static hosting for frontend, Serverless Functions for backend)

## 2. Graph Data Modeling

A graph database was chosen because learning paths are fundamentally directed acyclic graphs (DAGs). We modeled the data to allow for deep, recursive traversal.

### Nodes
1.  `Topic`: Represents a subject (e.g., "AWS", "Linux").
    *   **Properties**: `name` (unique identifier), `category`, `difficulty`, `description`.
2.  `Course`: Represents a learning resource.
    *   **Properties**: `title`, `provider`, `url`, `durationHours`.

### Relationships
1.  `(:Topic)-[:REQUIRES]->(:Topic)`: Represents a prerequisite dependency.
    *   *Design decision*: We intentionally point the relationship *backwards* (from Advanced to Foundational) so that calculating a path to a goal involves querying outgoing relationships.
2.  `(:Course)-[:TEACHES]->(:Topic)`: Maps a resource to the topic it covers.

### Multi-Hop Traversal (The Core Query)
The most computationally expensive query in a traditional relational database would be finding *all* prerequisites across an unknown number of levels. In our Neo4j setup, we achieve this natively using variable-length path traversal:
```cypher
MATCH p = (goal:Topic {name: $goalTopic})-[:REQUIRES*0..]->(prereq:Topic)
```
This efficiently traverses 0 to infinity hops to retrieve the entire dependency tree in milliseconds.

## 3. Engineering & Project Structure

To optimize for Vercel's zero-config deployment architecture, the codebase uses a flattened monorepo structure:

```
.
├── api/                # Vercel Native Serverless Entrypoints
│   └── index.js        # Wraps the Express app for Serverless invocation
├── backend/            # Express Application Code
│   ├── src/
│   │   ├── config/     # Database connection singleton
│   │   ├── routes/     # Express routers
│   │   └── services/   # Business logic and Neo4j queries
│   └── scripts/        # Database seeding utilities
├── src/                # Vite/React Frontend Code
│   ├── api.js          # Axios API client
│   ├── pages/          # React route components
│   └── main.jsx        # React entrypoint
├── package.json        # Unified dependencies (Frontend + Backend)
└── vercel.json         # Vercel Routing Configuration
```

### Backend Layering (Separation of Concerns)
The backend enforces a strict boundary between HTTP routing and Database logic:
1.  **Routes (`/routes`)**: Extract parameters from `req`, handle HTTP status codes, and call services.
2.  **Services (`/services`)**: Contain all Cypher queries and database interactions. They return formatted JSON objects to the routes. No HTTP context (`req`/`res`) is allowed in the services layer.
3.  **Database Configuration (`/config`)**: Implements a Singleton pattern for the `neo4j-driver`. The driver is instantiated once at startup and reused across all incoming requests to minimize connection overhead.

### Vercel Deployment & Routing
The application is deployed to Vercel using a unified approach:
*   The Vite frontend is built statically and served from Vercel's Edge Network.
*   The Express backend is wrapped in `api/index.js` and deployed as a **Vercel Serverless Function**.
*   A custom `vercel.json` rewrite intercepts all traffic to `/api/*` and routes it to the Serverless Function, while falling back to `index.html` for React Router's client-side routing.

## 4. Error Handling and Resilience

*   **Database Unreachable**: If the `neo4j-driver` fails to connect (e.g., missing environment variables), the backend immediately logs a descriptive error and prevents the server from starting in a broken state.
*   **API Failures**: Express uses a global error-handling middleware (`app.use((err, req, res, next) => {...})`) to catch unhandled promise rejections and return a clean `500 Internal Server Error` instead of crashing the Node process or leaking stack traces to the client.
*   **Environment Variables**: Secrets (`NEO4J_URI`, `NEO4J_PASSWORD`) are injected securely via Vercel's dashboard and are strictly ignored by `.gitignore`.

## 5. Senior Engineering Enhancements
To demonstrate production-readiness, several defensive programming and optimization patterns were implemented:

1. **Cycle Detection in Graphs**:
   - Before inserting a new prerequisite (`[:REQUIRES]` relationship), the backend executes a multi-hop validation query: `MATCH p = (target)-[:REQUIRES*]->(source)`. If a path is found, it throws a `400 CYCLIC_DEPENDENCY` error, ensuring the graph never enters an infinite loop state.

2. **In-Memory Caching (Node-Cache)**:
   - Deep graph traversals are computationally expensive. We implemented `node-cache` middleware with a 300-second TTL on the `/api/learning-path/:goal` endpoint. This guarantees O(1) read performance for concurrent users querying popular paths.

3. **Strict Validation (Zod)**:
   - Replaced weak `req.body` checks with a unified `Zod` validation middleware. This ensures data sanitization at the router edge, automatically throwing formatted `400 VALIDATION_ERROR` responses before hitting the database services.

4. **Observability (UUID Tracing)**:
   - A `requestLogger` middleware assigns a `crypto.randomUUID()` to every incoming request. All console logs within the request lifecycle are prefixed with `[req_uuid]`, allowing for easy distributed tracing in Vercel's server logs.

5. **D3.js Force Simulation**:
   - The UI moved from static lists to an interactive Force-Directed Graph using `d3.js`. The backend parses the raw Neo4j output and reformats it into `nodes` and `links`, which the frontend simulation uses to compute physical forces (Charge, Center, Link Distance) in real-time.

6. **Persistent Progress State**:
   - We leveraged the Graph Database to store state. A user's device generates an anonymous `uuid` stored in `localStorage`. Checking a topic creates a physical `(User {id})-[:COMPLETED]->(Topic)` edge in Neo4j. The learning path query dynamically deduplicates the graph and merges the completion state in a single transaction.

7. **Premium UI/UX Architecture**:
   - The frontend styling architecture was overhauled to use a modern **Glassmorphism** design language. We completely avoided generic CSS frameworks in favor of a bespoke, deeply customized dark-mode aesthetic. 
   - We incorporated subtle micro-animations, glowing state transitions, and an algorithmic "Skills you'll learn" extraction widget directly within the learning path nodes, mirroring industry-leading educational platforms like Udacity.
