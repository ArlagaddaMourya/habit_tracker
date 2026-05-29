// TodaysTasks component stub
import type { Task } from "../../types";

interface TodaysTasksProps {
  tasks: Task[];
}

export default function TodaysTasks({ tasks }: TodaysTasksProps) {
  const today = new Date().toISOString().slice(0, 10);
  const todaysTasks = tasks.filter((t) => t.dueDate === today);
  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-2 text-white">Today's Tasks</h4>
      <ul className="space-y-2">
        {todaysTasks.map((task) => (
          <li key={task.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/90 p-3">
            <span className={`inline-flex h-4 w-4 rounded-full border ${task.completed ? 'bg-emerald-400 border-emerald-400' : 'bg-slate-800 border-white/10'}`} />
            <span className="flex-1">
              <span className="font-medium text-slate-100">{task.title}</span>
              {task.timing && (
                <span className="ml-2 text-xs text-emerald-400">[{task.timing}]</span>
              )}
            </span>
            {task.description && <span className="text-xs text-slate-400">{task.description}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
