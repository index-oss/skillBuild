import Link from "next/link";
import { getRows } from "@/lib/data/content";

export default async function RoadmapsPage() {
  const roadmaps = await getRows("career_roadmaps");

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <p className="text-sm text-blue-400">
          Career development
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Career Roadmaps
        </h1>

        <p className="mt-2 text-slate-400">
          Follow structured paths to build the skills required
          for your target career.
        </p>
      </div>

      {roadmaps.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
          <h2 className="text-xl font-semibold">
            No roadmaps yet
          </h2>

          <p className="mt-2 text-slate-400">
            Career roadmaps will appear here once they are
            published.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {roadmaps.map((roadmap: any) => (
            <Link
              key={roadmap.id}
              href={`/roadmaps/${roadmap.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition hover:border-blue-500 hover:bg-slate-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                  Roadmap
                </span>

                <span className="text-slate-500">
                  →
                </span>
              </div>

              <h2 className="text-xl font-semibold">
                {roadmap.title ?? "Untitled roadmap"}
              </h2>

              <p className="mt-3 line-clamp-3 text-sm text-slate-400">
                {roadmap.description ??
                  "Explore this career roadmap."}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}