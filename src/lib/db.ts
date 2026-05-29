// DB utility for FastAPI backend

const API_BASE = 'http://localhost:8000'; // Adjust if backend runs elsewhere

// --- TASKS ---
export async function getTasks() {
  const res = await fetch(`${API_BASE}/tasks/`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return await res.json();
}

export async function createTask(task) {
  const res = await fetch(`${API_BASE}/tasks/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return await res.json();
}

export async function updateTask(id, task) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return await res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
  return await res.json();
}

// --- NOTES ---
export async function getNotes() {
  const res = await fetch(`${API_BASE}/notes/`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  return await res.json();
}

export async function createNote(note) {
  const res = await fetch(`${API_BASE}/notes/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return await res.json();
}

export async function updateNote(id, note) {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return await res.json();
}

export async function deleteNote(id) {
  const res = await fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete note');
  return await res.json();
}

// --- PROJECTS ---
export async function getProjects() {
  const res = await fetch(`${API_BASE}/projects/`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return await res.json();
}

export async function createProject(project) {
  const res = await fetch(`${API_BASE}/projects/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return await res.json();
}

export async function updateProject(id, project) {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return await res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete project');
  return await res.json();
}

// --- LEARNINGS ---
export async function getLearnings() {
  const res = await fetch(`${API_BASE}/learnings/`);
  if (!res.ok) throw new Error('Failed to fetch learnings');
  return await res.json();
}

export async function createLearning(learning) {
  const res = await fetch(`${API_BASE}/learnings/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(learning),
  });
  if (!res.ok) throw new Error('Failed to create learning');
  return await res.json();
}

export async function updateLearning(id, learning) {
  const res = await fetch(`${API_BASE}/learnings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(learning),
  });
  if (!res.ok) throw new Error('Failed to update learning');
  return await res.json();
}

export async function deleteLearning(id) {
  const res = await fetch(`${API_BASE}/learnings/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete learning');
  return await res.json();
}
