import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/Reveal";
import { approach, founderStory, intro, mission } from "@/lib/content/about";

export const metadata: Metadata = {
  title: "About — FARMILY",
  description:
    "Why FARMILY exists, what we believe, and the research it grew out of.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow={intro.eyebrow} title={intro.headline}>
        {intro.body}
      </PageHero>

      {/* Mission */}
      <section className="border-b border-line">
        <Container className="section-compact">
          <Reveal className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
            <Eyebrow as="h2">{mission.eyebrow}</Eyebrow>
            <p className="max-w-2xl font-display text-h3 text-ink">
              {mission.statement}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Approach */}
      <section className="border-b border-line bg-paper-deep">
        <Container className="section-compact">
          <Reveal className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
            <Eyebrow as="h2">{approach.eyebrow}</Eyebrow>
            <p className="max-w-2xl text-body-lg text-ink/75">
              {approach.body}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Founder story */}
      <section>
        <Container className="section-standard">
          <Reveal>
            <Eyebrow as="h2">{founderStory.eyebrow}</Eyebrow>
            <div className="mt-8 grid gap-10 md:grid-cols-[auto_1fr] md:gap-14">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-ink font-display text-2xl text-paper">
                BO
              </div>
              <div className="max-w-2xl">
                {founderStory.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="mt-4 text-body-lg text-ink/80 first:mt-0"
                  >
                    {p}
                  </p>
                ))}
                <div className="mt-6 space-y-2 border-t border-line pt-6 text-body text-ink/70">
                  {founderStory.bio.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  <p>
                    {founderStory.bio.publication.lead}{" "}
                    <a
                      href={founderStory.bio.publication.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-deep underline decoration-teal-deep/40 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                    >
                      &ldquo;{founderStory.bio.publication.title}&rdquo;
                    </a>{" "}
                    ({founderStory.bio.publication.source}).
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
