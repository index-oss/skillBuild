import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function ChallengeCard({
  challenge,
}: {
  challenge: {
    id: string;
    title?: string | null;
    description?: string | null;
    difficulty?: string | null;
  };
}) {
  return (
    <Link href={`/challenges/${challenge.id}`}>
      <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-blue-500/50">
        <Badge variant="yellow">Coding Challenge</Badge>

        <h3 className="mt-4 text-lg font-semibold">
          {challenge.title ?? "Untitled challenge"}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-slate-400">
          {challenge.description ?? "Practice this coding challenge."}
        </p>

        {challenge.difficulty && (
          <div className="mt-5">
            <Badge variant="gray">
              {challenge.difficulty}
            </Badge>
          </div>
        )}
      </Card>
    </Link>
  );
}