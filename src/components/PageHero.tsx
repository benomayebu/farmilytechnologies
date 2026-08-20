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
      <Container className="py-20 sm:py-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl sm:tracking-[-0.03em]">
          {title}
        </h1>
        {children && (
          <div className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
