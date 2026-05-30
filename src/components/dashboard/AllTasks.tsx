import { useState } from "react";
import type { Task } from "../../types";

type Filter = "all" | "today" | "upcoming" | "completed";

const PRIORITY_CHIP: Record<Task["priority"], string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400",
  low: "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-400",
};

function fmt(date: string, today: string): string {
  if (date === today) return "Today";
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function AllTasks({
  tasks,
  onToggle,
}: {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const today = new Date().toISOString().slice(0, 10);

  const counts: Record<Filter, number> = {
    all: tasks.length,
    today: tasks.filter((t) => t.dueDate === today).length,
    upcoming: tasks.filter((t) => t.dueDate > today && !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const filtered = tasks.filter((t) => {
    if (filter === "today") return t.dueDate === today;
    if (filter === "upcoming") return t.dueDate > today && !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "today", label: "Today" },
    { id: "upcoming", label: "Upcoming" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-base font-semibold text-card-foreground">All Tasks</h3>
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-card-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
              {counts[tab.id] > 0 && (
                <span className="opacity-60">{counts[tab.id]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No tasks here.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 cursor-pointer group hover:border-primary/50 transition-colors"
              onClick={() => onToggle(task.id, !task.completed)}
            >
              <span
                className={`inline-flex h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                  task.completed
                    ? "bg-primary border-primary"
                    : "border-muted-foreground group-hover:border-primary"
                }`}
              />
              <span className="flex-1 min-w-0">
                <span
                  className={`text-sm font-medium ${
                    task.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {task.title}
                </span>
              </span>
              <span className="text-xs text-muted-foreground shrink-0">
                {fmt(task.dueDate, today)}
              </span>
              {task.timing && (
                <span className="text-xs text-primary shrink-0">{task.timing}</span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded-full shrink-0 font-medium ${PRIORITY_CHIP[task.priority]}`}
              >
                {task.priority}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
