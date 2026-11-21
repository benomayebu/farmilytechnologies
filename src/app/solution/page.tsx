import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ProductPreview from "@/components/ProductPreview";
import HowItWorksDemo from "@/components/how-it-works/Demo";
import {
  DetectIcon,
  ProveIcon,
  SenseIcon,
  TruckIcon,
  WarehouseIcon,
} from "@/components/icons";
import { intro, pillars, segments, statusNote } from "@/lib/content/solution";

export const metadata: Metadata = {
  title: "Solution — FARMILY",
  description:
    "Continuous monitoring, smart rules and early warnings, and tamper-evident compliance records, for distributors, importers and cold storage operators.",
};

const pillarIcons = { sense: SenseIcon, detect: DetectIcon, prove: ProveIcon };
const segmentIcons = { distributors: TruckIcon, coldstorage: WarehouseIcon };

export default function SolutionPage() {
  return (
    <>
      <PageHero eyebrow={intro.eyebrow} title={intro.headline}>
        <p className="font-display text-xl italic text-teal-deep">
          {intro.sub}
        </p>
      </PageHero>

      {/* What it produces */}
      <section>
        <Container className="py-16 sm:py-20">
          <Reveal className="grid items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-14">
            <div>
              <p className="text-eyebrow font-semibold uppercase text-teal-deep">
                What you get
              </p>
              <h2 className="mt-4 font-display text-h3 text-ink">
                A record that answers the question before anyone has to ask it twice.
              </h2>
              <p className="mt-4 max-w-md text-body text-ink/65">
                Every lot gets its own temperature history, its flagged exceptions, and a
                sealed compliance record — generated automatically, not assembled by hand
                the night before an audit.
              </p>
            </div>
            <Reveal delay={120} variant="materialize">
              <ProductPreview />
            </Reveal>
          </Reveal>
        </Container>
      </section>

      {/* Pillars, expanded */}
      <section className="border-t border-line bg-paper-deep" aria-labelledby="pillars-heading">
        <Container className="py-20 sm:py-24">
          <h2 id="pillars-heading" className="sr-only">
            What FARMILY does
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((pillar, i) => {
              const Icon = pillarIcons[pillar.key];
              return (
                <Reveal
                  key={pillar.key}
                  delay={i * 90}
                  className="rounded-2xl border border-line bg-paper p-8 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5"
                >
                  <Icon className="h-11 w-11 text-teal-deep" />
                  <h3 className="mt-6 font-display text-2xl text-ink">
                    {pillar.name}
                  </h3>
                  <p className="mt-3 text-body text-ink/65">
                    {pillar.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <HowItWorksDemo />

      {/* Segments */}
      <section className="border-y border-line bg-ink text-paper">
        <Container className="py-20 sm:py-24">
          <Reveal>
            <h2 className="font-display text-h2">
              Built around who you are
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {segments.map((segment, i) => {
              const Icon = segmentIcons[segment.key];
              return (
                <Reveal
                  key={segment.key}
                  delay={i * 90}
                  className="group relative isolate min-h-[22rem] overflow-hidden rounded-2xl border border-paper/15 p-8"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={segment.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 h-full w-full scale-100 object-cover grayscale transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/25" />
                  <div className="flex h-full flex-col justify-end">
                    <Icon className="h-10 w-10 text-wheat" />
                    <h3 className="mt-5 font-display text-xl">
                      {segment.name}
                    </h3>
                    <p className="mt-2.5 text-body text-paper/75">
                      {segment.line}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Honest status note */}
      <section>
        <Container className="py-12">
          <p className="max-w-2xl text-body text-ink/70">
            {statusNote}
          </p>
        </Container>
      </section>
    </>
  );
}
