import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  ListChecks,
  PieChart,
  Sparkles,
} from "lucide-react";
import "./App.css";

const navItems = ["Dashboard", "Calendar", "Notes", "Projects", "Learnings"];

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
    setActivePage("Notes");
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
                  ? PieChart
                  : item === "Calendar"
                  ? CalendarDays
                  : item === "Notes"
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
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-slate-400">Overview</p>
                      <h3 className="mt-2 text-xl font-semibold">Today’s progress</h3>
                    </div>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                      Local-first
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-[0.55fr_0.45fr]">
                    <div className="rounded-[32px] border border-white/10 bg-slate-950/90 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Completion</p>
                          <p className="mt-2 text-3xl font-semibold text-white">72%</p>
                        </div>
                        <div className="rounded-full border border-white/10 bg-slate-900/90 p-3">
                          <PieChart size={30} className="text-emerald-400" />
                        </div>
                      </div>
                      <div className="mt-8 flex items-center justify-center">
                        <div className="relative flex h-52 w-52 items-center justify-center rounded-full bg-slate-900/90 p-8">
                          <div className="absolute inset-0 rounded-full border border-emerald-400/20" />
                          <div className="relative h-full w-full rounded-full bg-gradient-to-br from-emerald-500/25 to-slate-950/0" />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {overviewCards.map((card) => (
                        <div key={card.label} className={`rounded-[28px] border border-white/10 p-5 ${card.tone}`}>
                          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
                          <p className="mt-3 text-2xl font-semibold text-white">{card.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
                  <div className="flex items-center justify-between gap-4 pb-4">
                    <div>
                      <p className="text-sm text-slate-400">Today</p>
                      <h3 className="text-xl font-semibold">Daily checklist</h3>
                    </div>
                    <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-950">
                      5 items
                    </span>
                  </div>
                  <ul className="space-y-3 text-slate-200">
                    {[
                      "Plan today in 5 minutes",
                      "Capture a quick idea with note icon",
                      "Review habit streaks",
                      "Schedule next session",
                      "Log a learning note",
                    ].map((task) => (
                      <li key={task} className="flex items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/90 p-4">
                        <span className="inline-flex h-5 w-5 rounded-full border border-white/10 bg-slate-800" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          )}

          {activePage === "Calendar" && (
            <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-400">Calendar</p>
                  <h3 className="mt-2 text-2xl font-semibold">Planning schedule</h3>
                </div>
                <button className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">
                  View day mode
                </button>
              </div>
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-400">This week</p>
                  <div className="mt-4 space-y-3">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between rounded-3xl bg-slate-900/90 p-4">
                        <span>Day {i + 1}</span>
                        <span className="text-sm text-slate-400">3 events</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-400">Heat map</p>
                  <div className="mt-4 grid gap-2 rounded-3xl bg-slate-900/90 p-4">
                    {Array.from({ length: 5 }).map((_, row) => (
                      <div key={row} className="flex gap-2">
                        {Array.from({ length: 10 }).map((_, col) => (
                          <span key={col} className={`h-8 w-8 rounded-xl ${Math.random() > 0.7 ? "bg-emerald-400" : "bg-slate-800"}`} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activePage === "Notes" && (
            <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-400">Notes</p>
                  <h3 className="mt-2 text-2xl font-semibold">Saved quick notes</h3>
                </div>
                <div className="inline-flex items-center gap-2 rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-2 text-sm text-slate-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  {notes.length} notes
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {notes.length ? (
                  notes.map((note) => (
                    <div key={note.id} className="rounded-[28px] border border-white/10 bg-slate-950/90 p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{note.title}</h4>
                          <p className="text-sm text-slate-400">{note.created}</p>
                        </div>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                          Quick note
                        </span>
                      </div>
                      <p className="mt-4 text-slate-300">{note.body}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[28px] border border-dashed border-white/10 bg-slate-950/90 p-6 text-slate-400">
                    No notes yet. Use the note icon to capture a quick note.
                  </div>
                )}
              </div>
            </section>
          )}

          {activePage === "Projects" && (
            <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-400">Projects</p>
                  <h3 className="mt-2 text-2xl font-semibold">Active workspaces</h3>
                </div>
                <button className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">
                  New project
                </button>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Portfolio refresh", subtitle: "Planning + review" },
                  { title: "Learning hub", subtitle: "Resources + spaced reps" },
                  { title: "Habit engine", subtitle: "Recurring check-ins" },
                ].map((project) => (
                  <div key={project.title} className="rounded-[28px] border border-white/10 bg-slate-950/90 p-5">
                    <h4 className="font-semibold text-slate-100">{project.title}</h4>
                    <p className="mt-2 text-sm text-slate-400">{project.subtitle}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activePage === "Learnings" && (
            <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-400">Learnings</p>
                  <h3 className="mt-2 text-2xl font-semibold">Knowledge capture</h3>
                </div>
                <button className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">
                  Add resource
                </button>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Python notes", subtitle: "Portfolio + automation" },
                  { title: "Study plan", subtitle: "Interview + learning" },
                ].map((item) => (
                  <div key={item.title} className="rounded-[28px] border border-white/10 bg-slate-950/90 p-5">
                    <h4 className="font-semibold text-slate-100">{item.title}</h4>
                    <p className="mt-2 text-sm text-slate-400">{item.subtitle}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
