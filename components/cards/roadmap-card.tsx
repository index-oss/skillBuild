import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function RoadmapCard({
  roadmap,
}: {
  roadmap: {
    id: string;
    title?: string | null;
    description?: string | null;
  };
}) {
  return (
    <Link href={`/roadmaps/${roadmap.id}`}>
      <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-blue-500/50">
        <Badge variant="blue">Career Roadmap</Badge>

        <h3 className="mt-4 text-lg font-semibold">
          {roadmap.title ?? "Untitled roadmap"}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-slate-400">
          {roadmap.description ?? "Explore this career roadmap."}
        </p>

        <div className="mt-5 text-sm font-medium text-blue-400">
          View roadmap →
        </div>
      </Card>
    </Link>
  );
}