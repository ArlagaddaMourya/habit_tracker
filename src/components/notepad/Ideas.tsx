import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getIdeas, createIdea, deleteIdea } from "@/lib/db";
import type { Idea } from "../../types";
import { Trash2, Plus } from "lucide-react";

const STATUS_OPTIONS: Idea["status"][] = ["new", "exploring", "started", "parked"];

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Idea["status"]>("new");

  useEffect(() => {
    getIdeas()
      .then(setIdeas)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const idea = await createIdea({ title: title.trim(), description: description.trim(), status });
    setIdeas((prev) => [idea, ...prev]);
    setTitle("");
    setDescription("");
    setStatus("new");
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    await deleteIdea(id).catch(console.error);
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading ideas…</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-card-foreground">Ideas</h4>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          <Plus size={14} />
          New idea
        </Button>
      </div>

      {adding && (
        <form onSubmit={handleCreate} className="mb-4 rounded-lg border border-border bg-background p-4 space-y-2">
          <Input
            placeholder="Idea title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none resize-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Idea["status"])}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="flex gap-2 justify-end">
            <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        </form>
      )}

      {ideas.length === 0 && !adding ? (
        <p className="text-sm text-muted-foreground">No ideas yet. Capture one above.</p>
      ) : (
        <div className="space-y-3">
          {ideas.map((idea) => (
            <div key={idea.id} className="group rounded-lg border border-border bg-background p-4 flex gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{idea.title}</p>
                {idea.description && <p className="mt-1 text-sm text-muted-foreground">{idea.description}</p>}
                <span className="mt-1.5 inline-block text-xs font-medium text-primary capitalize">{idea.status}</span>
              </div>
              <button
                onClick={() => handleDelete(idea.id)}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
