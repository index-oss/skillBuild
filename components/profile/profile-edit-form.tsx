"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ProfileData = {
  id?: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  location_city?: string | null;
  location_country?: string | null;
  timezone?: string | null;
};

export function ProfileEditForm({
  initialProfile,
  email,
  roles,
}: {
  initialProfile?: ProfileData | null;
  email?: string;
  roles?: string[];
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialProfile?.display_name || "");
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || "");
  const [city, setCity] = useState(initialProfile?.location_city || "");
  const [country, setCountry] = useState(initialProfile?.location_country || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 2MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
      setMessage({ type: "success", text: "Profile picture selected! Click 'Save Changes' to update." });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
          location_city: city,
          location_country: country,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update profile");
      }

      setMessage({ type: "success", text: "Profile updated successfully! ✨" });
      router.refresh();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            message.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : "border-rose-500/20 bg-rose-500/10 text-rose-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Picture Upload & Preview */}
      <section className="rounded-2xl border border-white/10 bg-[#0D1422] p-6">
        <h2 className="text-lg font-semibold text-white">Profile Picture</h2>
        <p className="mt-1 text-xs text-slate-400">
          Upload an image from your device or paste an avatar image URL.
        </p>

        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-blue-500/40 bg-slate-800">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-slate-400">
                {(displayName || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <label className="inline-block cursor-pointer rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700">
                <span>Choose Image from Computer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
              </label>
              <span className="ml-3 text-xs text-slate-500">Max 2MB (JPG, PNG, WebP)</span>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-slate-500">
                Or Image URL
              </label>
              <input
                type="url"
                value={avatarUrl.startsWith("data:") ? "" : avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Account Info */}
      <section className="rounded-2xl border border-white/10 bg-[#0D1422] p-6">
        <h2 className="text-lg font-semibold text-white">Account Details</h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-500">
              Full Name / Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your full name"
              required
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-500">
              Email Address (from Clerk)
            </label>
            <input
              type="text"
              disabled
              value={email || "Not provided"}
              className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-white/5 bg-slate-900/60 px-3.5 py-2.5 text-sm text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-500">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai, New York"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-500">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. India, United States"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-slate-500">
              Roles
            </label>
            <p className="mt-2 text-sm font-medium text-slate-300">
              {roles && roles.length > 0 ? roles.join(", ") : "student"}
            </p>
          </div>
        </div>
      </section>

      {/* Bio / About */}
      <section className="rounded-2xl border border-white/10 bg-[#0D1422] p-6">
        <h2 className="text-lg font-semibold text-white">About You</h2>
        <div className="mt-4">
          <label className="block text-xs uppercase tracking-wide text-slate-500">
            Bio
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell recruiters and peers about your background, skills, and goals..."
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-500 disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
