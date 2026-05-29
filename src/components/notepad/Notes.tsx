// Notes subsection
import { useState } from "react";
import type { Note } from "../../types";

const dummyNotes: Note[] = [
  { id: "1", title: "Morning planning", content: "Review the habit tracker goals and set today’s top 3 tasks.", section: "notes", createdAt: "2026-05-29", updatedAt: "2026-05-29" },
];

export default function Notes() {
  const [notes] = useState<Note[]>(dummyNotes);
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2 text-white">Notes</h4>
      <div className="space-y-3">
        {notes.length ? notes.map((note) => (
          <div key={note.id} className="rounded-[20px] border border-white/10 bg-slate-950/90 p-4">
            <div className="font-semibold text-slate-100">{note.title}</div>
            <div className="mt-1 text-slate-400 text-sm">{note.content}</div>
          </div>
        )) : <div className="text-slate-400">No notes yet.</div>}
      </div>
    </div>
  );
}
