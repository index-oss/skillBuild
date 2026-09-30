import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function ProjectCard({
  project,
}: {
  project: {
    id: string;
    title?: string | null;
    description?: string | null;
    difficulty?: string | null;
  };
}) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-blue-500/50">
        <Badge variant="green">Project</Badge>

        <h3 className="mt-4 text-lg font-semibold">
          {project.title ?? "Untitled project"}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-slate-400">
          {project.description ?? "Explore this project idea."}
        </p>

        {project.difficulty && (
          <div className="mt-5">
            <Badge variant="gray">
              {project.difficulty}
            </Badge>
          </div>
        )}
      </Card>
    </Link>
  );
}