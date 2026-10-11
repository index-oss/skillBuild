import Link from "next/link";
import { notFound } from "next/navigation";
import { getRow } from "@/lib/data/content";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await getRow("events", id);

  if (!event) {
    notFound();
  }

  return (
    <div className="p-6 md:p-8">
      <Link
        href="/events"
        className="text-sm text-blue-400"
      >
        ← Back to events
      </Link>

      <div className="mt-6 max-w-4xl">
        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
          {event.event_type ?? "Event"}
        </span>

        <h1 className="mt-4 text-4xl font-bold">
          {event.title ?? "Untitled event"}
        </h1>

        <p className="mt-5 whitespace-pre-wrap text-lg leading-8 text-slate-400">
          {event.description ?? "No description available."}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-500">Location</p>

            <p className="mt-2 text-slate-300">
              {[
                event.location_city,
                event.location_state,
                event.location_country,
              ]
                .filter(Boolean)
                .join(", ") || "Online / location not specified"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-500">Date</p>

            <p className="mt-2 text-slate-300">
              {event.starts_at
                ? new Date(event.starts_at).toLocaleString()
                : event.event_date
                  ? String(event.event_date)
                  : "Date not specified"}
            </p>
          </div>
        </div>

        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
          >
            Register / Learn more →
          </a>
        )}
      </div>
    </div>
  );
}