import Container from "@/components/ui/Container";
import PageHero from "@/components/PageHero";
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
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly Section[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title}>
        {intro}
      </PageHero>

      <section>
        <Container className="max-w-3xl py-16 sm:py-20">
          <p className="text-sm text-ink/45">Last updated {lastUpdated}</p>

          <div className="mt-8 flex flex-col gap-10">
            {sections.map((section, i) => (
              <Reveal key={section.heading} delay={Math.min(i * 60, 300)}>
                <h2 className="font-display text-xl text-ink sm:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-3 flex flex-col gap-3">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 30)}
                      className="text-[15px] leading-relaxed text-ink/70"
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
