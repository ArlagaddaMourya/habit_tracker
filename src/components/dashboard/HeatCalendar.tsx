// HeatCalendar component stub


import { useMemo } from "react";
import type { Task } from "../../types";

interface HeatCalendarProps {
  tasks: Task[];
}

// Helper to get the start of the week (Sunday)
function getStartOfWeek(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

// Helper to get all days in the last 12 months (like GitHub)
function getCalendarMatrix() {
  const today = new Date();
  const start = new Date(today);
  start.setMonth(today.getMonth() - 11);
  start.setDate(1);
  const startOfFirstWeek = getStartOfWeek(start);
  const weeks: Date[][] = [];
  let current = new Date(startOfFirstWeek);
  while (current <= today) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function getDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function HeatCalendar({ tasks }: HeatCalendarProps) {
  // Map date string to activity count
  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((task) => {
      map[task.dueDate] = (map[task.dueDate] || 0) + 1;
    });
    return map;
  }, [tasks]);

  const weeks = useMemo(() => getCalendarMatrix(), []);

  // Color scale (GitHub style)
  function getColor(count: number) {
    if (count >= 4) return "bg-emerald-500";
    if (count === 3) return "bg-emerald-400";
    if (count === 2) return "bg-emerald-300";
    if (count === 1) return "bg-emerald-200";
    return "bg-slate-800";
  }

  return (
    <div>
      <h4 className="text-lg font-semibold mb-2 text-white">Activity Heat Map</h4>
      <div className="flex gap-1">
        {weeks.map((week, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-1">
            {week.map((date, rowIdx) => {
              const key = getDayKey(date);
              const count = activityMap[key] || 0;
              return (
                <div
                  key={rowIdx}
                  title={`${key}: ${count} activities`}
                  className={`w-4 h-4 rounded-sm border border-slate-900 ${getColor(count)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs text-slate-400">GitHub-style: darker = more activity</div>
    </div>
  );
}
