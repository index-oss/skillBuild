import { NextResponse } from "next/server";
import { getJobApplicants } from "@/lib/recruiter/queries";
import { getAuthenticatedProfile, canManageJob } from "@/lib/recruiter/permissions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const allowed = await canManageJob(id);
  if (!allowed) {
    return NextResponse.json(
      { error: "You do not have permission to view applicants for this job" },
      { status: 403 },
    );
  }

  const applicants = await getJobApplicants(id);

  return NextResponse.json({
    jobId: id,
    applicants,
  });
}
