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
        <Container className="py-16 sm:py-20">
          <Reveal className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
            <Eyebrow>{mission.eyebrow}</Eyebrow>
            <p className="max-w-2xl font-display text-2xl leading-snug text-ink sm:text-3xl">
              {mission.statement}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Approach */}
      <section className="border-b border-line bg-paper-deep">
        <Container className="py-16 sm:py-20">
          <Reveal className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-16">
            <Eyebrow>{approach.eyebrow}</Eyebrow>
            <p className="max-w-2xl text-lg leading-relaxed text-ink/75">
              {approach.body}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Founder story */}
      <section>
        <Container className="py-20 sm:py-24">
          <Reveal>
            <Eyebrow>{founderStory.eyebrow}</Eyebrow>
            <div className="mt-8 grid gap-10 md:grid-cols-[auto_1fr] md:gap-14">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-ink font-display text-2xl text-paper">
                BO
              </div>
              <div className="max-w-2xl">
                {founderStory.paragraphs.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="mt-4 text-lg leading-relaxed text-ink/80 first:mt-0"
                  >
                    {p}
                  </p>
                ))}
                <p className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-ink/55">
                  {founderStory.bio}
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
