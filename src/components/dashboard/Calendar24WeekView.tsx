// Calendar24WeekView.tsx
import { useState } from "react";
import type { Task } from "../../types";

const hours = Array.from({ length: 24 }, (_, i) => i);
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


interface Calendar24WeekViewProps {
  tasks: Task[];
}

function getWeekDates(startDate: Date) {
  const week: string[] = [];
  const d = new Date(startDate);
  for (let i = 0; i < 7; i++) {
    week.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return week;
}

export default function Calendar24WeekView({ tasks }: Calendar24WeekViewProps) {
  const [scrollHour, setScrollHour] = useState(8);
  const today = new Date();
  today.setDate(today.getDate() - today.getDay() + 1); // Monday as start
  const weekDates = getWeekDates(today);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        {/* Day headers */}
        <div className="w-12" />
        {days.map((day, i) => (
          <div key={day} className="flex-1 text-center font-semibold text-slate-200 py-2">
            {day}
            <div className="text-xs text-slate-400">{weekDates[i]}</div>
          </div>
        ))}
      </div>
      <div className="flex">
        {/* Hour labels */}
        <div className="flex flex-col w-12">
          {hours.map((h) => (
            <div key={h} className="h-10 text-xs text-slate-400 text-right pr-1 py-1 border-b border-slate-800">
              {h}:00
            </div>
          ))}
        </div>
        {/* Calendar grid */}
        {weekDates.map((date, colIdx) => (
          <div key={date} className="flex-1 flex flex-col">
            {hours.map((h) => {
              const timeStr = h.toString().padStart(2, "0") + ":00";
              const task = tasks.find(
                (t) => t.dueDate === date && t.timing && t.timing.startsWith(timeStr)
              );
              return (
                <div
                  key={h}
                  className={`h-10 border-b border-slate-800 relative ${task ? "bg-emerald-400/30" : ""}`}
                >
                  {task && (
                    <div className="absolute left-0 right-0 top-0 bottom-0 bg-emerald-400/80 text-slate-900 rounded px-1 flex items-center text-xs font-semibold">
                      {task.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
