// Ideas subsection
import { useState } from "react";
import type { Idea } from "../../types";

const dummyIdeas: Idea[] = [
  { id: "1", title: "Gamify streaks", description: "Add badges for 7, 14, 30 day streaks.", status: "exploring", tags: ["gamification"], createdAt: "2026-05-29" },
];

export default function Ideas() {
  const [ideas] = useState<Idea[]>(dummyIdeas);
  return (
    <div>
      <h4 className="text-lg font-semibold mb-2 text-white">Ideas</h4>
      <div className="space-y-3">
        {ideas.length ? ideas.map((idea) => (
          <div key={idea.id} className="rounded-[20px] border border-white/10 bg-slate-950/90 p-4">
            <div className="font-semibold text-slate-100">{idea.title}</div>
            <div className="mt-1 text-slate-400 text-sm">{idea.description}</div>
            <div className="mt-1 text-xs text-emerald-400">Status: {idea.status}</div>
          </div>
        )) : <div className="text-slate-400">No ideas yet.</div>}
      </div>
    </div>
  );
}
