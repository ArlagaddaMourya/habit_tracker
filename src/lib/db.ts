// Database service layer.
// All data is stored locally via Tauri SQLite.
// Future: route AI-specific queries to the Python sidecar from here.
export {
  initializeDatabase,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getIdeas,
  createIdea,
  deleteIdea,
  getJournalEntry,
  upsertJournalEntry,
  getProjects,
  createProject,
  deleteProject,
  getLearnings,
  createLearning,
  deleteLearning,
} from "../db";
