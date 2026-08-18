// Query 1: Find a specific topic
MATCH (t:Topic {name: $name})
RETURN t

// Query 2: Find immediate prerequisites for a topic
MATCH (t:Topic {name: $name})-[:REQUIRES]->(prerequisite:Topic)
RETURN prerequisite

// Query 3: Multi-hop prerequisites (finding the full learning path)
// This query traverses all REQUIRES relationships, starting from the goal topic.
// It returns the path from the prerequisite to the goal.
MATCH path = (goal:Topic {name: $name})-[:REQUIRES*]->(prerequisite:Topic)
RETURN path

// Alternative Query 3: Get an ordered list of prerequisites based on path length
// This is useful for displaying a step-by-step path.
MATCH p = (goal:Topic {name: $name})-[:REQUIRES*]->(prereq:Topic)
WITH prereq, length(p) AS depth
ORDER BY depth DESC
RETURN prereq.name AS TopicName, prereq.category AS Category, depth AS Distance

// Query 4: Find what a topic leads to
MATCH (t:Topic {name: $name})-[:LEADS_TO]->(next:Topic)
RETURN next

// Query 5: Find courses for a topic
MATCH (t:Topic {name: $name})-[:TAUGHT_BY]->(c:Course)
RETURN c

// Query 6: Find full topic details (Prerequisites, Leads To, Courses)
MATCH (t:Topic {name: $name})
OPTIONAL MATCH (t)-[:REQUIRES]->(prereq:Topic)
OPTIONAL MATCH (t)-[:LEADS_TO]->(next:Topic)
OPTIONAL MATCH (t)-[:TAUGHT_BY]->(course:Course)
RETURN t AS Topic, collect(DISTINCT prereq) AS Prerequisites, collect(DISTINCT next) AS LeadsTo, collect(DISTINCT course) AS Courses
