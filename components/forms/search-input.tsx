"use client";

import { Input } from "@/components/ui/input";

export function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
}: {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
        ⌕
      </span>

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-10"
      />
    </div>
  );
}