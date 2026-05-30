import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLearnings, createLearning, deleteLearning } from "@/lib/db";
import type { Learning } from "../../types";
import { Trash2, Plus, X } from "lucide-react";

function AddLearningModal({ onClose, onAdd }: { onClose: () => void; onAdd: (l: Learning) => void }) {
  const [topic, setTopic] = useState("");
  const [resource, setResource] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const learning = await createLearning({
      topic: topic.trim(),
      resource: resource.trim(),
      prerequisites: prerequisites.trim(),
      notes: notes.trim() || undefined,
    });
    onAdd(learning);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-card-foreground">Add Resource</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="Topic *" value={topic} onChange={(e) => setTopic(e.target.value)} required autoFocus />
          <Input placeholder="Resource URL or name" value={resource} onChange={(e) => setResource(e.target.value)} />
          <Input placeholder="Prerequisites" value={prerequisites} onChange={(e) => setPrerequisites(e.target.value)} />
          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none resize-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm">Add</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Learnings() {
  const [learnings, setLearnings] = useState<Learning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    getLearnings()
      .then(setLearnings)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await deleteLearning(id).catch(console.error);
    setLearnings((prev) => prev.filter((l) => l.id !== id));
  };

  if (loading) return <p className="text-sm text-muted-foreground p-6">Loading learnings…</p>;
  if (error) return <p className="text-sm text-destructive p-6">{error}</p>;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <p className="text-xs text-muted-foreground">Learnings</p>
          <h3 className="mt-1 text-xl font-semibold text-card-foreground">Knowledge Tiles</h3>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={14} />
          Add resource
        </Button>
      </div>

      {learnings.length === 0 ? (
        <p className="text-sm text-muted-foreground">No learning resources yet. Add your first one.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {learnings.map((item) => (
            <div key={item.id} className="group rounded-lg border border-border bg-background p-5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-foreground">{item.topic}</h4>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive mt-0.5"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              {item.resource && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.resource.startsWith("http") ? (
                    <a
                      href={item.resource}
                      className="text-primary underline underline-offset-2 break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.resource}
                    </a>
                  ) : (
                    item.resource
                  )}
                </p>
              )}
              {item.prerequisites && (
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Prerequisites: </span>
                  {item.prerequisites}
                </p>
              )}
              {item.notes && (
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Notes: </span>
                  {item.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddLearningModal
          onClose={() => setShowAdd(false)}
          onAdd={(l) => setLearnings((prev) => [l, ...prev])}
        />
      )}
    </div>
  );
}
