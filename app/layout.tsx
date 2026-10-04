import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Briefcase, FileText, Map, Trophy, LayoutDashboard, Calendar, BookOpen, Building2 } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-white tracking-wide">
            <span className="bg-blue-600 text-white p-1.5 rounded-lg">SF</span>
            SkillForge <span className="text-blue-500 text-xs px-2 py-0.5 bg-blue-950 border border-blue-800 rounded-full">AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/dashboard" className="hover:text-white transition flex items-center gap-1.5">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/roadmaps" className="hover:text-white transition flex items-center gap-1.5">
              <Map className="w-4 h-4" /> Roadmaps
            </Link>
            <Link href="/projects" className="hover:text-white transition flex items-center gap-1.5">
              <Trophy className="w-4 h-4" /> Projects
            </Link>
            <Link href="/jobs" className="hover:text-white transition flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" /> Jobs
            </Link>
            <Link href="/applications" className="hover:text-white transition flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Applications
            </Link>
            <Link href="/resume" className="hover:text-white transition flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Resume
            </Link>
            <Link href="/resources" className="hover:text-white transition flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Resources
            </Link>
            <Link href="/events" className="hover:text-white transition flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Events
            </Link>
          </nav>
        </div>

        {/* User Profile / Sign Out Button */}
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/sign-in" appearance={{ elements: { avatarBox: "w-9 h-9 rounded-lg" } }} />
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}