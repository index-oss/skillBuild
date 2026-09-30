import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  _request: Request,
  context: RouteContext,
) {
  const { id } = await context.params;

  return NextResponse.json({
    jobId: id,
    message: "Job status update coming next",
  });
}
