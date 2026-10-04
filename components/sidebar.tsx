"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useClerk } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Code2, 
  FolderGit2, 
  LogOut,
  User 
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Resume", href: "/resume", icon: FileText },
    { name: "Challenges", href: "/challenges", icon: Code2 },
    { name: "Projects", href: "/projects", icon: FolderGit2 },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col justify-between h-screen sticky top-0 p-4">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <h2 className="text-xl font-bold text-white tracking-wider">SkillForge</h2>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/sign-in" />
          <span className="text-xs text-zinc-400 font-medium">Account</span>
        </div>
        <button
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
