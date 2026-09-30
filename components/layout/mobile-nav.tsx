"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Home", href: "/dashboard" },
  { label: "Jobs", href: "/jobs" },
  { label: "Roadmaps", href: "/roadmaps" },
  { label: "Projects", href: "/projects" },
  { label: "Challenges", href: "/challenges" },
  { label: "Resources", href: "/resources" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-[#070B14]/95 px-2 py-2 backdrop-blur md:hidden">
      <div className="grid grid-cols-6 gap-1">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-xl px-1 py-2 text-center text-[10px] transition",
                active
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-slate-500 hover:text-white",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}