-- SQLite schema for habit_tracker
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  dueDate TEXT,
  timing TEXT,
  priority TEXT,
  completed INTEGER,
  createdAt TEXT
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT,
  section TEXT,
  date TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS ideas (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  status TEXT,
  tags TEXT,
  createdAt TEXT
);

CREATE TABLE IF NOT EXISTS journal (
  id TEXT PRIMARY KEY,
  date TEXT,
  content TEXT,
  mood TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  plan TEXT,
  techStack TEXT,
  useCase TEXT,
  purpose TEXT,
  status TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS learnings (
  id TEXT PRIMARY KEY,
  topic TEXT,
  resource TEXT,
  prerequisites TEXT,
  notes TEXT,
  completedAt TEXT,
  createdAt TEXT
);
