// Journal subsection
import { useState } from "react";
import type { JournalEntry } from "../../types";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

const dummyJournal: JournalEntry[] = [
  { id: "1", date: getToday(), content: "Felt productive, completed dashboard layout.", createdAt: getToday(), updatedAt: getToday() },
];

export default function Journal() {
  const [journal] = useState<JournalEntry[]>(dummyJournal);
  const today = getToday();
  const todayEntry = journal.find((j) => j.date === today);
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2 text-white">Journal</h4>
      <div className="space-y-3">
        <div className="rounded-[20px] border border-white/10 bg-slate-950/90 p-4">
          <div className="font-semibold text-slate-100">{today}</div>
          <div className="mt-1 text-slate-400 text-sm">{todayEntry ? todayEntry.content : "No entry for today."}</div>
        </div>
      </div>
    </div>
  );
}
