import { useMemo } from "react";
import type { Task } from "../../types";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CELL = 12;
const GAP = 2;
const STRIDE = CELL + GAP;
const DAY_COL_W = 28;

function buildGrid() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from Sunday 52 weeks ago
  const start = new Date(today);
  start.setDate(today.getDate() - 52 * 7);
  start.setDate(start.getDate() - start.getDay());

  const weeks: Date[][] = [];
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  const cur = new Date(start);

  while (cur <= today) {
    const week: Date[] = [];
    const colIdx = weeks.length;
    for (let d = 0; d < 7; d++) {
      if (d === 0) {
        const m = cur.getMonth();
        if (m !== lastMonth) {
          monthLabels.push({ label: MONTHS[m], col: colIdx });
          lastMonth = m;
        }
      }
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  return { weeks, monthLabels, today };
}

function heatLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

export default function HeatCalendar({ tasks }: { tasks: Task[] }) {
  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      if (t.dueDate) map[t.dueDate] = (map[t.dueDate] || 0) + 1;
    });
    return map;
  }, [tasks]);

  const { weeks, monthLabels, today } = useMemo(() => buildGrid(), []);

  const totalW = DAY_COL_W + GAP + weeks.length * STRIDE;

  return (
    <div>
      <h4 className="text-base font-semibold mb-3 text-card-foreground">Activity</h4>

      <div className="overflow-x-auto">
        <div style={{ minWidth: totalW }}>

          {/* Month labels */}
          <div style={{ position: "relative", height: 16, marginLeft: DAY_COL_W + GAP }}>
            {monthLabels.map(({ label, col }, i) => (
              <span
                key={i}
                className="text-muted-foreground"
                style={{
                  position: "absolute",
                  left: col * STRIDE,
                  fontSize: 10,
                  lineHeight: "16px",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Day labels + cell grid */}
          <div style={{ display: "flex", gap: GAP }}>
            {/* Day label column */}
            <div style={{ display: "flex", flexDirection: "column", gap: GAP, width: DAY_COL_W }}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="text-muted-foreground"
                  style={{
                    height: CELL,
                    fontSize: 9,
                    lineHeight: `${CELL}px`,
                    textAlign: "right",
                    paddingRight: 4,
                  }}
                >
                  {i === 1 ? "Mon" : i === 3 ? "Wed" : i === 5 ? "Fri" : ""}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wIdx) => (
              <div key={wIdx} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                {week.map((date, dIdx) => {
                  const key = date.toISOString().slice(0, 10);
                  const count = activityMap[key] || 0;
                  const isFuture = date > today;
                  const level = heatLevel(count);
                  return (
                    <div
                      key={dIdx}
                      title={isFuture ? "" : `${key}: ${count} task${count !== 1 ? "s" : ""}`}
                      style={{
                        width: CELL,
                        height: CELL,
                        borderRadius: 2,
                        backgroundColor: isFuture
                          ? "transparent"
                          : `var(--heat-${level})`,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 4,
              marginTop: 8,
            }}
          >
            <span className="text-muted-foreground" style={{ fontSize: 10 }}>Less</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <div
                key={l}
                style={{
                  width: CELL,
                  height: CELL,
                  borderRadius: 2,
                  backgroundColor: `var(--heat-${l})`,
                }}
              />
            ))}
            <span className="text-muted-foreground" style={{ fontSize: 10 }}>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
