"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
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
          display_name: displayName,
          bio,
          location_city: city,
          location_country: country,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create profile",
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070B14] px-6 py-12 text-white">
      <div className="mx-auto max-w-xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium text-blue-400">
            WELCOME TO SKILLFORGE
          </p>

          <h1 className="text-4xl font-bold">
            Build your career workspace
          </h1>

          <p className="mt-3 text-slate-400">
            Set up your profile to personalize your
            SkillForge experience.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-white/10 bg-[#0D1422] p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Display name
            </label>

            <input
              required
              value={displayName}
              onChange={(event) =>
                setDisplayName(event.target.value)
              }
              placeholder="Your name"
              className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-white outline-none transition focus:border-blue-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Bio
            </label>

            <textarea
              value={bio}
              onChange={(event) =>
                setBio(event.target.value)
              }
              rows={4}
              placeholder="Tell us about your interests..."
              className="w-full resize-none rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-white outline-none transition focus:border-blue-400"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                City
              </label>

              <input
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
                placeholder="Delhi"
                className="w-full rounded-xl border border-white/10 bg-[#070B14] px-4 py-3 text-white outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Country
              </label>

              <input
                value={country}
                onChange={(event) =>
                  setCountry(event.target.value)
                }
                placeholder="India"
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
            className="w-full rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
          >
            {loading
              ? "Creating workspace..."
              : "Continue to SkillForge"}
          </button>
        </form>
      </div>
    </main>
  );
}