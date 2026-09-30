type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-10">
      {eyebrow && (
        <p className="mb-2 text-sm font-medium text-blue-400">
          {eyebrow}
        </p>
      )}

      <h1 className="text-4xl font-bold tracking-tight text-white">
        {title}
      </h1>

      {description && (
        <p className="mt-3 max-w-2xl text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}