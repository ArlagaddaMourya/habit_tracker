import type { Task } from "../../types";

interface TodaysTasksProps {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => void;
}

export default function TodaysTasks({ tasks, onToggle }: TodaysTasksProps) {
  const today = new Date().toISOString().slice(0, 10);
  const todaysTasks = tasks.filter((t) => t.dueDate === today);

  return (
    <div className="mt-6">
      <h4 className="text-base font-semibold mb-3 text-card-foreground">
        Today's Tasks
        {todaysTasks.length > 0 && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {todaysTasks.filter((t) => t.completed).length}/{todaysTasks.length}
          </span>
        )}
      </h4>

      {todaysTasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tasks scheduled for today.</p>
      ) : (
        <ul className="space-y-2">
          {todaysTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 cursor-pointer group"
              onClick={() => onToggle(task.id, !task.completed)}
            >
              <span
                className={`inline-flex h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                  task.completed
                    ? "bg-primary border-primary"
                    : "bg-transparent border-muted-foreground group-hover:border-primary"
                }`}
              />
              <span className="flex-1 min-w-0">
                <span
                  className={`text-sm font-medium transition-colors ${
                    task.completed ? "line-through text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {task.title}
                </span>
                {task.timing && (
                  <span className="ml-2 text-xs text-primary">{task.timing}</span>
                )}
              </span>
              {task.type && (
                <span className="text-xs text-muted-foreground shrink-0">{task.type}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
