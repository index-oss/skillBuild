import Link from "next/link";
import { getRows } from "@/lib/data/content";

export default async function EventsPage() {
  const events = await getRows("events");

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <p className="text-sm text-blue-400">Community</p>

        <h1 className="mt-2 text-3xl font-bold">
          Tech Events
        </h1>

        <p className="mt-2 text-slate-400">
          Find upcoming conferences, meetups, hackathons, and other tech
          events.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center text-slate-400">
          No upcoming events available.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {events.map((event: any) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 hover:border-blue-500"
            >
              <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs text-orange-400">
                {event.event_type ?? "Event"}
              </span>

              <h2 className="mt-4 text-xl font-semibold">
                {event.title ?? "Untitled event"}
              </h2>

              <p className="mt-3 line-clamp-3 text-sm text-slate-400">
                {event.description ?? "Technology event"}
              </p>

              {event.location_city && (
                <p className="mt-4 text-sm text-slate-500">
                  📍 {event.location_city}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}