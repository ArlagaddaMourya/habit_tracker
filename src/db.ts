import Database from "@tauri-apps/plugin-sql";

let db: Database | null = null;

export async function initializeDatabase() {
  if (db) return db;

  db = await Database.load("sqlite:habit_tracker.db");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT NOT NULL,
      timing TEXT,
      priority TEXT DEFAULT 'medium',
      completed INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'new',
      tags TEXT,
      created_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      content TEXT,
      mood TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      plan TEXT,
      tech_stack TEXT,
      use_case TEXT,
      purpose TEXT,
      status TEXT DEFAULT 'planning',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS learnings (
      id TEXT PRIMARY KEY,
      topic TEXT NOT NULL,
      resource TEXT,
      prerequisites TEXT,
      notes TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL
    )
  `);

  return db;
}

export function getDatabase() {
  if (!db) throw new Error("Database not initialized");
  return db;
}

export async function addTask(task: any) {
  const database = getDatabase();
  await database.execute(
    `INSERT INTO tasks (id, title, description, due_date, timing, priority, completed, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      task.id,
      task.title,
      task.description || "",
      task.dueDate,
      task.timing || "",
      task.priority || "medium",
      task.completed ? 1 : 0,
      task.createdAt,
    ]
  );
}

export async function getTasks() {
  const database = getDatabase();
  const result = await database.select("SELECT * FROM tasks ORDER BY due_date ASC");
  return result;
}

export async function getTasksForDate(date: string) {
  const database = getDatabase();
  const result = await database.select("SELECT * FROM tasks WHERE due_date = ? ORDER BY timing ASC", [date]);
  return result;
}

export async function addNote(note: any) {
  const database = getDatabase();
  await database.execute(
    `INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
    [note.id, note.title, note.content, note.createdAt, note.updatedAt]
  );
}

export async function getNotes() {
  const database = getDatabase();
  const result = await database.select("SELECT * FROM notes ORDER BY created_at DESC");
  return result;
}

export async function addIdea(idea: any) {
  const database = getDatabase();
  await database.execute(
    `INSERT INTO ideas (id, title, description, status, tags, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [idea.id, idea.title, idea.description, idea.status || "new", JSON.stringify(idea.tags || []), idea.createdAt]
  );
}

export async function getIdeas() {
  const database = getDatabase();
  const result = await database.select("SELECT * FROM ideas ORDER BY created_at DESC");
  return result;
}

export async function addJournalEntry(entry: any) {
  const database = getDatabase();
  await database.execute(
    `INSERT INTO journal_entries (id, date, content, mood, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [entry.id, entry.date, entry.content, entry.mood || "", entry.createdAt, entry.updatedAt]
  );
}

export async function getJournalEntry(date: string) {
  const database = getDatabase();
  const result = await database.select("SELECT * FROM journal_entries WHERE date = ?", [date]);
  return result[0] || null;
}

export async function updateJournalEntry(entry: any) {
  const database = getDatabase();
  await database.execute(
    `UPDATE journal_entries SET content = ?, mood = ?, updated_at = ? WHERE date = ?`,
    [entry.content, entry.mood || "", new Date().toISOString(), entry.date]
  );
}

export async function addProject(project: any) {
  const database = getDatabase();
  await database.execute(
    `INSERT INTO projects (id, title, description, plan, tech_stack, use_case, purpose, status, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      project.id,
      project.title,
      project.description,
      project.plan,
      JSON.stringify(project.techStack || []),
      project.useCase,
      project.purpose,
      project.status || "planning",
      project.createdAt,
      project.updatedAt,
    ]
  );
}

export async function getProjects() {
  const database = getDatabase();
  const result = await database.select("SELECT * FROM projects ORDER BY created_at DESC");
  return result;
}

export async function addLearning(learning: any) {
  const database = getDatabase();
  await database.execute(
    `INSERT INTO learnings (id, topic, resource, prerequisites, notes, created_at) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [learning.id, learning.topic, learning.resource, learning.prerequisites, learning.notes, learning.createdAt]
  );
}

export async function getLearnings() {
  const database = getDatabase();
  const result = await database.select("SELECT * FROM learnings ORDER BY created_at DESC");
  return result;
}
