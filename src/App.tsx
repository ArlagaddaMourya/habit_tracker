
import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  ListChecks,
  PieChart as PieChartIcon,
  Sparkles,
} from "lucide-react";
import "./App.css";


import PieChart from "./components/dashboard/PieChart";
import TodaysTasks from "./components/dashboard/TodaysTasks";
import HeatCalendar from "./components/dashboard/HeatCalendar";
import Calendar24WeekView from "./components/dashboard/Calendar24WeekView";
import AddTaskModal from "./components/dashboard/AddTaskModal";
import Notepad from "./components/notepad/Notepad";
import Projects from "./components/projects/Projects";
import Learnings from "./components/learnings/Learnings";
import { getTasks, createTask } from "./lib/db";
import { useEffect } from "react";

const navItems = ["Dashboard", "Calendar", "Notepad", "Projects", "Learnings"];

const overviewCards = [
  { label: "Streak", value: "8 days", tone: "bg-emerald-500/10 text-emerald-300" },
  { label: "Tasks due", value: "5", tone: "bg-sky-500/10 text-sky-300" },
  { label: "Notes saved", value: "12", tone: "bg-violet-500/10 text-violet-300" },
];

const initialNotes = [
  {
    id: "1",
    title: "Morning planning",
    body: "Review the habit tracker goals and set today’s top 3 tasks.",
    created: "Today, 8:18 AM",
  },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState(initialNotes);
  const [quickNoteOpen, setQuickNoteOpen] = useState(false);
  const [quickNoteText, setQuickNoteText] = useState("");
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]); // TODO: use Task[]

  // Fetch tasks from FastAPI on load
  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  // Save note and redirect to Notepad > Notes
  const saveQuickNote = () => {
    if (!quickNoteText.trim()) return;
    setNotes((current) => [
      {
        id: String(Date.now()),
        title: quickNoteText.slice(0, 35) || "Quick note",
        body: quickNoteText,
        created: "Just now",
      },
      ...current,
    ]);
    setQuickNoteText("");
    setQuickNoteOpen(false);
    setActivePage("Notepad");
  };

  // Add new task handler (FastAPI)
  const handleAddTask = async (task: any) => {
    // Map frontend fields to backend model
    const payload = {
      title: task.title,
      description: task.description || "",
      date: task.date, // FastAPI expects 'date'
      time: task.time || null,
      repeat: task.repeating || null,
      completed: false,
    };
    await createTask(payload);
    // Refresh tasks from API
    const rows = await getTasks();
    setTasks(rows);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto relative flex min-h-screen max-w-[1680px] gap-4 p-4">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/80 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-full max-w-sm transform overflow-hidden rounded-b-[32px] border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl transition duration-300 md:static md:w-72 md:rounded-[32px] md:shadow-none ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } md:flex md:flex-col`}
        >
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Workspace</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-emerald-400 text-slate-950">
                <Sparkles size={18} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Habit Tracker</h1>
                <p className="mt-1 text-sm text-slate-400">Plan, note, and review your day.</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = item === activePage;

              const icon =
                item === "Dashboard"
                  ? PieChartIcon
                  : item === "Calendar"
                  ? CalendarDays
                  : item === "Notepad"
                  ? BookOpen
                  : item === "Projects"
                  ? ListChecks
                  : CheckCircle2;
              const Icon = icon;

              return (
                <button
                  key={item}
                  onClick={() => setActivePage(item)}
                  className={`flex w-full items-center justify-between gap-3 rounded-3xl px-4 py-3 text-left text-sm transition ${
                    active ? "bg-slate-800 text-white shadow-lg shadow-slate-950/20" : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon size={16} className="text-slate-400" />
                    {item}
                  </span>
                  {active && <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-sm text-slate-300">
            <p className="uppercase tracking-[0.2em] text-slate-500">Focus</p>
            <p className="mt-3 text-slate-200">Capture quick notes and keep your planner visible.</p>
          </div>
        </aside>

        <main className="flex-1 space-y-4">
          <header className="rounded-[32px] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Current view</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">{activePage}</h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setSidebarOpen((prev) => !prev)}
                  className="inline-flex items-center rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10 md:hidden"
                >
                  {sidebarOpen ? "Close menu" : "Menu"}
                </button>
                <button
                  onClick={() => setQuickNoteOpen((prev) => !prev)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10"
                  aria-label="Capture quick note"
                >
                  <FileText size={18} />
                </button>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-slate-300">
                  {notes.length} saved notes
                </div>
              </div>
            </div>

            {quickNoteOpen && (
              <div className="mt-5 rounded-[28px] border border-white/10 bg-slate-950/90 p-5 shadow-xl shadow-slate-950/30">
                <p className="text-sm text-slate-400">Quick note capture</p>
                <textarea
                  value={quickNoteText}
                  onChange={(event) => setQuickNoteText(event.target.value)}
                  rows={4}
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 p-4 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                  placeholder="Type a quick idea or note..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      saveQuickNote();
                    }
                  }}
                />
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">Saved notes appear in the Notes tab.</p>
                  <button
                    onClick={saveQuickNote}
                    className="rounded-3xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                  >
                    Save quick note
                  </button>
                </div>
              </div>
            )}
          </header>

          {activePage === "Dashboard" && (
            <div className="space-y-4">
              <div className="grid gap-4 xl:grid-cols-[1.25fr_0.85fr]">
                <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
                  <PieChart />
                  <TodaysTasks tasks={tasks} />
                </section>
                <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
                  <HeatCalendar tasks={tasks} />
                </section>
              </div>
            </div>
          )}

          {activePage === "Calendar" && (
            <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">Calendar</p>
                  <h3 className="mt-2 text-2xl font-semibold">Week View (24h)</h3>
                </div>
                <button
                  className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10"
                  onClick={() => setAddTaskOpen(true)}
                >
                  Add Task
                </button>
              </div>
              <Calendar24WeekView tasks={tasks} />
            </section>
          )}

          {activePage === "Notepad" && <Notepad />}

          {activePage === "Projects" && <Projects />}

          {activePage === "Learnings" && <Learnings />}
        {/* Floating Add Task button (shows on Dashboard/Calendar) */}
        {(activePage === "Dashboard" || activePage === "Calendar") && (
          <button
            className="fixed bottom-8 right-8 z-50 rounded-full bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-900/30 w-16 h-16 flex items-center justify-center text-3xl hover:bg-emerald-300 transition"
            title="Add Task"
            onClick={() => setAddTaskOpen(true)}
          >
            +
          </button>
        )}
        <AddTaskModal open={addTaskOpen} onClose={() => setAddTaskOpen(false)} onAdd={handleAddTask} />
        </main>
      </div>
    </div>
  );
}

export default App;
