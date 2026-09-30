import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070B14] px-6 text-white">
      <div className="text-center">
        <p className="text-sm font-medium text-blue-400">
          404
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Page not found
        </h1>

        <p className="mt-3 text-slate-400">
          The page you're looking for doesn't exist.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold hover:bg-blue-400"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}