import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { citation, framing, intro } from "@/lib/content/research";

export const metadata: Metadata = {
  title: "Research — FARMILY",
  description:
    "The peer-reviewed research FARMILY grew out of, and how the product has evolved since.",
};

export default function ResearchPage() {
  return (
    <>
      <PageHero eyebrow={intro.eyebrow} title={intro.headline} />

      <section>
        <Container className="py-16 sm:py-20">
          <Reveal>
            <p className="max-w-3xl text-lg leading-relaxed text-ink/75">
              {framing}
            </p>
          </Reveal>

          <Reveal
            delay={120}
            className="mt-12 max-w-3xl rounded-2xl border border-line bg-paper-deep p-8 sm:p-10"
          >
            <p className="font-display text-lg italic leading-relaxed text-ink">
              {citation.text}
            </p>
            <a
              href={citation.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-teal-deep underline decoration-teal-deep/40 underline-offset-4 transition-colors hover:text-teal"
            >
              {citation.linkLabel} →
            </a>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
