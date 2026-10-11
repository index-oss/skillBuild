import Link from "next/link";

type DashboardCardProps = {
  title: string;
  description: string;
  href: string;
  icon: string;
};

export function DashboardCard({
  title,
  description,
  href,
  icon,
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-[#0D1422] p-6 transition hover:-translate-y-1 hover:border-blue-400/40 hover:bg-[#111A2C]"
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-semibold text-blue-400">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>

      <div className="mt-6 text-sm font-medium text-blue-400 transition group-hover:translate-x-1">
        Explore →
      </div>
    </Link>
  );
}