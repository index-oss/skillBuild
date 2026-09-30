import Link from "next/link";
import { notFound } from "next/navigation";
import { getRow, getRows } from "@/lib/data/content";

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const roadmap = await getRow("career_roadmaps", id);

  if (!roadmap) {
    notFound();
  }

  const allSteps = await getRows("roadmap_steps");

  const steps = allSteps.filter(
    (step: any) =>
      step.roadmap_id === id ||
      step.career_roadmap_id === id
  );

  return (
    <div className="p-6 md:p-8">
      <Link
        href="/roadmaps"
        className="text-sm text-blue-400 hover:text-blue-300"
      >
        ← Back to roadmaps
      </Link>

      <div className="mt-6 max-w-4xl">
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
          Career Roadmap
        </span>

        <h1 className="mt-4 text-4xl font-bold">
          {roadmap.title ?? "Untitled roadmap"}
        </h1>

        <p className="mt-4 text-lg text-slate-400">
          {roadmap.description ?? "No description available."}
        </p>
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-2xl font-bold">Roadmap Steps</h2>

        {steps.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
            <p className="text-slate-400">
              Steps for this roadmap have not been added yet.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {steps.map((step: any, index: number) => (
              <div
                key={step.id}
                className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-400">
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {step.title ?? `Step ${index + 1}`}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    {step.description ?? "Continue building this skill."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}