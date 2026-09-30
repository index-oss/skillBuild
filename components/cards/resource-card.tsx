import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function ResourceCard({
  resource,
}: {
  resource: {
    id: string;
    title?: string | null;
    description?: string | null;
    resource_type?: string | null;
  };
}) {
  return (
    <Link href={`/resources/${resource.id}`}>
      <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-blue-500/50">
        <Badge variant="blue">
          {resource.resource_type ?? "Resource"}
        </Badge>

        <h3 className="mt-4 text-lg font-semibold">
          {resource.title ?? "Untitled resource"}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-slate-400">
          {resource.description ?? "Explore this learning resource."}
        </p>
      </Card>
    </Link>
  );
}