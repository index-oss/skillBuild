import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070B14] px-6 text-white">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          !
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Access unavailable
        </h1>

        <p className="mt-3 text-slate-400">
          Your account currently doesn't have access to this
          workspace.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold hover:bg-blue-400"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}