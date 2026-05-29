// Notepad main component
import { useState } from "react";
import Notes from "./Notes";
import Ideas from "./Ideas";
import Journal from "./Journal";

const tabs = ["Notes", "Ideas", "Journal"];

export default function Notepad() {
  const [activeTab, setActiveTab] = useState("Notes");

  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <p className="text-sm text-slate-400">Notepad</p>
          <h3 className="mt-2 text-2xl font-semibold">Notes, Ideas & Journal</h3>
        </div>
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-3xl px-4 py-2 text-sm font-semibold transition border border-white/10 ${activeTab === tab ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-200 hover:bg-slate-700"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        {activeTab === "Notes" && <Notes />}
        {activeTab === "Ideas" && <Ideas />}
        {activeTab === "Journal" && <Journal />}
      </div>
    </section>
  );
}
