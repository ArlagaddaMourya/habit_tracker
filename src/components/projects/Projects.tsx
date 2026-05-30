import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProjects, createProject, deleteProject } from "@/lib/db";
import type { Project } from "../../types";
import { Trash2, Plus, X } from "lucide-react";

const STATUS_OPTIONS: Project["status"][] = ["planning", "in-progress", "completed"];

const statusColor: Record<Project["status"], string> = {
  planning: "text-muted-foreground",
  "in-progress": "text-primary",
  completed: "text-primary",
};

function AddProjectModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Project) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [plan, setPlan] = useState("");
  const [techStack, setTechStack] = useState("");
  const [useCase, setUseCase] = useState("");
  const [purpose, setPurpose] = useState("");
  const [status, setStatus] = useState<Project["status"]>("planning");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const project = await createProject({
      title: title.trim(),
      description: description.trim(),
      plan: plan.trim(),
      techStack: techStack.split(",").map((s) => s.trim()).filter(Boolean),
      useCase: useCase.trim(),
      purpose: purpose.trim(),
      status,
    });
    onAdd(project);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-card-foreground">New Project</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
          <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input placeholder="Plan" value={plan} onChange={(e) => setPlan(e.target.value)} />
          <Input placeholder="Tech stack (comma-separated)" value={techStack} onChange={(e) => setTechStack(e.target.value)} />
          <Input placeholder="Use case" value={useCase} onChange={(e) => setUseCase(e.target.value)} />
          <Input placeholder="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Project["status"])}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await deleteProject(id).catch(console.error);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) return <p className="text-sm text-muted-foreground p-6">Loading projects…</p>;
  if (error) return <p className="text-sm text-destructive p-6">{error}</p>;

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <p className="text-xs text-muted-foreground">Projects</p>
          <h3 className="mt-1 text-xl font-semibold text-card-foreground">Implementable Projects</h3>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={14} />
          New project
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects yet. Add your first one.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="group rounded-lg border border-border bg-background p-5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-foreground">{project.title}</h4>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive mt-0.5"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              {project.description && <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>}
              <p className={`mt-2 text-xs font-medium capitalize ${statusColor[project.status]}`}>{project.status}</p>
              <div className="mt-3 space-y-2">
                {project.plan && (
                  <div>
                    <p className="text-xs font-semibold text-foreground">Plan</p>
                    <p className="text-xs text-muted-foreground">{project.plan}</p>
                  </div>
                )}
                {project.techStack.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-foreground">Stack</p>
                    <p className="text-xs text-muted-foreground">{project.techStack.join(", ")}</p>
                  </div>
                )}
                {project.useCase && (
                  <div>
                    <p className="text-xs font-semibold text-foreground">Use case</p>
                    <p className="text-xs text-muted-foreground">{project.useCase}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <AddProjectModal
          onClose={() => setShowAdd(false)}
          onAdd={(p) => setProjects((prev) => [p, ...prev])}
        />
      )}
    </div>
  );
}
