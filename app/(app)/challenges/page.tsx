import Link from "next/link";
import { getRows } from "@/lib/data/content";

export default async function ChallengesPage() {
  const challenges = await getRows("challenges");

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <p className="text-sm text-blue-400">Practice</p>
        <h1 className="mt-2 text-3xl font-bold">Coding Challenges</h1>
        <p className="mt-2 text-slate-400">
          Strengthen your problem-solving skills with coding practice.
        </p>
      </div>

      {challenges.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">
          No coding challenges available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {challenges.map((challenge: any) => (
            <Link
              key={challenge.id}
              href={`/challenges/${challenge.id}`}
              className="block rounded-2xl border border-slate-800 bg-slate-900/70 p-6 hover:border-blue-500"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <h2 className="text-xl font-semibold">
                    {challenge.title ?? "Untitled challenge"}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {challenge.description ?? "Practice this challenge."}
                  </p>
                </div>

                <span className="h-fit rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                  {challenge.difficulty ?? "Practice"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}