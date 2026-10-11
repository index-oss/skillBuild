"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const [role, setRole] = useState<"student" | "recruiter">("student");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          display_name: displayName,
          bio,
          location_city: city,
          location_country: country,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create profile");
      }

      // If recruiter, direct them to recruiter dashboard, otherwise regular dashboard
      if (role === "recruiter") {
        router.replace("/recruiter");
      } else {
        router.replace("/dashboard");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070B14] px-6 py-12 text-white">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-blue-400">
            WELCOME TO SKILLFORGE
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Select your role & profile
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Choose how you intend to use SkillForge today.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-[#0D1422] p-6 shadow-xl"
        >
          {/* Role Selection Cards */}
          <div>
            <label className="mb-3 block text-sm font-medium text-slate-200">
              I want to join SkillForge as:
            </label>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${
                  role === "student"
                    ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500"
                    : "border-white/10 bg-black/30 hover:border-white/20"
                }`}
              >
                <span className="text-2xl">🎓</span>
                <span className="mt-2 font-semibold text-white">Student / Job Seeker</span>
                <span className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Learn skills, build resumes, and apply for tech jobs.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${
                  role === "recruiter"
                    ? "border-purple-500 bg-purple-500/10 ring-1 ring-purple-500"
                    : "border-white/10 bg-black/30 hover:border-white/20"
                }`}
              >
                <span className="text-2xl">🏢</span>
                <span className="mt-2 font-semibold text-white">Recruiter / Employer</span>
                <span className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Post jobs, review applicant submissions & hire talent.
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Full Name
            </label>

            <input
              required
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-white outline-none transition focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={3}
              placeholder={
                role === "recruiter"
                  ? "Tell candidates about your company and hiring focus..."
                  : "Tell recruiters about your skills, passion, and goals..."
              }
              className="w-full resize-none rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-white outline-none transition focus:border-blue-400"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                City
              </label>

              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="e.g. San Francisco or Delhi"
                className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">
                Country
              </label>

              <input
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                placeholder="e.g. India or USA"
                className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl px-5 py-3 font-semibold text-white transition disabled:opacity-50 ${
              role === "recruiter"
                ? "bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-600/25"
                : "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25"
            }`}
          >
            {loading
              ? "Setting up profile..."
              : role === "recruiter"
              ? "Continue to Recruiter Portal"
              : "Continue to SkillForge"}
          </button>
        </form>
      </div>
    </main>
  );
}