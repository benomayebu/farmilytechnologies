import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";

export default function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-paper-deep">
      <Container className="section-standard">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-3xl font-display text-h1 text-ink">
          {title}
        </h1>
        {children && (
          <div className="mt-6 max-w-xl text-body-lg text-ink/70">
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
