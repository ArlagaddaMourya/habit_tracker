import type { Task } from "../../types";

interface PieChartProps {
  tasks: Task[];
}

export default function PieChart({ tasks }: PieChartProps) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const radius = 56;
  const stroke = 14;
  const r = radius - stroke / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex items-center gap-6 py-2">
      <svg height={radius * 2} width={radius * 2} className="shrink-0 overflow-visible">
        <circle stroke="var(--muted)" fill="transparent" strokeWidth={stroke} r={r} cx={radius} cy={radius} />
        <circle
          stroke="var(--primary)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: offset, transition: "stroke-dashoffset 0.5s ease" }}
          strokeLinecap="round"
          r={r}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fontSize="1.1rem" fontWeight="700" fill="var(--foreground)">
          {percent}%
        </text>
      </svg>

      <div className="space-y-1">
        <p className="text-base font-semibold text-card-foreground">Completion</p>
        <p className="text-sm text-muted-foreground">{done} of {total} tasks done</p>
        <div className="flex gap-3 text-xs text-muted-foreground mt-2">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-primary" />
            Done
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-muted" />
            Remaining
          </span>
        </div>
      </div>
    </div>
  );
}
