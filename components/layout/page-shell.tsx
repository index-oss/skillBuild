import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

export function PageShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Container>
      {children}
    </Container>
  );
}