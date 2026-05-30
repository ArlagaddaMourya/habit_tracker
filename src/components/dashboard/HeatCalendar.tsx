import { useMemo } from "react";
import type { Task } from "../../types";

interface HeatCalendarProps {
  tasks: Task[];
}

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

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
  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((task) => {
      map[task.dueDate] = (map[task.dueDate] || 0) + 1;
    });
    return map;
  }, [tasks]);

  const weeks = useMemo(() => getCalendarMatrix(), []);

  function getCellClass(count: number) {
    if (count >= 4) return "bg-primary";
    if (count === 3) return "bg-primary/80";
    if (count === 2) return "bg-primary/55";
    if (count === 1) return "bg-primary/30";
    return "bg-muted";
  }

  return (
    <div>
      <h4 className="text-base font-semibold mb-3 text-card-foreground">Activity Heat Map</h4>
      <div className="flex gap-1 overflow-x-auto pb-1">
        {weeks.map((week, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-1">
            {week.map((date, rowIdx) => {
              const key = getDayKey(date);
              const count = activityMap[key] || 0;
              return (
                <div
                  key={rowIdx}
                  title={`${key}: ${count} activities`}
                  className={`w-3 h-3 rounded-sm ${getCellClass(count)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Darker = more activity</p>
    </div>
  );
}
