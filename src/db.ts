import Database from "@tauri-apps/plugin-sql";
import type { Task, Note, Idea, JournalEntry, Project, Learning } from "./types";

let db: Database | null = null;

export async function initializeDatabase(): Promise<void> {
  if (db) return;

  // Tauri's invoke bridge is only available inside the desktop WebView.
  // If this throws, the app is being opened in a plain browser — run it
  // with `npm run tauri dev` instead.
  if (typeof window === "undefined" || !("__TAURI_INTERNALS__" in window)) {
    throw new Error(
      "Tauri runtime not found. Open this app with `npm run tauri dev`, not a regular browser."
    );
  }

  db = await Database.load("sqlite:habit_tracker.db");

  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      due_date TEXT NOT NULL,
      timing TEXT DEFAULT '',
      type TEXT DEFAULT '',
      repeat TEXT DEFAULT '',
      priority TEXT DEFAULT 'medium',
      completed INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS ideas (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT DEFAULT 'new',
      tags TEXT DEFAULT '[]',
      created_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL UNIQUE,
      content TEXT DEFAULT '',
      mood TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      plan TEXT DEFAULT '',
      tech_stack TEXT DEFAULT '[]',
      use_case TEXT DEFAULT '',
      purpose TEXT DEFAULT '',
      status TEXT DEFAULT 'planning',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS learnings (
      id TEXT PRIMARY KEY,
      topic TEXT NOT NULL,
      resource TEXT DEFAULT '',
      prerequisites TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      completed_at TEXT,
      created_at TEXT NOT NULL
    )
  `);
}

function getDb(): Database {
  if (!db) throw new Error("Database not initialized. Call initializeDatabase() first.");
  return db;
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function now(): string {
  return new Date().toISOString();
}

// ── Row mappers: snake_case DB → camelCase TypeScript ─────────────────────

function mapTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || "",
    dueDate: row.due_date as string,
    timing: (row.timing as string) || undefined,
    type: (row.type as string) || undefined,
    repeat: (row.repeat as string) || undefined,
    priority: (row.priority as Task["priority"]) || "medium",
    completed: row.completed === 1 || row.completed === true,
    createdAt: row.created_at as string,
  };
}

function mapNote(row: Record<string, unknown>): Note {
  return {
    id: row.id as string,
    title: row.title as string,
    content: (row.content as string) || "",
    section: "notes",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapIdea(row: Record<string, unknown>): Idea {
  let tags: string[] = [];
  try { tags = JSON.parse((row.tags as string) || "[]"); } catch { /* empty */ }
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || "",
    status: (row.status as Idea["status"]) || "new",
    tags,
    createdAt: row.created_at as string,
  };
}

function mapJournalEntry(row: Record<string, unknown>): JournalEntry {
  return {
    id: row.id as string,
    date: row.date as string,
    content: (row.content as string) || "",
    mood: (row.mood as string) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapProject(row: Record<string, unknown>): Project {
  let techStack: string[] = [];
  try { techStack = JSON.parse((row.tech_stack as string) || "[]"); } catch { /* empty */ }
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || "",
    plan: (row.plan as string) || "",
    techStack,
    useCase: (row.use_case as string) || "",
    purpose: (row.purpose as string) || "",
    status: (row.status as Project["status"]) || "planning",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapLearning(row: Record<string, unknown>): Learning {
  return {
    id: row.id as string,
    topic: row.topic as string,
    resource: (row.resource as string) || "",
    prerequisites: (row.prerequisites as string) || "",
    notes: (row.notes as string) || undefined,
    completedAt: (row.completed_at as string) || undefined,
    createdAt: row.created_at as string,
  };
}

// ── Tasks ─────────────────────────────────────────────────────────────────

export async function getTasks(): Promise<Task[]> {
  const rows = await getDb().select<Record<string, unknown>[]>(
    "SELECT * FROM tasks ORDER BY due_date ASC, timing ASC"
  );
  return rows.map(mapTask);
}

export async function createTask(
  data: Pick<Task, "title" | "dueDate"> & Partial<Omit<Task, "id" | "createdAt">>
): Promise<Task> {
  const task: Task = {
    id: uid(),
    title: data.title,
    description: data.description ?? "",
    dueDate: data.dueDate,
    timing: data.timing,
    type: data.type,
    repeat: data.repeat,
    priority: data.priority ?? "medium",
    completed: data.completed ?? false,
    createdAt: now(),
  };
  await getDb().execute(
    `INSERT INTO tasks (id, title, description, due_date, timing, type, repeat, priority, completed, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      task.id, task.title, task.description, task.dueDate,
      task.timing ?? "", task.type ?? "", task.repeat ?? "",
      task.priority, task.completed ? 1 : 0, task.createdAt,
    ]
  );
  return task;
}

export async function updateTask(id: string, data: Partial<Omit<Task, "id" | "createdAt">>): Promise<void> {
  const fields: string[] = [];
  const values: unknown[] = [];
  if (data.title !== undefined)       { fields.push("title = ?");       values.push(data.title); }
  if (data.description !== undefined) { fields.push("description = ?"); values.push(data.description); }
  if (data.dueDate !== undefined)     { fields.push("due_date = ?");    values.push(data.dueDate); }
  if (data.timing !== undefined)      { fields.push("timing = ?");      values.push(data.timing); }
  if (data.priority !== undefined)    { fields.push("priority = ?");    values.push(data.priority); }
  if (data.completed !== undefined)   { fields.push("completed = ?");   values.push(data.completed ? 1 : 0); }
  if (fields.length === 0) return;
  values.push(id);
  await getDb().execute(`UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`, values);
}

