import { useState } from "react";
import Notes from "./Notes";
import Ideas from "./Ideas";
import Journal from "./Journal";
import { Button } from "@/components/ui/button";

const tabs = ["Notes", "Ideas", "Journal"];

export default function Notepad() {
  const [activeTab, setActiveTab] = useState("Notes");

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <p className="text-xs text-muted-foreground">Notepad</p>
          <h3 className="mt-1 text-xl font-semibold text-card-foreground">Notes, Ideas &amp; Journal</h3>
        </div>
        <div className="flex gap-1.5">
          {tabs.map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>
      <div>
        {activeTab === "Notes" && <Notes />}
        {activeTab === "Ideas" && <Ideas />}
        {activeTab === "Journal" && <Journal />}
      </div>
    </div>
  );
}
