import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Job = {
  id: string;
  title?: string | null;
  company_name?: string | null;
  location_city?: string | null;
  location_country?: string | null;
  job_type?: string | null;
  work_mode?: string | null;
};

export function JobCard({
  job,
}: {
  job: Job;
}) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-blue-500/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-white">
              {job.title ?? "Untitled position"}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {job.company_name ?? "Company"}
            </p>
          </div>

          <span className="text-slate-500">→</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {job.job_type && (
            <Badge variant="blue">
              {job.job_type}
            </Badge>
          )}

          {job.work_mode && (
            <Badge variant="gray">
              {job.work_mode}
            </Badge>
          )}
        </div>

        {(job.location_city || job.location_country) && (
          <p className="mt-4 text-sm text-slate-500">
            {job.location_city}
            {job.location_city && job.location_country ? ", " : ""}
            {job.location_country}
          </p>
        )}
      </Card>
    </Link>
  );
}