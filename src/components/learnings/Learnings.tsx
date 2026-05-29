// Learnings main component
import { useState } from "react";
import type { Learning } from "../../types";

const dummyLearnings: Learning[] = [
  {
    id: "1",
    topic: "Python notes",
    resource: "https://docs.python.org/3/tutorial/",
    prerequisites: "Basic programming",
    notes: "Portfolio + automation",
    createdAt: "2026-05-29",
  },
  {
    id: "2",
    topic: "Study plan",
    resource: "https://leetcode.com/",
    prerequisites: "Data structures, algorithms",
    notes: "Interview + learning",
    createdAt: "2026-05-29",
  },
];

export default function Learnings() {
  const [learnings] = useState<Learning[]>(dummyLearnings);
  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <p className="text-sm text-slate-400">Learnings</p>
          <h3 className="mt-2 text-2xl font-semibold">Knowledge Tiles</h3>
        </div>
        <button className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">
          Add resource
        </button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {learnings.length ? learnings.map((item) => (
          <div key={item.id} className="rounded-[28px] border border-white/10 bg-slate-950/90 p-5">
            <h4 className="font-semibold text-slate-100 text-lg">{item.topic}</h4>
            <div className="mt-1 text-slate-400 text-sm">Resource: <a href={item.resource} className="text-emerald-400 underline" target="_blank" rel="noopener noreferrer">{item.resource}</a></div>
            <div className="mt-2 text-xs text-slate-400">Prerequisites: {item.prerequisites}</div>
            {item.notes && <div className="mt-2 text-xs text-slate-400">Notes: {item.notes}</div>}
          </div>
        )) : <div className="text-slate-400">No learnings yet.</div>}
      </div>
    </section>
  );
}
