import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/Reveal";
import SectionBackdrop from "@/components/ui/SectionBackdrop";
import HeroReport from "@/components/HeroReport";
import LazyLoopVideo from "@/components/LazyLoopVideo";
import { DetectIcon, ProveIcon, SenseIcon } from "@/components/icons";
import {
  closingCta,
  demoTeaser,
  hero,
  pillars,
  videoSection,
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
      <section className="relative isolate flex items-center overflow-hidden bg-ink text-paper lg:min-h-[min(840px,calc(100svh-4rem))]">
        {/* Still photo: it sits behind the text, so it should not move. The
            navy gradient is strongest behind the headline and buttons on the
            left and opens up toward the truck on the right. */}
        <SectionBackdrop
          image="/images/backgrounds/home-loading-dock-dusk.webp"
          position="right center"
          mobilePosition="right center"
          imageClassName="animate-illustration-in"
          overlay="lg:bg-gradient-to-r lg:from-ink/90 lg:from-30% lg:via-ink/55 lg:via-55% lg:to-transparent lg:to-75% xl:from-ink/70 xl:from-10% xl:via-ink/25 xl:via-40% xl:to-55%"
          band={{ below: "lg", height: "15rem", fade: "var(--ink)" }}
        />
        <div
          aria-hidden="true"
          className="section-backdrop pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-t from-ink/50 via-transparent via-30% to-transparent lg:block"
        />

        <Container className="relative grid gap-x-14 section-standard max-lg:pt-[14rem] lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-x-12 lg:py-16">
          {/* Claim. On large screens the report card sits beside the text; on
              small screens the buttons come straight after the sub-line. */}
          <div className="max-w-3xl lg:col-start-1 lg:row-start-1 lg:self-end">
            <Eyebrow
              tone="paper"
              className="animate-hero-line"
              style={{ animationDelay: "0ms" }}
            >
              Compliance software for food supply chains
            </Eyebrow>
            <h1
              className="animate-hero-line mt-6 font-display text-display text-paper"
              style={{ animationDelay: "60ms" }}
            >
              {hero.headline}
            </h1>
            <p
              className="animate-hero-line mt-7 max-w-xl text-body-lg text-paper/80 sm:text-xl"
              style={{ animationDelay: "120ms" }}
            >
              {hero.subLine}
            </p>
          </div>

          {/* Product proof: one sealed report, simulated and labelled as such.
              On small screens it comes after the buttons, so they stay in
              the first screen. */}
          <div
            className="animate-pop-in order-last mt-10 w-full lg:order-none max-w-md lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:max-w-none lg:self-center"
            style={{ animationDelay: "120ms" }}
          >
            <HeroReport />
          </div>

          <div className="max-w-3xl lg:col-start-1 lg:row-start-2 lg:self-start">
            <div
              className="animate-hero-line mt-10 lg:mt-8"
              style={{ animationDelay: "180ms" }}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Button href={hero.primaryCta.href} variant="primary">
                  {hero.primaryCta.label}
                </Button>
                <Button href={hero.secondaryCta.href} variant="ghostOnDark">
                  {hero.secondaryCta.label}
                </Button>
              </div>
              <p className="mt-5 text-small text-paper/70">{hero.status}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* How it works: the three parts, then one shipment end to end */}
      <section aria-labelledby="how-heading" className="border-t border-line bg-paper-deep">
        <Container className="section-spacious">
          <Reveal className="mx-auto max-w-2xl text-center">
            <Eyebrow>{videoSection.eyebrow}</Eyebrow>
            <h2
              id="how-heading"
              className="mt-4 font-display text-h2 text-ink"
            >
              {videoSection.headline}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-body-lg text-ink/65">
              {videoSection.body}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-3">
            {pillars.map((pillar, i) => {
              const Icon = pillarIcons[pillar.key];
              return (
                <Reveal key={pillar.key} delay={i * 90}>
                  <span aria-hidden="true" className="font-display text-small text-ink/55">
                    0{i + 1}
                  </span>
                  <Icon className="mt-4 h-11 w-11 text-teal-deep" />
                  <h3 className="mt-5 font-display text-2xl text-ink">
                    {pillar.name}
                  </h3>
                  <p className="mt-2.5 text-body text-ink/65">
                    {pillar.description}
                  </p>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={120} variant="materialize" className="mt-14">
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

      {/* Try it: a pointer to the interactive demo, not a copy of it */}
      <section aria-labelledby="demo-teaser-heading" className="border-t border-line">
        <Container className="section-standard">
          <Reveal className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <Eyebrow>{demoTeaser.eyebrow}</Eyebrow>
              <h2
                id="demo-teaser-heading"
                className="mt-4 font-display text-h2 text-ink"
              >
                {demoTeaser.headline}
              </h2>
              <p className="mt-4 text-body-lg text-ink/70">
                {demoTeaser.body}
              </p>
            </div>
            <Button href={demoTeaser.cta.href} variant="ghost" className="shrink-0">
              {demoTeaser.cta.label}
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink text-paper">
        <Container className="section-standard">
          <Reveal className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl font-display text-h3">
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
