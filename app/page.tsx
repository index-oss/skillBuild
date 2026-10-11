import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-[#070B14] text-white selection:bg-blue-500 selection:text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070B14]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span>SkillForge</span>
            <span className="text-blue-500">AI</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <Link href="/jobs" className="transition hover:text-white">
              Jobs
            </Link>
            <Link href="/roadmaps" className="transition hover:text-white">
              Roadmaps
            </Link>
            <Link href="/projects" className="transition hover:text-white">
              Projects
            </Link>
            <Link href="/challenges" className="transition hover:text-white">
              Challenges
            </Link>
            <Link href="/recruiter" className="text-blue-400 transition hover:text-blue-300">
              For Recruiters →
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {userId ? (
              <Link
                href="/dashboard"
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-28 md:pt-28 md:pb-36">
        {/* Ambient glow backgrounds */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-indigo-600/15 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            AI-Powered Career &amp; Hiring Platform
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            Learn with purpose.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Build real skills.
            </span>{" "}
            Get hired.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            SkillForge AI connects ambitious tech talent with top hiring companies. Follow guided career roadmaps, complete verified engineering challenges, and apply directly to opportunities.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            {userId ? (
              <Link
                href="/dashboard"
                className="rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-500"
              >
                Open Workspace →
              </Link>
            ) : (
              <Link
                href="/sign-up"
                className="rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-500"
              >
                Create Free Account
              </Link>
            )}

            <Link
              href="/jobs"
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm transition hover:border-slate-600 hover:bg-slate-800"
            >
              Browse Open Roles
            </Link>

            <Link
              href="/recruiter"
              className="rounded-2xl border border-blue-500/30 bg-blue-950/30 px-6 py-4 text-base font-semibold text-blue-300 transition hover:bg-blue-900/30"
            >
              Recruiter Hub ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="border-t border-slate-800/80 bg-[#0A0F1D] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
              End-To-End Architecture
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to break into tech
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              A comprehensive system built for modern engineering careers.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl border border-slate-800 bg-[#070B14] p-6 transition hover:border-blue-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
                🗺️
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">Career Roadmaps</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Structured step-by-step learning tracks designed around real engineering roles like Frontend, Backend, AI/ML, and Fullstack.
              </p>
              <Link href="/roadmaps" className="mt-4 inline-block text-xs font-medium text-blue-400 hover:underline">
                Explore roadmaps →
              </Link>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-800 bg-[#070B14] p-6 transition hover:border-blue-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-xl text-purple-400">
                🚀
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">Production Projects</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Portfolio-worthy projects with structured specs and deliverables to turn theoretical knowledge into tangible proof of capability.
              </p>
              <Link href="/projects" className="mt-4 inline-block text-xs font-medium text-purple-400 hover:underline">
                Explore projects →
              </Link>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-800 bg-[#070B14] p-6 transition hover:border-blue-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-400">
                💻
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">Coding Challenges</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Sharpen algorithm and system design skills with graded algorithmic problems tailored to tech interview standards.
              </p>
              <Link href="/challenges" className="mt-4 inline-block text-xs font-medium text-emerald-400 hover:underline">
                Practice challenges →
              </Link>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-slate-800 bg-[#070B14] p-6 transition hover:border-blue-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-xl text-amber-400">
                💼
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">Verified Job Board</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Full-time jobs, internships, and contract positions from verified tech employers with transparent compensation and remote options.
              </p>
              <Link href="/jobs" className="mt-4 inline-block text-xs font-medium text-amber-400 hover:underline">
                View job board →
              </Link>
            </div>

            {/* Card 5 */}
            <div className="rounded-2xl border border-slate-800 bg-[#070B14] p-6 transition hover:border-blue-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-xl text-cyan-400">
                ⚡
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">Application Tracking</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Track every stage of your candidacy from initial submission, review, shortlisting, to interview schedules in one central dashboard.
              </p>
              <Link href="/applications" className="mt-4 inline-block text-xs font-medium text-cyan-400 hover:underline">
                Track applications →
              </Link>
            </div>

            {/* Card 6 */}
            <div className="rounded-2xl border border-slate-800 bg-[#070B14] p-6 transition hover:border-blue-500/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-xl text-rose-400">
                🏢
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">Recruiter Workspace</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Comprehensive hiring dashboard for recruiters and company admins to publish opportunities, manage candidates, and accelerate hiring.
              </p>
              <Link href="/recruiter" className="mt-4 inline-block text-xs font-medium text-rose-400 hover:underline">
                Recruiter portal →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Students vs For Recruiters */}
      <section className="border-t border-slate-800/80 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Student Side */}
            <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/20 to-[#0B1120] p-8 md:p-10">
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                For Students &amp; Developers
              </span>
              <h3 className="mt-4 text-2xl font-bold text-white">
                From self-taught to hire-ready
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Stop wondering what to learn next. Follow structured tracks, build verifiable portfolio code, and apply directly to companies hiring talent like you.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Free access to guided career roadmaps
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Real-world challenge evaluation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> 1-click verified profile job applications
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  href="/dashboard"
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Start Learning Today →
                </Link>
              </div>
            </div>

            {/* Recruiter Side */}
            <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 to-[#0B1120] p-8 md:p-10">
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                For Employers &amp; Recruiters
              </span>
              <h3 className="mt-4 text-2xl font-bold text-white">
                Hire candidates with verified capability
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Post jobs, review applicant submissions, and progress candidates through a structured hiring funnel with live candidate intelligence.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Publish &amp; manage unlimited openings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Comprehensive candidate pipeline management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Direct company team role-based access
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  href="/recruiter"
                  className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500"
                >
                  Enter Recruiter Workspace →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#070B14] px-6 py-12 text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <span className="text-base font-bold text-white">SkillForge AI</span>
            <p className="mt-1 text-xs text-slate-500">
              © {new Date().getFullYear()} SkillForge AI. Learn, build, and get hired.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs">
            <Link href="/jobs" className="hover:text-white">
              Jobs
            </Link>
            <Link href="/roadmaps" className="hover:text-white">
              Roadmaps
            </Link>
            <Link href="/projects" className="hover:text-white">
              Projects
            </Link>
            <Link href="/challenges" className="hover:text-white">
              Challenges
            </Link>
            <Link href="/recruiter" className="hover:text-white">
              Recruiters
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}