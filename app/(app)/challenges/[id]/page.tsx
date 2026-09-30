import Link from "next/link";
import { notFound } from "next/navigation";
import { getRow } from "@/lib/data/content";

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const challenge = await getRow("challenges", id);

  if (!challenge) {
    notFound();
  }

  return (
    <div className="p-6 md:p-8">
      <Link
        href="/challenges"
        className="text-sm text-blue-400"
      >
        ← Back to challenges
      </Link>

      <div className="mt-6 max-w-4xl">
        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
          {challenge.difficulty ?? "Challenge"}
        </span>

        <h1 className="mt-4 text-4xl font-bold">
          {challenge.title ?? "Untitled challenge"}
        </h1>

        <p className="mt-5 whitespace-pre-wrap text-lg leading-8 text-slate-400">
          {challenge.description ?? "No challenge description available."}
        </p>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold">Your submission</h2>

          <p className="mt-2 text-sm text-slate-400">
            Submission interface will be expanded with language selection,
            code execution, and test results.
          </p>

          <div className="mt-5 rounded-xl bg-slate-950 p-5 font-mono text-sm text-slate-500">
            // Your code editor will appear here
          </div>
        </div>
      </div>
    </div>
  );
}