import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    applications: [],
  });
}

export async function PATCH() {
  return NextResponse.json({
    message: "Application status update coming next",
  });
}
