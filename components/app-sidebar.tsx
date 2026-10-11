"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

const studentNavigation = [
  { label: "Overview", href: "/dashboard", icon: "📊" },
  { label: "Roadmaps", href: "/roadmaps", icon: "🗺️" },
  { label: "Projects", href: "/projects", icon: "💻" },
  { label: "Challenges", href: "/challenges", icon: "⚡" },
  { label: "Jobs", href: "/jobs", icon: "💼" },
  { label: "Applications", href: "/applications", icon: "📑" },
  { label: "Resume", href: "/resume", icon: "📄" },
  { label: "Resources", href: "/resources", icon: "📚" },
  { label: "Events", href: "/events", icon: "🎯" },
];

interface AppSidebarProps {
  profile?: {
    displayName?: string | null;
    avatarUrl?: string | null;
    isRecruiter?: boolean;
  };
}

export function AppSidebar({ profile }: AppSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-[#090D17] md:block">
      <div className="sticky top-0 flex h-screen flex-col">
        {/* Brand */}
        <div className="border-b border-slate-800 px-6 py-5">
          <Link
            href="/dashboard"
            className="text-xl font-bold tracking-tight text-white"
          >
            SkillForge
            <span className="text-blue-500"> AI</span>
          </Link>

          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Learn. Build. Get hired.
            </p>
            {profile?.isRecruiter && (
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-400 border border-purple-500/20">
                Recruiter
              </span>
            )}
          </div>
        </div>

        {/* Recruiter quick switch if recruiter */}
        {profile?.isRecruiter && (
          <div className="px-4 pt-3">
            <Link
              href="/recruiter"
              className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-950/20 px-3 py-2 text-xs font-semibold text-purple-300 transition hover:bg-purple-900/30"
            >
              <span>🏢</span>
              <span>Recruiter Portal →</span>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav
          className="flex-1 space-y-1 overflow-y-auto p-4"
          aria-label="Main navigation"
        >
          {studentNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-blue-500/10 font-medium text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white",
                ].join(" ")}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Account with Visible Uploaded Avatar */}
        <div className="border-t border-slate-800 p-4 space-y-2">
          <Link
            href="/profile"
            className="group flex items-center gap-3 rounded-xl bg-slate-800/50 p-3 transition hover:bg-slate-800"
          >
            {/* Custom Avatar preview */}
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-blue-500/40 bg-slate-800">
              {profile?.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.displayName || "Avatar"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-300">
                  {(profile?.displayName || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                {profile?.displayName || "User Profile"}
              </p>
              <p className="text-[11px] text-slate-400">
                {profile?.isRecruiter ? "Employer Account" : "Student Account"}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20 hover:text-rose-300"
          >
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}