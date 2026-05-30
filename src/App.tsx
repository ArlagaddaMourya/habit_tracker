import { useState, useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppHeader } from "@/components/layout/AppHeader";
import { useTheme } from "@/hooks/use-theme";
import {
  initializeDatabase,
  getTasks,
  createTask,
  updateTask,
  createNote,
} from "@/lib/db";
import type { Task } from "./types";

import PieChart from "./components/dashboard/PieChart";
import TodaysTasks from "./components/dashboard/TodaysTasks";
import HeatCalendar from "./components/dashboard/HeatCalendar";
import Calendar24WeekView from "./components/dashboard/Calendar24WeekView";
import AddTaskModal from "./components/dashboard/AddTaskModal";
import Notepad from "./components/notepad/Notepad";
import Projects from "./components/projects/Projects";
import Learnings from "./components/learnings/Learnings";

const TASK_PAGES = ["Dashboard", "Calendar"];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [quickNoteOpen, setQuickNoteOpen] = useState(false);
  const [quickNoteText, setQuickNoteText] = useState("");
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  // Initialize DB then load tasks
  useEffect(() => {
    initializeDatabase()
      .then(() => {
        setDbReady(true);
        return getTasks();
      })
      .then(setTasks)
      .catch((e: Error) => setDbError(e.message));
  }, []);

  const refreshTasks = () => getTasks().then(setTasks).catch(console.error);

  const saveQuickNote = async () => {
    if (!quickNoteText.trim()) return;
    const title = quickNoteText.slice(0, 50).trim() || "Quick note";
    await createNote({ title, content: quickNoteText }).catch(console.error);
    setQuickNoteText("");
    setQuickNoteOpen(false);
    setActivePage("Notepad");
  };

  const handleAddTask = async (form: {
    title: string;
    date: string;
    time: string;
    type: string;
    venue: string;
    repeating: string;
  }) => {
    await createTask({
      title: form.title,
      dueDate: form.date,
      timing: form.time || undefined,
      type: form.type || undefined,
      repeat: form.repeating || undefined,
      priority: "medium",
      completed: false,
    }).catch(console.error);
    await refreshTasks();
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    await updateTask(id, { completed }).catch(console.error);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
  };

  if (dbError) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground p-8">
        <div className="text-center max-w-sm">
          <p className="text-destructive font-semibold mb-2">Database unavailable</p>
          <p className="text-sm text-muted-foreground mb-4">{dbError}</p>
          <p className="text-xs text-muted-foreground">
            Make sure you are running the app with{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded">npm run tauri dev</code>
            , not as a plain browser page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar
          activePage={activePage}
          onNavigate={setActivePage}
          onAddTask={() => setAddTaskOpen(true)}
          onQuickNote={() => setQuickNoteOpen((v) => !v)}
        />

        <SidebarInset>
          <AppHeader
            activePage={activePage}
            theme={theme}
            onToggleTheme={toggleTheme}
            onQuickNote={() => setQuickNoteOpen((v) => !v)}
            onAddTask={() => setAddTaskOpen(true)}
            showAddTask={TASK_PAGES.includes(activePage)}
          />

          {quickNoteOpen && (
            <div className="border-b border-border bg-card px-6 py-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Quick note</p>
              <textarea
                value={quickNoteText}
                onChange={(e) => setQuickNoteText(e.target.value)}
                rows={3}
                autoFocus
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none resize-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                placeholder="Type a quick idea or note..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); saveQuickNote(); }
                  if (e.key === "Escape") setQuickNoteOpen(false);
                }}
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Enter to save · Esc to dismiss</p>
                <Button size="sm" onClick={saveQuickNote}>Save note</Button>
              </div>
            </div>
          )}

          <main className="flex-1 overflow-y-auto p-6">
            {!dbReady && (
              <p className="text-sm text-muted-foreground">Initializing database…</p>
            )}

            {dbReady && activePage === "Dashboard" && (
              <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <PieChart tasks={tasks} />
                  <TodaysTasks tasks={tasks} onToggle={handleToggleTask} />
                </div>
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <HeatCalendar tasks={tasks} />
                </div>
              </div>
            )}

            {dbReady && activePage === "Calendar" && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <Calendar24WeekView tasks={tasks} />
              </div>
            )}

            {dbReady && activePage === "Notepad" && <Notepad />}
            {dbReady && activePage === "Projects" && <Projects />}
            {dbReady && activePage === "Learnings" && <Learnings />}
          </main>
        </SidebarInset>

        <AddTaskModal
          open={addTaskOpen}
          onClose={() => setAddTaskOpen(false)}
          onAdd={handleAddTask}
        />
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default App;
