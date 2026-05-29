// Projects main component
import { useState } from "react";
import type { Project } from "../../types";

const dummyProjects: Project[] = [
  {
    id: "1",
    title: "Portfolio refresh",
    description: "Personal website redesign",
    plan: "Redesign UI, add blog, deploy to Vercel",
    techStack: ["React", "TailwindCSS", "Vercel"],
    useCase: "Showcase work and blog",
    purpose: "Professional presence",
    status: "planning",
    createdAt: "2026-05-29",
    updatedAt: "2026-05-29",
  },
  {
    id: "2",
    title: "Habit engine",
    description: "Recurring check-ins for habits",
    plan: "Implement streak logic, reminders, and analytics",
    techStack: ["React", "SQLite", "Tauri"],
    useCase: "Track and reinforce habits",
    purpose: "Personal growth",
    status: "in-progress",
    createdAt: "2026-05-29",
    updatedAt: "2026-05-29",
  },
];

export default function Projects() {
  const [projects] = useState<Project[]>(dummyProjects);
  return (
    <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <p className="text-sm text-slate-400">Projects</p>
          <h3 className="mt-2 text-2xl font-semibold">Implementable Projects</h3>
        </div>
        <button className="rounded-3xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/10">
          New project
        </button>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length ? projects.map((project) => (
          <div key={project.id} className="rounded-[28px] border border-white/10 bg-slate-950/90 p-5">
            <h4 className="font-semibold text-slate-100 text-lg">{project.title}</h4>
            <div className="mt-1 text-slate-400 text-sm">{project.description}</div>
            <div className="mt-2 text-xs text-emerald-400">Status: {project.status}</div>
            <div className="mt-3">
              <div className="font-semibold text-slate-200">Plan</div>
              <div className="text-slate-400 text-sm">{project.plan}</div>
            </div>
            <div className="mt-3">
              <div className="font-semibold text-slate-200">Tech Stack</div>
              <div className="text-slate-400 text-sm">{project.techStack.join(", ")}</div>
            </div>
            <div className="mt-3">
              <div className="font-semibold text-slate-200">Use Case</div>
              <div className="text-slate-400 text-sm">{project.useCase}</div>
            </div>
            <div className="mt-3">
              <div className="font-semibold text-slate-200">Purpose</div>
              <div className="text-slate-400 text-sm">{project.purpose}</div>
            </div>
          </div>
        )) : <div className="text-slate-400">No projects yet.</div>}
      </div>
    </section>
  );
}