export async function deleteTask(id: string): Promise<void> {
  await getDb().execute("DELETE FROM tasks WHERE id = ?", [id]);
}

// ── Notes ─────────────────────────────────────────────────────────────────

export async function getNotes(): Promise<Note[]> {
  const rows = await getDb().select<Record<string, unknown>[]>(
    "SELECT * FROM notes ORDER BY created_at DESC"
  );
  return rows.map(mapNote);
}

export async function createNote(data: { title: string; content?: string }): Promise<Note> {
  const id = uid(), ts = now();
  await getDb().execute(
    "INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [id, data.title, data.content ?? "", ts, ts]
  );
  return { id, title: data.title, content: data.content ?? "", section: "notes", createdAt: ts, updatedAt: ts };
}

export async function updateNote(id: string, data: { title?: string; content?: string }): Promise<void> {
  const fields = ["updated_at = ?"];
  const values: unknown[] = [now()];
  if (data.title !== undefined)   { fields.push("title = ?");   values.push(data.title); }
  if (data.content !== undefined) { fields.push("content = ?"); values.push(data.content); }
  values.push(id);
  await getDb().execute(`UPDATE notes SET ${fields.join(", ")} WHERE id = ?`, values);
}

export async function deleteNote(id: string): Promise<void> {
  await getDb().execute("DELETE FROM notes WHERE id = ?", [id]);
}

// ── Ideas ─────────────────────────────────────────────────────────────────

export async function getIdeas(): Promise<Idea[]> {
  const rows = await getDb().select<Record<string, unknown>[]>(
    "SELECT * FROM ideas ORDER BY created_at DESC"
  );
  return rows.map(mapIdea);
}

export async function createIdea(data: {
  title: string;
  description?: string;
  status?: Idea["status"];
  tags?: string[];
}): Promise<Idea> {
  const id = uid(), ts = now();
  const tags = data.tags ?? [];
  await getDb().execute(
    "INSERT INTO ideas (id, title, description, status, tags, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, data.title, data.description ?? "", data.status ?? "new", JSON.stringify(tags), ts]
  );
  return { id, title: data.title, description: data.description ?? "", status: data.status ?? "new", tags, createdAt: ts };
}

export async function deleteIdea(id: string): Promise<void> {
  await getDb().execute("DELETE FROM ideas WHERE id = ?", [id]);
}

// ── Journal ───────────────────────────────────────────────────────────────

export async function getJournalEntry(date: string): Promise<JournalEntry | null> {
  const rows = await getDb().select<Record<string, unknown>[]>(
    "SELECT * FROM journal_entries WHERE date = ?",
    [date]
  );
  return rows[0] ? mapJournalEntry(rows[0]) : null;
}

export async function upsertJournalEntry(date: string, content: string, mood?: string): Promise<JournalEntry> {
  const existing = await getJournalEntry(date);
  const ts = now();
  if (existing) {
    await getDb().execute(
      "UPDATE journal_entries SET content = ?, mood = ?, updated_at = ? WHERE date = ?",
      [content, mood ?? "", ts, date]
    );
    return { ...existing, content, mood, updatedAt: ts };
  }
  const id = uid();
  await getDb().execute(
    "INSERT INTO journal_entries (id, date, content, mood, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, date, content, mood ?? "", ts, ts]
  );
  return { id, date, content, mood, createdAt: ts, updatedAt: ts };
}

// ── Projects ──────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const rows = await getDb().select<Record<string, unknown>[]>(
    "SELECT * FROM projects ORDER BY created_at DESC"
  );
  return rows.map(mapProject);
}

export async function createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
  const id = uid(), ts = now();
  await getDb().execute(
    `INSERT INTO projects (id, title, description, plan, tech_stack, use_case, purpose, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.title, data.description, data.plan, JSON.stringify(data.techStack), data.useCase, data.purpose, data.status, ts, ts]
  );
  return { id, ...data, createdAt: ts, updatedAt: ts };
}

export async function deleteProject(id: string): Promise<void> {
  await getDb().execute("DELETE FROM projects WHERE id = ?", [id]);
}

// ── Learnings ─────────────────────────────────────────────────────────────

export async function getLearnings(): Promise<Learning[]> {
  const rows = await getDb().select<Record<string, unknown>[]>(
    "SELECT * FROM learnings ORDER BY created_at DESC"
  );
  return rows.map(mapLearning);
}

export async function createLearning(data: Omit<Learning, "id" | "createdAt" | "completedAt">): Promise<Learning> {
  const id = uid(), ts = now();
  await getDb().execute(
    "INSERT INTO learnings (id, topic, resource, prerequisites, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, data.topic, data.resource ?? "", data.prerequisites ?? "", data.notes ?? "", ts]
  );
  return { id, ...data, createdAt: ts };
}

export async function deleteLearning(id: string): Promise<void> {
  await getDb().execute("DELETE FROM learnings WHERE id = ?", [id]);
}
