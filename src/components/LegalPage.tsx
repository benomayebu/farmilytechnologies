import Container from "@/components/ui/Container";
import PageHero, { type PageHeroBackdrop } from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { lastUpdated } from "@/lib/content/legal";

type Section = {
  heading: string;
  body: readonly string[];
};

export default function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  backdrop,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly Section[];
  /** Decorative photo behind the title and opening paragraph only. */
  backdrop?: PageHeroBackdrop;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} backdrop={backdrop}>
        {intro}
      </PageHero>

      <section className="bg-paper">
        <Container className="max-w-3xl section-compact">
          <p className="text-small text-ink/70">Last updated {lastUpdated}</p>

          <div className="mt-8 flex flex-col gap-10">
            {sections.map((section, i) => (
              <Reveal key={section.heading} delay={Math.min(i * 60, 300)}>
                <h2 className="font-display text-title text-ink">
                  {section.heading}
                </h2>
                <div className="mt-3 flex flex-col gap-3">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 30)}
                      className="text-body text-ink/70 [overflow-wrap:anywhere]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
