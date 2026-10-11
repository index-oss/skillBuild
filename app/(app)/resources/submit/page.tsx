"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubmitResourcePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        url: form.get("url"),
        resource_type: form.get("resource_type"),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Failed to submit resource.");
      setLoading(false);
      return;
    }

    router.push("/resources");
    router.refresh();
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold">
          Share a Learning Resource
        </h1>

        <p className="mt-2 text-slate-400">
          Submit useful learning material for the SkillForge community.
        </p>

        <form
          onSubmit={submit}
          className="mt-8 space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-6"
        >
          <div>
            <label className="text-sm text-slate-300">
              Title
            </label>

            <input
              name="title"
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="React Documentation"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">
              Description
            </label>

            <textarea
              name="description"
              rows={5}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Why is this resource useful?"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">
              URL
            </label>

            <input
              name="url"
              type="url"
              required
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">
              Resource type
            </label>

            <select
              name="resource_type"
              defaultValue="article"
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"
            >
              <option value="article">Article</option>
              <option value="video">Video</option>
              <option value="course">Course</option>
              <option value="documentation">Documentation</option>
              <option value="playlist">Playlist</option>
              <option value="other">Other</option>
            </select>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Resource"}
          </button>
        </form>
      </div>
    </div>
  );
}