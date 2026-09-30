import Link from "next/link";
import { getRows } from "@/lib/data/content";

export const dynamic = "force-dynamic";
export default async function ResourcesPage() {
  const resources = await getRows("resources");

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm text-blue-400">Keep learning</p>

          <h1 className="mt-2 text-3xl font-bold">
            Learning Resources
          </h1>

          <p className="mt-2 text-slate-400">
            Discover courses, videos, documentation, and useful learning
            materials.
          </p>
        </div>

        <Link
          href="/resources/submit"
          className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold hover:bg-blue-500"
        >
          Share a resource
        </Link>
      </div>

      {resources.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">
          No published resources yet.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource: any) => (
            <Link
              key={resource.id}
              href={`/resources/${resource.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 hover:border-blue-500"
            >
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                {resource.resource_type ?? "Resource"}
              </span>

              <h2 className="mt-4 text-xl font-semibold">
                {resource.title ?? "Untitled resource"}
              </h2>

              <p className="mt-3 line-clamp-3 text-sm text-slate-400">
                {resource.description ?? "Learning resource"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
