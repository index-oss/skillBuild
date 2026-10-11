"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewCompanyPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    website: "",
    location_city: "",
    location_state: "",
    location_country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create company",
        );
      }

      router.push(`/companies/${data.company.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-sm text-blue-400">
            Recruiter workspace
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Create company
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Add your company before creating job openings.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Company name
              </label>

              <Input
                id="name"
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                placeholder="Acme Technologies"
                required
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Slug
              </label>

              <Input
                id="slug"
                value={form.slug}
                onChange={(event) =>
                  updateField("slug", event.target.value)
                }
                placeholder="acme-technologies"
              />

              <p className="mt-1 text-xs text-slate-500">
                Leave empty to generate automatically.
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Description
              </label>

              <textarea
                id="description"
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value,
                  )
                }
                rows={5}
                placeholder="Tell candidates about your company..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="website"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Website
              </label>

              <Input
                id="website"
                type="url"
                value={form.website}
                onChange={(event) =>
                  updateField(
                    "website",
                    event.target.value,
                  )
                }
                placeholder="https://example.com"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="location_city"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  City
                </label>

                <Input
                  id="location_city"
                  value={form.location_city}
                  onChange={(event) =>
                    updateField(
                      "location_city",
                      event.target.value,
                    )
                  }
                  placeholder="Delhi"
                />
              </div>

              <div>
                <label
                  htmlFor="location_state"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  State
                </label>

                <Input
                  id="location_state"
                  value={form.location_state}
                  onChange={(event) =>
                    updateField(
                      "location_state",
                      event.target.value,
                    )
                  }
                  placeholder="Delhi"
                />
              </div>

              <div>
                <label
                  htmlFor="location_country"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Country
                </label>

                <Input
                  id="location_country"
                  value={form.location_country}
                  onChange={(event) =>
                    updateField(
                      "location_country",
                      event.target.value,
                    )
                  }
                  placeholder="India"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                href="/companies"
                variant="ghost"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create company"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageShell>
  );
}