import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (task: {
    title: string;
    date: string;
    time: string;
    type: string;
    venue: string;
    repeating: string;
    repeatDays?: boolean[];
  }) => void;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AddTaskModal({ open, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [venue, setVenue] = useState("");
  const [repeating, setRepeating] = useState("");
  const [repeatDays, setRepeatDays] = useState<boolean[]>(Array(7).fill(false));

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, date, time, type, venue, repeating, repeatDays });
    setTitle(""); setDate(""); setTime(""); setType(""); setVenue("");
    setRepeating(""); setRepeatDays(Array(7).fill(false));
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <h2 className="text-lg font-semibold mb-5 text-card-foreground">Add Task</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <Input
            placeholder="Type (e.g. habit, work, personal)"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <Input
            placeholder="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
          <select
            className={inputClass}
            value={repeating}
            onChange={(e) => setRepeating(e.target.value)}
          >
            <option value="">No Repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          {repeating === "weekly" && (
            <div className="flex gap-1.5 flex-wrap">
              {weekDays.map((d, i) => (
                <label key={d} className="flex flex-col items-center gap-1 text-xs text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={repeatDays[i]}
                    onChange={() =>
                      setRepeatDays((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                    }
                    className="accent-primary"
                  />
                  {d}
                </label>
              ))}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
