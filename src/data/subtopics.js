// Subtopics curriculum derived from SkillVault study materials
export const SUBTOPICS = {
  'Docker Fundamentals': {
    overview: 'Master containerisation from the ground up. Docker revolutionises how we ship software by packaging applications and their dependencies into portable, isolated units called containers.',
    estimatedTime: '8–10 weeks',
    subtopics: [
      {
        title: 'Fundamentals',
        duration: '3 days',
        difficulty: 'Beginner',
        description: 'Understand what Docker is, how it differs from Virtual Machines, and why it solves the "it works on my machine" problem.',
        points: ['Containers vs Virtual Machines', 'Docker architecture (Daemon, CLI, Registry)', 'Installation and first container with `docker run hello-world`']
      },
      {
        title: 'Images & Dockerfiles',
        duration: '3 days',
        difficulty: 'Beginner',
        description: 'Learn how Docker images are built in layers. Write a Dockerfile to package your own application.',
        points: ['Dockerfile syntax (FROM, RUN, COPY, CMD)', 'Layer caching and build optimisation', 'Base image selection strategy']
      },
      {
        title: 'Container Management',
        duration: '2 days',
        difficulty: 'Beginner',
        description: 'Control container lifecycles: starting, stopping, inspecting, and cleaning up containers efficiently.',
        points: ['Container lifecycle commands (run, stop, rm, exec)', 'Inspecting logs and container state', 'Resource management and cleanup']
      },
      {
        title: 'Networking',
        duration: '3 days',
        difficulty: 'Intermediate',
        description: 'Connect containers to each other and the outside world using Docker networks.',
        points: ['Bridge, host, and overlay network types', 'Port mapping with `-p` flag', 'Container-to-container DNS resolution']
      },
      {
        title: 'Volumes & Storage',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Persist data beyond a container\'s lifecycle using volumes and bind mounts.',
        points: ['Named volumes vs bind mounts', 'Volume management commands', 'tmpfs for sensitive temporary data']
      },
      {
        title: 'Docker Compose',
        duration: '4 days',
        difficulty: 'Intermediate',
        description: 'Orchestrate multi-container applications with a single declarative YAML file.',
        points: ['`docker-compose.yml` structure', 'Defining services, networks, and volumes', 'Running dev environments with `docker compose up`']
      },
      {
        title: 'Advanced Images & Security',
        duration: '3 days',
        difficulty: 'Advanced',
        description: 'Reduce image sizes dramatically with multi-stage builds and follow security best practices.',
        points: ['Multi-stage builds for production images', 'Least-privilege and non-root users', 'Image scanning with `docker scout`']
      }
    ]
  },
  'Docker Networking & Volumes': {
    overview: 'Deep-dive into Docker\'s networking model and persistent storage, the two pillars of production-ready container deployments.',
    estimatedTime: '1–2 weeks',
    subtopics: [
      {
        title: 'Network Drivers',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Understand the different Docker network drivers and when to use each one.',
        points: ['Bridge (default), Host, None, Overlay drivers', 'Creating custom bridge networks', 'Network inspection and debugging']
      },
      {
        title: 'Container DNS & Service Discovery',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Learn how Docker\'s embedded DNS lets containers find each other by name.',
        points: ['Automatic DNS resolution in user-defined networks', 'Container aliases and hostname resolution', 'External DNS configuration']
      },
      {
        title: 'Volume Types & Storage Backends',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Compare and contrast the three data persistence mechanisms in Docker.',
        points: ['Named volumes (managed by Docker)', 'Bind mounts (host filesystem path)', 'tmpfs mounts (in-memory, ephemeral)']
      },
      {
        title: 'Production Storage Patterns',
        duration: '3 days',
        difficulty: 'Advanced',
        description: 'Use volume plugins and external storage drivers to handle data in clustered environments.',
        points: ['Storage driver selection (overlay2, devicemapper)', 'Volume plugins for cloud storage', 'Database data persistence patterns']
      }
    ]
  },
  'Kubernetes (K8s) Core': {
    overview: 'Kubernetes is the industry-standard container orchestration platform. Learn to deploy, scale, and manage containerised applications in production clusters.',
    estimatedTime: '10–12 weeks',
    subtopics: [
      {
        title: 'Fundamentals',
        duration: '3 days',
        difficulty: 'Beginner',
        description: 'Understand what problems Kubernetes solves and how it compares to Docker Swarm.',
        points: ['Kubernetes vs Docker Swarm', 'Installation (minikube, kind, or cloud)', 'First deployment with `kubectl run`']
      },
      {
        title: 'Architecture',
        duration: '3 days',
        difficulty: 'Beginner',
        description: 'Understand the control plane, worker nodes, and how they interact.',
        points: ['API Server, etcd, Controller Manager, Scheduler', 'Worker nodes: kubelet, kube-proxy, container runtime', 'kubectl CLI fundamentals']
      },
      {
        title: 'Pods',
        duration: '3 days',
        difficulty: 'Beginner',
        description: 'The atomic unit in Kubernetes. Learn how Pods wrap containers and share resources.',
        points: ['Pod lifecycle and spec', 'Multi-container pods (sidecars, init containers)', 'Pod health checks (liveness, readiness)']
      },
      {
        title: 'Workloads',
        duration: '4 days',
        difficulty: 'Intermediate',
        description: 'Deploy and manage stateless and stateful applications using higher-level abstractions.',
        points: ['Deployments and rolling updates', 'ReplicaSets for availability', 'StatefulSets for databases, DaemonSets for agents']
      },
      {
        title: 'Services & Networking',
        duration: '4 days',
        difficulty: 'Intermediate',
        description: 'Expose applications to other services or the outside world with Services and DNS.',
        points: ['ClusterIP, NodePort, LoadBalancer service types', 'Kubernetes DNS and service discovery', 'NetworkPolicy for traffic control']
      },
      {
        title: 'ConfigMaps & Secrets',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Decouple configuration from container images for clean, portable deployments.',
        points: ['ConfigMap creation and consumption', 'Secrets for sensitive data', 'Environment variables vs volume mounts']
      },
      {
        title: 'RBAC & Security',
        duration: '3 days',
        difficulty: 'Advanced',
        description: 'Secure your cluster with fine-grained access control and Pod security policies.',
        points: ['Roles, ClusterRoles, RoleBindings', 'ServiceAccounts and API access', 'Pod Security Standards']
      }
    ]
  },
  'Kubernetes Advanced': {
    overview: 'Take Kubernetes to production. Master Helm, Ingress, monitoring, autoscaling, and CI/CD pipelines on Kubernetes.',
    estimatedTime: '4–6 weeks',
    subtopics: [
      {
        title: 'Ingress Controllers',
        duration: '3 days',
        difficulty: 'Advanced',
        description: 'Route external HTTP/HTTPS traffic to internal services with path and host-based rules.',
        points: ['Ingress resource spec and rules', 'Nginx Ingress Controller setup', 'TLS termination and cert-manager']
      },
      {
        title: 'Helm Charts',
        duration: '4 days',
        difficulty: 'Advanced',
        description: 'Package, version, and deploy Kubernetes applications like a package manager.',
        points: ['Helm chart structure (templates, values, Chart.yaml)', 'Templating with Go templates', 'Helm repos and publishing']
      },
      {
        title: 'Horizontal Pod Autoscaler',
        duration: '2 days',
        difficulty: 'Advanced',
        description: 'Automatically scale workloads based on CPU, memory, or custom metrics.',
        points: ['HPA configuration and metrics server', 'Custom metrics with Prometheus adapter', 'VPA and KEDA for advanced scaling']
      },
      {
        title: 'Monitoring & Logging',
        duration: '3 days',
        difficulty: 'Advanced',
        description: 'Observe your cluster with Prometheus, Grafana dashboards, and centralised logging.',
        points: ['Prometheus scraping and PromQL basics', 'Grafana dashboards for cluster health', 'EFK/ELK stack for log aggregation']
      }
    ]
  },
  'AWS Cloud Fundamentals': {
    overview: 'Get started with Amazon Web Services, the world\'s largest cloud provider. Understand the core services, pricing model, and shared responsibility model.',
    estimatedTime: '2–3 weeks',
    subtopics: [
      {
        title: 'Cloud Concepts',
        duration: '2 days',
        difficulty: 'Beginner',
        description: 'Understand IaaS, PaaS, SaaS and why organisations move to the cloud.',
        points: ['On-prem vs cloud economics', 'AWS Global Infrastructure (Regions, AZs, Edge Locations)', 'Shared responsibility model']
      },
      {
        title: 'Core Services Overview',
        duration: '3 days',
        difficulty: 'Beginner',
        description: 'Survey the most commonly used AWS services across compute, storage, and networking.',
        points: ['EC2 (virtual machines), S3 (object storage), RDS (databases)', 'VPC, IAM, CloudWatch', 'Cost Explorer and Free Tier usage']
      },
      {
        title: 'AWS Management Console & CLI',
        duration: '2 days',
        difficulty: 'Beginner',
        description: 'Navigate the console and automate AWS operations from your terminal.',
        points: ['AWS Console navigation', 'Installing and configuring AWS CLI', 'IAM users, access keys, and credential profiles']
      }
    ]
  },
  'AWS IAM & Security': {
    overview: 'Identity and Access Management is the security backbone of AWS. Mastering IAM is essential for every cloud role.',
    estimatedTime: '1–2 weeks',
    subtopics: [
      {
        title: 'IAM Fundamentals',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Understand the IAM data model: users, groups, roles, and policies.',
        points: ['IAM Users vs Groups vs Roles', 'Policy documents: Effect, Action, Resource', 'Principle of Least Privilege']
      },
      {
        title: 'Roles & Trust Policies',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Allow AWS services and cross-account identities to assume roles securely.',
        points: ['Role assumption with STS', 'Instance profiles for EC2', 'Cross-account access patterns']
      },
      {
        title: 'Security Best Practices',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Harden your AWS account using well-known security guardrails.',
        points: ['MFA for root and IAM users', 'AWS Organizations and Service Control Policies', 'CloudTrail auditing and GuardDuty detection']
      }
    ]
  },
  'Node.js Core': {
    overview: 'Node.js brings JavaScript to the server. Understand its event-driven, non-blocking I/O model that makes it ideal for building scalable network applications.',
    estimatedTime: '3–4 weeks',
    subtopics: [
      {
        title: 'Event Loop & Runtime',
        duration: '3 days',
        difficulty: 'Intermediate',
        description: 'Understand how Node.js processes asynchronous operations without blocking the main thread.',
        points: ['Call stack, event queue, microtask queue', 'libuv and the event loop phases', 'setTimeout vs setImmediate vs process.nextTick']
      },
      {
        title: 'Streams & Buffers',
        duration: '3 days',
        difficulty: 'Intermediate',
        description: 'Process large data efficiently without loading it entirely into memory.',
        points: ['Readable, Writable, Duplex, Transform streams', 'Piping streams together', 'Buffer API for binary data']
      },
      {
        title: 'Worker Threads & Child Processes',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Offload CPU-intensive work off the main thread to avoid blocking the event loop.',
        points: ['Worker Threads for CPU-bound tasks', 'child_process.fork() and spawn()', 'SharedArrayBuffer for shared memory']
      },
      {
        title: 'Modules & Package Management',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Understand CommonJS and ESM module systems and manage dependencies professionally.',
        points: ['require() vs import/export', 'npm, yarn, pnpm package managers', 'Monorepo tooling with workspaces']
      }
    ]
  },
  'React Foundations': {
    overview: 'React is a declarative UI library for building component-based interfaces. It\'s the most widely adopted frontend library in the industry.',
    estimatedTime: '2–3 weeks',
    subtopics: [
      {
        title: 'JSX & Components',
        duration: '2 days',
        difficulty: 'Beginner',
        description: 'Learn how React\'s JSX syntax describes the UI and how components compose into pages.',
        points: ['JSX transpilation and expressions', 'Function components and props', 'Component composition and children']
      },
      {
        title: 'Virtual DOM & Reconciliation',
        duration: '2 days',
        difficulty: 'Beginner',
        description: 'Understand the mechanism behind React\'s efficient rendering.',
        points: ['Virtual DOM and diffing algorithm', 'When and why re-renders happen', 'Keys for list rendering']
      },
      {
        title: 'Declarative UI Patterns',
        duration: '3 days',
        difficulty: 'Beginner',
        description: 'Embrace React\'s declarative paradigm: describe *what* the UI should look like, not *how* to update it.',
        points: ['Conditional rendering patterns', 'Controlled components and two-way binding', 'Lifting state up']
      }
    ]
  },
  'React Hooks & State': {
    overview: 'Hooks are the modern React primitives for managing state and side effects in function components without needing classes.',
    estimatedTime: '2–3 weeks',
    subtopics: [
      {
        title: 'useState & useReducer',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Manage local component state, from simple values to complex state machines.',
        points: ['useState for simple state', 'useReducer for complex state transitions', 'State batching in React 18+']
      },
      {
        title: 'useEffect & Lifecycle',
        duration: '3 days',
        difficulty: 'Intermediate',
        description: 'Synchronise your component with external systems like APIs, timers, and subscriptions.',
        points: ['Dependency array patterns', 'Cleanup functions and memory leak prevention', 'Fetching data with useEffect']
      },
      {
        title: 'Custom Hooks',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Extract reusable stateful logic into custom hooks to keep components clean.',
        points: ['Hook composition patterns', 'useFetch, useLocalStorage, useDebounce patterns', 'Rules of Hooks']
      },
      {
        title: 'Context & Performance',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Share state across the component tree without prop drilling, and optimise renders.',
        points: ['React Context with createContext/useContext', 'useMemo and useCallback for memoisation', 'React.memo for component caching']
      }
    ]
  },
  'High-Level Design (HLD)': {
    overview: 'High-Level Design is about architecting distributed systems at scale. Learn the patterns and trade-offs used by engineers at FAANG and beyond.',
    estimatedTime: '6–8 weeks',
    subtopics: [
      {
        title: 'CAP Theorem & Distributed Fundamentals',
        duration: '3 days',
        difficulty: 'Advanced',
        description: 'Understand the foundational constraints of distributed systems.',
        points: ['CAP Theorem (Consistency, Availability, Partition Tolerance)', 'Strong vs eventual consistency', 'ACID vs BASE trade-offs']
      },
      {
        title: 'Scalability Patterns',
        duration: '4 days',
        difficulty: 'Advanced',
        description: 'Scale systems horizontally and vertically to handle millions of requests.',
        points: ['Horizontal scaling and load balancing algorithms', 'Database sharding and partitioning', 'Read replicas and CQRS']
      },
      {
        title: 'Caching Strategies',
        duration: '3 days',
        difficulty: 'Advanced',
        description: 'Dramatically reduce latency and database load with intelligent caching layers.',
        points: ['Cache-aside, write-through, write-behind patterns', 'CDN caching for static assets', 'Eviction policies (LRU, LFU, TTL)']
      },
      {
        title: 'System Design Interviews',
        duration: '4 days',
        difficulty: 'Advanced',
        description: 'Practise designing systems like URL shorteners, messaging apps, and video streaming platforms.',
        points: ['Estimating throughput and storage requirements', 'Designing Twitter, YouTube, Uber', 'Trade-off analysis and communication']
      }
    ]
  },
  'Git & GitHub Actions': {
    overview: 'Git is the foundation of modern software development. GitHub Actions extends it with powerful CI/CD automation directly in your repository.',
    estimatedTime: '2–3 weeks',
    subtopics: [
      {
        title: 'Git Core Concepts',
        duration: '3 days',
        difficulty: 'Intermediate',
        description: 'Master branching, merging, and the internal data model that makes Git so powerful.',
        points: ['Commits, trees, blobs, and refs (how Git works internally)', 'Branching strategies (Gitflow, trunk-based)', 'rebase vs merge trade-offs']
      },
      {
        title: 'Collaborative Workflows',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Work effectively in teams using pull requests, code review, and protected branches.',
        points: ['Pull Request workflows and code review', 'Branch protection rules', 'Resolving conflicts and cherry-picking']
      },
      {
        title: 'GitHub Actions CI/CD',
        duration: '4 days',
        difficulty: 'Intermediate',
        description: 'Automate build, test, and deploy pipelines directly from your GitHub repository.',
        points: ['Workflow YAML syntax: triggers, jobs, steps', 'Building and pushing Docker images on push', 'Secrets management in GitHub Actions']
      }
    ]
  },
  'JavaScript Deep Dive': {
    overview: 'Go beyond basic JavaScript. Understand the runtime, asynchronous model, and functional programming patterns that distinguish senior engineers.',
    estimatedTime: '3–4 weeks',
    subtopics: [
      {
        title: 'Event Loop & Async Model',
        duration: '3 days',
        difficulty: 'Intermediate',
        description: 'Understand exactly how JavaScript handles concurrency despite being single-threaded.',
        points: ['Call stack, Web APIs, task queue, microtask queue', 'Promise execution order', 'async/await under the hood']
      },
      {
        title: 'Closures & Scope',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Master lexical scoping and closures, the foundation of advanced JavaScript patterns.',
        points: ['Closure mechanics and use-cases', 'var vs let vs const scoping', 'IIFE and module patterns']
      },
      {
        title: 'Prototypes & Inheritance',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Understand JavaScript\'s prototype chain, how `this` works, and ES6 classes under the hood.',
        points: ['[[Prototype]] chain traversal', 'Object.create() vs class syntax', 'call, apply, bind']
      },
      {
        title: 'Functional Patterns',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Write cleaner, more predictable code using functional programming concepts.',
        points: ['Pure functions and immutability', 'Higher-order functions: map, filter, reduce', 'Currying and partial application']
      }
    ]
  },
  'Relational Databases (SQL)': {
    overview: 'SQL remains the most critical database skill in software engineering. Master query optimisation, indexing, and schema design for production systems.',
    estimatedTime: '3–4 weeks',
    subtopics: [
      {
        title: 'ACID Properties',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Understand the transactional guarantees that make relational databases reliable.',
        points: ['Atomicity, Consistency, Isolation, Durability', 'Transaction isolation levels (Read Committed, Serializable)', 'Deadlock detection and prevention']
      },
      {
        title: 'Indexing & Query Optimisation',
        duration: '3 days',
        difficulty: 'Intermediate',
        description: 'Write and tune queries for millisecond performance at scale.',
        points: ['B-Tree and Hash index internals', 'EXPLAIN ANALYZE and execution plans', 'Index selectivity and covering indexes']
      },
      {
        title: 'Schema Design & Normalisation',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Design schemas that are correct, efficient, and easy to evolve.',
        points: ['1NF, 2NF, 3NF normalisation', 'When to denormalise for read performance', 'Foreign keys, constraints, and integrity']
      }
    ]
  },
  'Shell Scripting': {
    overview: 'Shell scripting is the glue of DevOps automation. Master Bash to write reliable scripts for deployment, monitoring, and data processing.',
    estimatedTime: '1–2 weeks',
    subtopics: [
      {
        title: 'Bash Fundamentals',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Write correct, idiomatic Bash scripts with variables, conditionals, and loops.',
        points: ['Variables, quoting, and parameter expansion', 'Conditionals (if/case) and loops (for/while)', 'Exit codes and error handling with `set -e`']
      },
      {
        title: 'Text Processing Tools',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Leverage the power of Unix pipes and text tools to process data efficiently.',
        points: ['grep, sed, awk for text transformation', 'Pipes, redirection, and process substitution', 'xargs, sort, uniq, cut, wc']
      },
      {
        title: 'Automation & Cron',
        duration: '2 days',
        difficulty: 'Intermediate',
        description: 'Schedule scripts to run automatically and manage system tasks.',
        points: ['crontab syntax and scheduling', 'Writing idempotent scripts', 'Logging and alerting from scripts']
      }
    ]
  }
};

// Map topic names to their subtopic keys (for fuzzy matching)
export const getSubtopics = (topicName) => {
  return SUBTOPICS[topicName] || null;
};
