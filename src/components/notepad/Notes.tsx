import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getNotes, createNote, deleteNote } from "@/lib/db";
import type { Note } from "../../types";
import { Trash2, Plus } from "lucide-react";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    getNotes()
      .then(setNotes)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const note = await createNote({ title: title.trim(), content: content.trim() });
    setNotes((prev) => [note, ...prev]);
    setTitle("");
    setContent("");
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id).catch(console.error);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading notes…</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-card-foreground">Notes</h4>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}>
          <Plus size={14} />
          New note
        </Button>
      </div>

      {adding && (
        <form onSubmit={handleCreate} className="mb-4 rounded-lg border border-border bg-background p-4 space-y-2">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
          />
          <textarea
            placeholder="Content (optional)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-foreground outline-none resize-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        </form>
      )}

      {notes.length === 0 && !adding ? (
        <p className="text-sm text-muted-foreground">No notes yet. Create one above.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="group rounded-lg border border-border bg-background p-4 flex gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{note.title}</p>
                {note.content && <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{note.content}</p>}
                <p className="mt-1.5 text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
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
