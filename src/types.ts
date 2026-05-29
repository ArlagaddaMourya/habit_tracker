export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  timing?: string; // e.g., "14:00" or "14:00-15:00"
  priority: "high" | "medium" | "low";
  completed: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: "new" | "exploring" | "parked" | "started";
  tags: string[];
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  plan: string;
  techStack: string[];
  useCase: string;
  purpose: string;
  status: "planning" | "in-progress" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface Learning {
  id: string;
  topic: string;
  resource: string;
  prerequisites: string;
  notes: string;
  completedAt?: string;
  createdAt: string;
}
