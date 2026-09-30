import { PageShell } from "@/components/layout/page-shell";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RecruiterApplicantsPage({ params }: Props) {
  const { id } = await params;

  return (
    <PageShell>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Applicants</h1>
        <p className="mt-2 text-slate-400">Job ID: {id}</p>
      </div>
    </PageShell>
  );
}
