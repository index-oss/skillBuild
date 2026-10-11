import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#070B14] px-4 py-12">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-600/15 blur-3xl" />

      {/* Brand Header */}
      <div className="relative z-10 mb-8 text-center">
        <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-white">
          SkillForge<span className="text-blue-500"> AI</span>
        </Link>
        <p className="mt-1 text-xs text-slate-400">
          Learn. Build. Get hired.
        </p>
      </div>

      {/* Centered Clerk Box with custom dark appearance */}
      <div className="relative z-10 flex w-full justify-center">
        <SignIn
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full max-w-md",
              card: "bg-[#0D1422] border border-white/10 shadow-2xl rounded-2xl",
              headerTitle: "text-white font-bold",
              headerSubtitle: "text-slate-400",
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25",
              socialButtonsBlockButton:
                "border-white/10 bg-slate-900/80 hover:bg-slate-800 text-white",
              formFieldLabel: "text-slate-300",
              formFieldInput:
                "bg-black/40 border-white/10 text-white focus:border-blue-500",
              footerActionLink: "text-blue-400 hover:text-blue-300",
              identityPreviewText: "text-white",
            },
          }}
        />
      </div>
    </div>
  );
}