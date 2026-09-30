import Link from "next/link";
import { notFound } from "next/navigation";
import { getRow } from "@/lib/data/content";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await getRow("project_ideas", id);

  if (!project) {
    notFound();
  }

  return (
    <div className="p-6 md:p-8">
      <Link
        href="/projects"
        className="text-sm text-blue-400 hover:text-blue-300"
      >
        ← Back to projects
      </Link>

      <div className="mt-6 max-w-4xl">
        <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
          {project.difficulty ?? "Project"}
        </span>

        <h1 className="mt-4 text-4xl font-bold">
          {project.title ?? "Untitled project"}
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-400">
          {project.description ?? "No description available."}
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold">Project Details</h2>

          <p className="mt-3 text-slate-400">
            Use this project to demonstrate your practical skills and build
            portfolio evidence.
          </p>
        </div>
      </div>
    </div>
  );
}