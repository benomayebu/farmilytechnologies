import Image from "next/image";
import Container from "@/components/ui/Container";
import Reveal from "@/components/Reveal";
import SimulatedBadge from "@/components/ui/SimulatedBadge";
import { appScreens } from "@/lib/content/solution";

/**
 * Real screenshots of the FARMILY web app, each with a short caption and a
 * "Simulated data" badge. Rows alternate sides on wide screens and stack
 * (text first) on narrow ones.
 */
export default function AppScreens() {
  return (
    <section aria-labelledby="app-screens-heading">
      <Container className="section-standard">
        <Reveal className="max-w-2xl">
          <p className="text-eyebrow font-semibold uppercase text-teal-deep">
            {appScreens.eyebrow}
          </p>
          <h2
            id="app-screens-heading"
            className="mt-4 font-display text-h2 text-ink"
          >
            {appScreens.headline}
          </h2>
          <p className="mt-4 text-body-lg text-ink/70">{appScreens.sub}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-16 md:mt-20 md:gap-24">
          {appScreens.items.map((item, i) => {
            const flip = i % 2 === 1;
            const isPhone = "phone" in item && item.phone;
            return (
              <div
                key={item.key}
                className={`grid min-w-0 grid-cols-1 items-center gap-8 md:gap-14 ${
                  flip ? "md:grid-cols-[1.6fr_1fr]" : "md:grid-cols-[1fr_1.6fr]"
                }`}
              >
                <Reveal className={`min-w-0 ${flip ? "md:order-2" : ""}`}>
                  <h3 className="font-display text-h3 text-ink">{item.title}</h3>
                  <p className="mt-3 max-w-md text-body text-ink/70">{item.body}</p>
                  <SimulatedBadge className="mt-5" />
                </Reveal>

                <Reveal
                  delay={100}
                  variant="materialize"
                  className={`min-w-0 ${flip ? "md:order-1" : ""}`}
                >
                  <figure
                    className={
                      isPhone ? "mx-auto w-full max-w-[17rem]" : "w-full"
                    }
                  >
                    <div
                      className={`overflow-hidden border border-line bg-paper shadow-xl shadow-ink/10 ${
                        isPhone ? "rounded-[2rem] border-4 border-ink" : "rounded-xl"
                      }`}
                    >
                      <Image
                        src={item.image}
                        width={item.width}
                        height={item.height}
                        alt={item.alt}
                        sizes={
                          isPhone
                            ? "17rem"
                            : "(min-width: 1280px) 720px, (min-width: 768px) 60vw, 100vw"
                        }
                        className="h-auto w-full"
                      />
                    </div>
                    <figcaption className="mt-3 text-small text-ink/70">
                      Screen from the FARMILY app.
                    </figcaption>
                  </figure>
                </Reveal>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
