import React from "react";

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">Challenge Details</h1>
      <p className="text-zinc-400 text-sm">Challenge ID: {id}</p>
    </div>
  );
}
