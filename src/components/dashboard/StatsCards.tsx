import type { Task } from "../../types";

function getStreak(tasks: Task[]): number {
  const completedDates = new Set(tasks.filter((t) => t.completed).map((t) => t.dueDate));
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (completedDates.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function StatsCards({ tasks }: { tasks: Task[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.dueDate === today);
  const completedToday = todayTasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const streak = getStreak(tasks);

  const cards = [
    { label: "Total Tasks", value: tasks.length, sub: `${tasks.filter((t) => t.completed).length} completed` },
    { label: "Today", value: todayTasks.length, sub: `${completedToday} done` },
    { label: "Pending", value: pending, sub: "remaining" },
    { label: "Streak", value: streak, sub: streak === 1 ? "day" : "days" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
          <p className="text-3xl font-bold text-card-foreground mt-1 leading-none">{card.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
