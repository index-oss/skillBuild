import Link from "next/link";
import { notFound } from "next/navigation";
import { getRow } from "@/lib/data/content";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const resource = await getRow("resources", id);

  if (!resource) {
    notFound();
  }

  return (
    <div className="p-6 md:p-8">
      <Link
        href="/resources"
        className="text-sm text-blue-400"
      >
        ← Back to resources
      </Link>

      <div className="mt-6 max-w-4xl">
        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
          {resource.resource_type ?? "Resource"}
        </span>

        <h1 className="mt-4 text-4xl font-bold">
          {resource.title ?? "Untitled resource"}
        </h1>

        <p className="mt-5 whitespace-pre-wrap text-lg leading-8 text-slate-400">
          {resource.description ?? "No description available."}
        </p>

        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
          >
            Open resource →
          </a>
        )}
      </div>
    </div>
  );
}