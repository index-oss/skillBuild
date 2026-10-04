import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Briefcase, FileText, Map, Trophy, ArrowRight } from 'lucide-react';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = await createSupabaseServerClient();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('clerk_user_id', userId)
    .single();

  let applicationsCount = 0;
  let roadmapsCount = 0;

  if (profile) {
    const { count: appCount } = await supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id);

    applicationsCount = appCount || 0;

    const { count: roadCount } = await supabase
      .from('user_roadmaps')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id);

    roadmapsCount = roadCount || 0;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back, {profile?.full_name || 'Candidate'}!
          </h1>
          <p className="text-slate-400 mt-1">Here is an overview of your career development progress.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/jobs"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition shadow-md flex items-center gap-2"
          >
            Explore Jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-blue-400">
            <Briefcase className="w-6 h-6" />
            <span className="text-xs bg-blue-950 border border-blue-800 px-2 py-1 rounded text-blue-300">Active</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{applicationsCount}</h3>
          <p className="text-slate-400 text-sm">Job Applications</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <Map className="w-6 h-6" />
            <span className="text-xs bg-emerald-950 border border-emerald-800 px-2 py-1 rounded text-emerald-300">Progress</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{roadmapsCount}</h3>
          <p className="text-slate-400 text-sm">Active Roadmaps</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-purple-400">
            <FileText className="w-6 h-6" />
            <span className="text-xs bg-purple-950 border border-purple-800 px-2 py-1 rounded text-purple-300">Profile</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Ready</h3>
          <p className="text-slate-400 text-sm">Resume Builder Status</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <Trophy className="w-6 h-6" />
            <span className="text-xs bg-amber-950 border border-amber-800 px-2 py-1 rounded text-amber-300">Skills</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Open</h3>
          <p className="text-slate-400 text-sm">Challenges & Projects</p>
        </div>
      </div>

      {/* Quick Actions / Shortcuts */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-semibold text-white">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/resume"
            className="p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-blue-500 transition group"
          >
            <h3 className="font-medium text-white group-hover:text-blue-400 transition">Update Resume →</h3>
            <p className="text-sm text-slate-400 mt-1">Edit your professional summary and skills.</p>
          </Link>
          <Link
            href="/applications"
            className="p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-blue-500 transition group"
          >
            <h3 className="font-medium text-white group-hover:text-blue-400 transition">View Applications →</h3>
            <p className="text-sm text-slate-400 mt-1">Check status of your submitted job applications.</p>
          </Link>
          <Link
            href="/roadmaps"
            className="p-4 bg-slate-950 border border-slate-800 rounded-lg hover:border-blue-500 transition group"
          >
            <h3 className="font-medium text-white group-hover:text-blue-400 transition">Browse Roadmaps →</h3>
            <p className="text-sm text-slate-400 mt-1">Continue learning your target tech stack.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}