# TechPath — Developer Learning Graph

TechPath is an application that generates dynamic learning paths for software developers. You select a goal (e.g., "AWS", "CI/CD"), and the application calculates the complete sequence of prerequisite topics you need to learn to reach that goal.

### Senior Engineering Enhancements
- **D3.js Force Simulation**: A dynamic, physics-based interactive graph visualization of learning paths.
- **Persistent Progress Tracking**: User progress is saved in real-time to the Neo4j Graph Database using `(User)-[:COMPLETED]->(Topic)` relationships, supporting bidirectional toggling.
- **Graph Cycle Detection**: Multi-hop Cypher queries intercept and reject any attempts to create cyclical prerequisite loops.
- **Intelligent Caching**: Frequently requested learning paths can be served from memory without repeating the graph traversal, with targeted cache invalidation upon progress updates.
- **Defensive Programming**: Complete request validation using `Zod` and robust error handling standardization.
- **Observability**: Request tracing via short-UUIDs injected into every backend transaction.
- **Smart Autocomplete**: Real-time topic search suggestions powered by client-side filtering.
- **Integration Testing**: Extensive `Jest` and `Supertest` coverage for Graph Algorithms and Validation constraints.
- **Developer-First UI**: A clean, intentional interface prioritizing information density, graph context, and clear loading/error states.

**Live Demo**: [https://wexa-ai-assignment-drab.vercel.app](https://wexa-ai-assignment-drab.vercel.app)

*(Please add your screen recording link here)*

## Why a graph database?

Learning paths are fundamentally graphs: skills have prerequisites (`REQUIRES`) that can span multiple levels deep. 

In a relational database, finding all prerequisites for a topic like "Docker" would require complex recursive Common Table Expressions (CTEs) or multiple consecutive queries, which scale poorly and are difficult to maintain. 

A graph database genuinely earns its place here because relationship traversal is a first-class citizen. Finding a learning path is as simple as asking the database to traverse the `[:REQUIRES*]` relationship of arbitrary depth. This natively models how human knowledge builds upon itself.

## Data Model

```mermaid
graph TD
    Topic((Topic))
    Course((Course))
    
    Topic -- REQUIRES --> Topic
    Course -- TEACHES --> Topic
```

- **Topic**: Represents a subject to learn (e.g., "JavaScript", "AWS"). Has properties: `name`, `category`, `difficulty`, `description`.
- **Course**: Represents a learning resource. Has properties: `title`, `provider`, `url`.

## Main Queries

### Generating the Learning Path (Multi-hop Traversal)
This is the core query of the application. It finds the goal topic, and then traverses backwards through all `REQUIRES` relationships at *any* depth (`*0..`). We order by the depth of the dependency tree so that the furthest foundational prerequisites are learned first.

Neo4j supports variable-length traversal natively, making arbitrary-depth prerequisite traversal much more natural than implementing recursive relationship traversal in application code.

```cypher
MATCH p = (goal:Topic {name: $goalTopic})-[:REQUIRES*0..]->(prereq:Topic)
WITH prereq, length(p) AS depth
ORDER BY depth DESC
RETURN prereq { .*, distance: depth } AS node
```

### Fetching Topic Details & Recommended Courses
This query fetches a specific topic and finds all associated courses using the `TEACHES` relationship.

```cypher
MATCH (c:Course)-[:TEACHES]->(t:Topic {name: $topicName})
RETURN c
```

## Engineering Decisions

### Why Neo4j?
The primary operation in TechPath is not retrieving entities, but traversing relationships between them. A graph database turns multi-hop recursive prerequisite queries from a complex SQL CTE into a simple, native cypher pattern match.

### Why a modular monolith?
The application is currently small enough that introducing microservices would add operational complexity without providing a meaningful benefit. The Express backend uses strict separation of concerns (Routes -> Services) to keep business logic isolated.

### Why caching?
Learning paths are read-heavy and change relatively infrequently, so caching reduces repeated traversal of the same dependency graph for concurrent users.

### Why anonymous users?
The assignment does not require authentication. A client-generated identifier stored in `localStorage` provides persistent progress modeling in the graph without introducing an unnecessary authentication subsystem.

## Setup and Run Instructions

### 1. Database Setup
1. Go to [console.cognodb.com](https://console.cognodb.com/signup) and create a free account.
2. Create a free (c0) instance in your preferred region.
3. Save the connection URI (e.g., `bolt+ssc://<instance-id>.databases.cognodb.com`) and the generated password.

### 2. Local Environment
1. Clone the repository and run `npm install` in the root directory.
2. Create a `.env` file in the root directory based on `.env copy.example`:
```env
NEO4J_URI=bolt+ssc://<your-instance>.databases.cognodb.com
NEO4J_USERNAME=cognodb
NEO4J_PASSWORD=<your-password>
PORT=5001
```

### 3. Seed the Database
Run the seed script to populate the database with topics, courses, and relationships:
```bash
node backend/scripts/seed.js
```

### 4. Run the Application
Run the frontend and backend concurrently:
```bash
npm run dev:all
```
The React frontend will be available at `http://localhost:5173`.

## Screenshots
![Home Page](docs/home.png)
![Learning Path Generation](docs/path.png)
![Topic Details](docs/topic.png)
