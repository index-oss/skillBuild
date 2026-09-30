import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function EventCard({
  event,
}: {
  event: {
    id: string;
    title?: string | null;
    description?: string | null;
    event_type?: string | null;
    location_city?: string | null;
  };
}) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:border-blue-500/50">
        <Badge variant="green">
          {event.event_type ?? "Event"}
        </Badge>

        <h3 className="mt-4 text-lg font-semibold">
          {event.title ?? "Untitled event"}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-slate-400">
          {event.description ?? "Explore this tech event."}
        </p>

        {event.location_city && (
          <p className="mt-4 text-sm text-slate-500">
            📍 {event.location_city}
          </p>
        )}
      </Card>
    </Link>
  );
}