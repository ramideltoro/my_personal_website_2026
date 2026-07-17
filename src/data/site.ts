export const profile = {
  name: "Rami Del Toro",
  initials: "RD",
  role: "Senior Software Engineer",
  headline:
    "Building resilient cloud-native systems, pragmatic APIs, and product experiences that hold up under real load.",
  summary:
    "I am a senior software engineer focused on scalable cloud applications, API-oriented architecture, secure delivery, algorithms, distributed systems, and codebases that stay understandable as they grow.",
  location: "United States",
  siteUrl: "https://www.ramideltoro.com",
  github: "https://github.com/ramideltoro",
  linkedin: "https://www.linkedin.com/in/ramideltoro",
  showAlgoAuthor: "https://www.showalgo.com/author/rami-del-toro/"
};

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" }
];

export const focusAreas = [
  {
    title: "Cloud-ready systems",
    eyebrow: "Scale",
    icon: "cloud",
    body:
      "Designing services and deployment paths for standard, scalable cloud applications."
  },
  {
    title: "API-oriented architecture",
    eyebrow: "Integration",
    icon: "network",
    body:
      "Building APIs that simplify service communication and leave room for product change."
  },
  {
    title: "Secure from the start",
    eyebrow: "Resilience",
    icon: "shield",
    body:
      "Treating security, fault isolation, and operational recovery as first-class engineering concerns."
  }
];

export const principles = [
  "Curious technical communicator",
  "Well-defined instructions",
  "Space and time performance",
  "Testable, simple code",
  "Author primers and standards",
  "Balance latency, sharding, and CAP tradeoffs"
];

export const stats = [
  { label: "Primary role", value: "Senior Engineer" },
  { label: "Core domain", value: "Cloud + APIs" },
  { label: "Foundation", value: "Algorithms" },
  { label: "Delivery style", value: "Secure by design" }
];

export const projects = [
  {
    name: "ShowAlgo",
    type: "Algorithms and Technology Analysis",
    href: "https://showalgo.com",
    sourceLabel: "Visit site",
    year: "2022",
    color: "cyan",
    summary:
      "A public learning site for software engineers exploring algorithms, data structures, sorting, search, recursion, graphs, and lists.",
    evidence: "Current portfolio and public ShowAlgo metadata",
    stack: ["React", "JavaScript", "Algorithms", "Technical writing"]
  },
  {
    name: "Algorithms v2",
    type: "Java algorithms repository",
    href: "https://github.com/ramideltoro/algorithms-v2",
    sourceLabel: "View repository",
    year: "Open source",
    color: "amber",
    summary:
      "A Java repository connected to Rami's algorithm practice and implementation work.",
    evidence: "Public GitHub repository",
    stack: ["Java", "Data structures", "Algorithm analysis", "Testing"]
  },
  {
    name: "Legacy portfolio highlights",
    type: "Selected work archive",
    href: "https://www.ramideltoro.com",
    sourceLabel: "Current site",
    year: "Archive",
    color: "rose",
    summary:
      "Earlier portfolio material covering cloud applications, API integration, security, resilient systems, and software engineering fundamentals.",
    evidence: "Current ramideltoro.com content",
    stack: ["Cloud", "APIs", "Distributed systems", "Resiliency"]
  }
];

export const skillGroups = [
  {
    name: "Languages and application code",
    skills: ["Java", "JavaScript", "React.js", "Bash", "SQL"]
  },
  {
    name: "Cloud and platform",
    skills: ["AWS", "Cloud Foundry", "Spring Boot", "Maven", "KMS"]
  },
  {
    name: "Data and integration",
    skills: ["Kafka", "Cassandra", "APIs", "Reactive programming"]
  },
  {
    name: "Engineering practice",
    skills: ["Mockito", "JUnit 5", "Resilience4j", "Design patterns", "Secure systems"]
  }
];

export const assistantAnswers = {
  work:
    "Rami's public portfolio centers on cloud-ready applications, API-oriented services, secure systems, algorithms, and distributed-system resilience.",
  projects:
    "Start with ShowAlgo for public algorithm writing, then the Java algorithms-v2 repository for implementation work. The archive card captures older portfolio themes from ramideltoro.com.",
  stack:
    "The current public stack includes Java, React.js, AWS, Cloud Foundry, Spring Boot, Kafka, Cassandra, Maven, Mockito, JUnit 5, Resilience4j, and reactive programming.",
  contact:
    "Use the Netlify-powered contact form on this page, or connect through GitHub and LinkedIn.",
  default:
    "I can point you to Rami's projects, stack, cloud/API focus, or contact links. Try asking about projects, skills, or how to get in touch."
};
