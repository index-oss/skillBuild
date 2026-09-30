import Link from "next/link";
import { getRows } from "@/lib/data/content";

export default async function ProjectsPage() {
  const projects = await getRows("project_ideas");

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <p className="text-sm text-blue-400">Build your portfolio</p>
        <h1 className="mt-2 text-3xl font-bold">Project Ideas</h1>
        <p className="mt-2 text-slate-400">
          Find practical projects that help you turn learning into portfolio
          evidence.
        </p>
      </div>

      {projects.length === 0 ? (
        <EmptyState text="No project ideas available yet." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project: any) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 hover:border-blue-500"
            >
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
                {project.difficulty ?? "Project"}
              </span>

              <h2 className="mt-4 text-xl font-semibold">
                {project.title ?? "Untitled project"}
              </h2>

              <p className="mt-3 line-clamp-3 text-sm text-slate-400">
                {project.description ?? "Build this project to practice."}
              </p>

              <div className="mt-5 text-sm text-blue-400">
                View project →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">
      {text}
    </div>
  );
}