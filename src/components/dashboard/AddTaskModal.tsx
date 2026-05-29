

import { useState } from "react";

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


export default function AddTaskModal({ open, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [venue, setVenue] = useState("");
  const [repeating, setRepeating] = useState("");
  const [repeatDays, setRepeatDays] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-white">Add Task</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onAdd({ title, date, time, type, venue, repeating, repeatDays });
            setTitle(""); setDate(""); setTime(""); setType(""); setVenue(""); setRepeating(""); setRepeatDays([false, false, false, false, false, false, false]);
            onClose();
          }}
          className="space-y-3"
        >
          <input className="w-full rounded p-2 bg-slate-800 text-white" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <input className="w-full rounded p-2 bg-slate-800 text-white" type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <input className="w-full rounded p-2 bg-slate-800 text-white" type="time" value={time} onChange={e => setTime(e.target.value)} required />
          <input className="w-full rounded p-2 bg-slate-800 text-white" placeholder="Type (e.g. habit, work, personal)" value={type} onChange={e => setType(e.target.value)} />
          <input className="w-full rounded p-2 bg-slate-800 text-white" placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} />
          <select className="w-full rounded p-2 bg-slate-800 text-white" value={repeating} onChange={e => setRepeating(e.target.value)}>
            <option value="">No Repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          {repeating === "weekly" && (
            <div className="flex gap-2 mt-2">
              {weekDays.map((d, i) => (
                <label key={d} className="flex flex-col items-center text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={repeatDays[i]}
                    onChange={() => setRepeatDays((prev) => prev.map((v, idx) => idx === i ? !v : v))}
                  />
                  {d}
                </label>
              ))}
            </div>
          )}
          <div className="flex gap-2 justify-end mt-4">
            <button type="button" className="px-4 py-2 rounded bg-slate-700 text-white" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-emerald-400 text-slate-950 font-semibold">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}
