"use client";

import Link from "next/link";
import { Trophy, Code2, ArrowRight } from "lucide-react";

interface ChallengeCardProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard" | string;
    category: string;
    points: number;
  };
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "hard":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="group flex flex-col justify-between p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${getDifficultyBadge(challenge.difficulty)}`}>
            {challenge.difficulty}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
            <Trophy className="w-3.5 h-3.5" />
            <span>{challenge.points} XP</span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors mb-2">
          {challenge.title}
        </h3>

        <p className="text-sm text-zinc-400 line-clamp-2 mb-6">
          {challenge.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800/60">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Code2 className="w-4 h-4 text-zinc-500" />
          <span>{challenge.category}</span>
        </div>

        <Link
          href={`/challenges/${challenge.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          Solve Challenge
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}