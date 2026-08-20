import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/Reveal";
import ColdChainIllustration from "@/components/ColdChainIllustration";
import { DetectIcon, ProveIcon, SenseIcon } from "@/components/icons";
import { closingCta, hero, pillars, whatWeDo } from "@/lib/content/home";

const pillarIcons = {
  sense: SenseIcon,
  detect: DetectIcon,
  prove: ProveIcon,
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-paper">
        <Container className="relative py-24 sm:py-28 md:py-32">
          <div className="max-w-3xl animate-hero-in">
            <Eyebrow tone="paper">
              Compliance software for food supply chains
            </Eyebrow>
            <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-paper sm:text-6xl sm:tracking-[-0.03em] md:text-7xl md:tracking-[-0.035em]">
              {hero.headline}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-paper/80 sm:text-xl">
              {hero.subLine}
            </p>
            <p className="mt-5 max-w-lg font-display text-xl italic leading-snug text-wheat sm:text-2xl">
              &ldquo;{hero.supportingLine}&rdquo;
            </p>
            <div className="mt-10">
              <a
                href="#what-we-do"
                className="group inline-flex items-center gap-2.5 rounded-full bg-teal px-6 py-3.5 text-[15px] font-medium tracking-wide text-paper transition-all duration-200 hover:bg-teal-deep active:scale-[0.97]"
              >
                {hero.cta}
                <span className="transition-transform duration-200 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
            </div>
          </div>

          <div
            className="animate-hero-in mt-16 max-w-2xl sm:mt-20"
            style={{ animationDelay: "150ms" }}
          >
            <ColdChainIllustration />
          </div>
        </Container>
      </section>

      {/* What We Do */}
      <section id="what-we-do" className="border-y border-line bg-paper-deep scroll-mt-20">
        <Container className="py-20 sm:py-24">
          <Reveal className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
            <Eyebrow>{whatWeDo.eyebrow}</Eyebrow>
            <p className="max-w-2xl text-2xl leading-relaxed text-ink sm:text-[1.75rem]">
              {whatWeDo.body}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Three pillars */}
      <section>
        <Container className="py-20 sm:py-28">
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-3">
            {pillars.map((pillar, i) => {
              const Icon = pillarIcons[pillar.key];
              return (
                <Reveal key={pillar.key} delay={i * 90}>
                  <span className="font-display text-sm text-ink/35">
                    0{i + 1}
                  </span>
                  <Icon className="mt-4 h-11 w-11 text-teal-deep" />
                  <h3 className="mt-5 font-display text-2xl text-ink">
                    {pillar.name}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink/65">
                    {pillar.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink text-paper">
        <Container className="py-20 sm:py-24">
          <Reveal className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl font-display text-2xl leading-snug sm:text-3xl">
              {closingCta.line}
            </p>
            <Button href="/contact" variant="primary" className="shrink-0">
              {closingCta.cta}
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
