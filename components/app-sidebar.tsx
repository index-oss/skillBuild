"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const navigation = [
  {
    label: "Overview",
    href: "/dashboard",
  },
  {
    label: "Roadmaps",
    href: "/roadmaps",
  },
  {
    label: "Projects",
    href: "/projects",
  },
  {
    label: "Challenges",
    href: "/challenges",
  },
  {
    label: "Jobs",
    href: "/jobs",
  },
  {
    label: "Applications",
    href: "/applications",
  },
  {
    label: "Resume",
    href: "/resume",
  },
  {
    label: "Resources",
    href: "/resources",
  },
  {
    label: "Events",
    href: "/events",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-[#090D17] md:block">
      <div className="sticky top-0 flex h-screen flex-col">
        {/* Brand */}
        <div className="border-b border-slate-800 px-6 py-5">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tight"
          >
            SkillForge
            <span className="text-blue-500"> AI</span>
          </Link>

          <p className="mt-1 text-xs text-slate-500">
            Learn. Build. Get hired.
          </p>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 space-y-1 overflow-y-auto p-4"
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "block rounded-xl px-4 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Account */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-3">
            <UserButton />

            <div className="min-w-0">
              <p className="text-sm font-medium text-white">
                Account
              </p>

              <Link
                href="/profile"
                className="text-xs text-slate-500 transition-colors hover:text-blue-400"
              >
                View profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}