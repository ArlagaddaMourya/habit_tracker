import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { getJournalEntry, upsertJournalEntry } from "@/lib/db";

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function Journal() {
  const today = getToday();
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getJournalEntry(today)
      .then((entry) => {
        if (entry) {
          setContent(entry.content);
          setSavedContent(entry.content);
        }
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [today]);

  const save = async (text: string) => {
    if (text === savedContent) return;
    setSaving(true);
    try {
      await upsertJournalEntry(today, text);
      setSavedContent(text);
      setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (text: string) => {
    setContent(text);
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => save(text), 1500);
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading journal…</p>;
  if (error) return <p className="text-sm text-destructive">{error}</p>;

  const isDirty = content !== savedContent;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-card-foreground">Journal</h4>
          <p className="text-xs text-muted-foreground">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && !isDirty && (
            <span className="text-xs text-muted-foreground">Saved {lastSaved}</span>
          )}
          <Button
            size="sm"
            disabled={!isDirty || saving}
            onClick={() => save(content)}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        rows={12}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none resize-y placeholder:text-muted-foreground focus:ring-2 focus:ring-ring leading-relaxed"
        placeholder="Write about your day… (auto-saves after you stop typing)"
      />
    </div>
  );
}
