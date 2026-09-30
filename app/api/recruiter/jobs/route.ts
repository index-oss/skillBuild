import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    jobs: [],
  });
}

export async function POST() {
  return NextResponse.json(
    { error: "Job creation coming next" },
    { status: 501 },
  );
}
