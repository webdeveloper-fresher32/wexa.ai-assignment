# TechPath — Developer Learning Graph

**TechPath helps developers discover what they need to learn, in what order, to reach a particular technology or career goal.**

Instead of hardcoding a sequence of courses, TechPath uses a **knowledge graph** to model the relationships between different technologies, concepts, and courses. When a user selects a goal (like "AWS" or "React"), the application dynamically traverses the graph's prerequisite paths to generate a customized learning journey.

[🎥 **Watch the Demo Recording**](YOUR_RECORDING_LINK_HERE) | [🌐 **Live Demo**](YOUR_LIVE_DEMO_LINK_HERE)

---

## 🧠 Why a Graph Database?

A relational database (SQL) is excellent for tabular data, but it struggles with deeply connected data, specifically **recursive relationships** and **multi-hop paths**.

If we modeled our learning topics in SQL, we would need a junction table (e.g., \`TopicPrerequisites\`). To find out what you need to learn before "AWS", we would query the prerequisites of AWS. But what about the prerequisites of *those* prerequisites? SQL requires either recursive CTEs (Common Table Expressions) which are complex, slow, and hard to maintain, or multiple separate queries from the application layer.

**A Graph Database (CognoDB) is the perfect fit because:**
1. **Relationships are first-class citizens**: The connection between "Linux" and "Networking" is stored physically as a pointer, not computed at query time via JOINs.
2. **Deep Traversals**: Finding a 5-hop learning path (\`AWS -> Cloud Computing -> Networking -> Linux -> Command Line\`) is a native, highly optimized operation in Cypher.
3. **Flexibility**: We can easily add new types of relationships (e.g., \`LEADS_TO\`, \`TAUGHT_BY\`) or new entities (like \`Course\` or \`Skill\`) without complex schema migrations.

---

## 🗃️ Data Model

Our graph currently consists of two node types and three relationship types:

\`\`\`mermaid
graph TD
    Topic1[(:Topic)] -- :REQUIRES --> Topic2[(:Topic)]
    Topic1 -- :LEADS_TO --> Topic3[(:Topic)]
    Topic1 -- :TAUGHT_BY --> Course1[(:Course)]
\`\`\`

- **Nodes:**
  - \`Topic\`: Represents a concept or technology (e.g., name: "Docker", difficulty: "Intermediate").
  - \`Course\`: Represents a learning resource.
- **Relationships:**
  - \`REQUIRES\`: Dependency. You should learn the target before the source.
  - \`LEADS_TO\`: Progression. Learning the source naturally leads to the target.
  - \`TAUGHT_BY\`: Educational. The topic is covered by the target course.

---

## 🔎 Main Cypher Queries

The magic of this application happens in the **multi-hop prerequisite traversal**:

\`\`\`cypher
// Generate a Learning Path
MATCH p = (goal:Topic {name: $goalTopic})<-[:REQUIRES*0..]-(prereq:Topic)
WITH prereq, length(p) AS depth
ORDER BY depth DESC
RETURN prereq { .*, distance: depth } AS node
\`\`\`
*This query starts at the goal topic and traverses the \`REQUIRES\` relationship backward as many hops as possible (\`*0..\`). It calculates the \`depth\` of each prerequisite so we can order them sequentially for the user.*

Other important queries used in the app include finding immediate relationships for the Topic Details page:
\`\`\`cypher
MATCH (t:Topic {name: $name})
OPTIONAL MATCH (t)<-[:REQUIRES]-(prereq:Topic)
OPTIONAL MATCH (t)-[:LEADS_TO]->(next:Topic)
OPTIONAL MATCH (t)-[:TAUGHT_BY]->(course:Course)
RETURN t, collect(DISTINCT prereq), collect(DISTINCT next), collect(DISTINCT course)
\`\`\`

---

## 🚀 Setup & Run Instructions

### 1. Setup CognoDB
1. Create a free account at [console.cognodb.com](https://console.cognodb.com/signup)
2. Create a free (c0) instance.
3. Save the \`bolt+s://\` URI and the generated password.

### 2. Environment Variables
Create a \`.env\` file in the root of the project:
\`\`\`env
NEO4J_URI=bolt+s://<instance-id>.databases.cognodb.cloud
NEO4J_USERNAME=cognodb
NEO4J_PASSWORD=<your-password>
PORT=5000
\`\`\`

### 3. Seed the Database
Populate your CognoDB instance with the 30+ seed topics, courses, and relationships:
\`\`\`bash
cd backend
npm install
node scripts/seed.js
\`\`\`

### 4. Run the Backend API
\`\`\`bash
cd backend
npm run dev
# Or just: node src/server.js
\`\`\`
The API will run on \`http://localhost:5000\`.

### 5. Run the Frontend App
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The React app will be available at \`http://localhost:5173\`.

---

## 🖼️ Screenshots

*(Add your screenshots here before submitting!)*
- Home Screen
- Generated Learning Path (e.g., AWS or Kubernetes)
- Topic Details

---

## 🛠️ Tech Stack
- **Database**: CognoDB (managed Neo4j instance) via \`neo4j-driver\`
- **Backend**: Node.js, Express
- **Frontend**: React, Vite, Vanilla CSS
- **Styling**: Custom CSS with Glassmorphism and Dark Mode aesthetics.
