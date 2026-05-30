export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  timing?: string;
  type?: string;
  repeat?: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  createdAt: string;
}


export interface Note {
  id: string;
  title: string;
  content: string;
  section: 'notes' | 'ideas' | 'journal';
  date?: string; // for journal daily pages
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
  date: string; // YYYY-MM-DD
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
  topic: string; // what are they learning about
  resource: string;
  prerequisites: string;
  notes?: string;
  completedAt?: string;
  createdAt: string;
}
