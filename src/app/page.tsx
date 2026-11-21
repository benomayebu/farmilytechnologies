import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/Reveal";
import ColdChainIllustration from "@/components/ColdChainIllustration";
import HeroReport from "@/components/HeroReport";
import Parallax from "@/components/Parallax";
import LazyLoopVideo from "@/components/LazyLoopVideo";
import { DetectIcon, ProveIcon, SenseIcon } from "@/components/icons";
import {
  closingCta,
  hero,
  pillars,
  videoSection,
  whatWeDo,
} from "@/lib/content/home";

const pillarIcons = {
  sense: SenseIcon,
  detect: DetectIcon,
  prove: ProveIcon,
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex items-center overflow-hidden bg-ink text-paper lg:min-h-[min(840px,calc(100svh-5rem))]">
        <Parallax strength={18} className="-z-20 opacity-[0.32]">
          <ColdChainIllustration />
        </Parallax>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/40" />

        <Container className="relative grid gap-x-14 py-20 sm:py-24 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-x-12 lg:py-16">
          {/* Claim. On large screens the report card sits beside the text; on
              small screens it comes straight after the sub-line. */}
          <div className="max-w-3xl lg:col-start-1 lg:row-start-1 lg:self-end">
            <Eyebrow
              tone="paper"
              className="animate-hero-line"
              style={{ animationDelay: "40ms" }}
            >
              Compliance software for food supply chains
            </Eyebrow>
            <h1
              className="animate-hero-line mt-6 font-display text-5xl leading-[1.05] tracking-tight text-paper sm:text-6xl sm:tracking-[-0.03em] lg:text-[3.5rem] lg:tracking-[-0.03em]"
              style={{ animationDelay: "130ms" }}
            >
              {hero.headline}
            </h1>
            <p
              className="animate-hero-line mt-7 max-w-xl text-lg leading-relaxed text-paper/80 sm:text-xl"
              style={{ animationDelay: "240ms" }}
            >
              {hero.subLine}
            </p>
          </div>

          {/* Product proof: one sealed report, simulated and labelled as such. */}
          <div
            className="animate-pop-in mt-10 w-full max-w-md lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:max-w-none lg:self-center"
            style={{ animationDelay: "300ms" }}
          >
            <HeroReport />
          </div>

          <div className="max-w-3xl lg:col-start-1 lg:row-start-2 lg:self-start">
            <p
              className="animate-hero-line mt-10 max-w-lg font-display text-xl italic leading-snug text-wheat sm:text-2xl lg:mt-6"
              style={{ animationDelay: "330ms" }}
            >
              &ldquo;{hero.supportingLine}&rdquo;
            </p>
            <div
              className="animate-hero-line mt-10 lg:mt-8"
              style={{ animationDelay: "420ms" }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Button href={hero.primaryCta.href} variant="primary">
                  {hero.primaryCta.label}
                </Button>
                <Button href={hero.secondaryCta.href} variant="ghostOnDark">
                  {hero.secondaryCta.label}
                </Button>
              </div>
              <p className="mt-5 text-sm text-paper/70">{hero.status}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* What We Do */}
      <section id="what-we-do" className="border-y border-line bg-paper-deep scroll-mt-20">
        <Container className="py-20 sm:py-24">
          <Reveal className="grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
            <Eyebrow as="h2">{whatWeDo.eyebrow}</Eyebrow>
            <p className="max-w-2xl text-2xl leading-relaxed text-ink sm:text-[1.75rem]">
              {whatWeDo.body}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Three pillars */}
      <section aria-labelledby="pillars-heading">
        <Container className="py-20 sm:py-28">
          <h2 id="pillars-heading" className="sr-only">
            What FARMILY does
          </h2>
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-3">
            {pillars.map((pillar, i) => {
              const Icon = pillarIcons[pillar.key];
              return (
                <Reveal key={pillar.key} delay={i * 90}>
                  <span aria-hidden="true" className="font-display text-sm text-ink/55">
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

      {/* Shipment journey video */}
      <section className="border-t border-line bg-paper-deep">
        <Container className="py-20 sm:py-28">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>{videoSection.eyebrow}</Eyebrow>
            <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl sm:tracking-[-0.03em]">
              {videoSection.headline}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink/65">
              {videoSection.body}
            </p>
          </Reveal>
          <Reveal delay={120} variant="materialize" className="mt-12">
            <div className="overflow-hidden rounded-2xl border border-line shadow-lg shadow-ink/5">
              <LazyLoopVideo
                src="/videos/shipment-journey.mp4"
                poster="/videos/shipment-journey-poster.jpg"
                width={1280}
                height={720}
                className="h-auto w-full"
                ariaLabel="Animated walkthrough of a FARMILY-monitored shipment: loaded, in transit, an exception caught early, proof delivered on arrival, and trust carried downstream."
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink text-paper">
        <Container className="py-20 sm:py-24">
          <Reveal className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl font-display text-2xl leading-snug sm:text-3xl sm:tracking-[-0.02em]">
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
