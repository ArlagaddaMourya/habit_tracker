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
  const [_scrollHour] = useState(8);
  const today = new Date();
  today.setDate(today.getDate() - today.getDay() + 1);
  const weekDates = getWeekDates(today);

  return (
    <div>
      <div className="mb-3">
        <p className="text-xs text-muted-foreground">Calendar</p>
        <h3 className="mt-1 text-lg font-semibold text-card-foreground">Week View (24h)</h3>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <div className="flex min-w-[600px]">
          <div className="w-12 shrink-0" />
          {days.map((day, i) => (
            <div key={day} className="flex-1 text-center py-2 border-b border-border">
              <p className="text-xs font-semibold text-card-foreground">{day}</p>
              <p className="text-xs text-muted-foreground">{weekDates[i]?.slice(5)}</p>
            </div>
          ))}
        </div>
        <div className="flex min-w-[600px]">
          <div className="flex flex-col w-12 shrink-0">
            {hours.map((h) => (
              <div
                key={h}
                className="h-10 text-xs text-muted-foreground text-right pr-2 py-1 border-b border-border"
              >
                {h.toString().padStart(2, "0")}
              </div>
            ))}
          </div>
          {weekDates.map((date) => (
            <div key={date} className="flex-1 flex flex-col">
              {hours.map((h) => {
                const timeStr = h.toString().padStart(2, "0") + ":00";
                const task = tasks.find(
                  (t) => t.dueDate === date && t.timing && t.timing.startsWith(timeStr)
                );
                return (
                  <div
                    key={h}
                    className={`h-10 border-b border-border relative ${task ? "bg-primary/15" : ""}`}
                  >
                    {task && (
                      <div className="absolute inset-0 bg-primary/80 text-primary-foreground rounded-sm mx-0.5 px-1 flex items-center text-xs font-medium truncate">
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
    </div>
  );
}
