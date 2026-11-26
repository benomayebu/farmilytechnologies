import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import SectionBackdrop from "@/components/ui/SectionBackdrop";

/**
 * Light shade for a photo whose subject sits on the right. The supplied
 * photos already fade to pale on the left, so this only firms up the strip
 * behind the headline and leaves the subject clear.
 */
export const PALE_RIGHT_OVERLAY =
  "lg:bg-gradient-to-r lg:from-paper-deep/85 lg:from-35% lg:via-paper-deep/55 lg:via-65% lg:to-transparent lg:to-85% xl:from-paper-deep/80 xl:from-20% xl:via-paper-deep/30 xl:via-45% xl:to-65%";

export type PageHeroBackdrop = {
  image: string;
  position?: string;
  mobilePosition?: string;
  overlay?: string;
};

export default function PageHero({
  eyebrow,
  title,
  children,
  backdrop,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  /** Optional decorative photo behind the hero. On phones it shows as a
   *  clear band above the text. */
  backdrop?: PageHeroBackdrop;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-paper-deep">
      {backdrop && (
        <SectionBackdrop
          image={backdrop.image}
          position={backdrop.position ?? "right center"}
          mobilePosition={backdrop.mobilePosition}
          overlay={backdrop.overlay ?? PALE_RIGHT_OVERLAY}
          band={{ below: "lg", height: "14rem", fade: "var(--paper-deep)" }}
        />
      )}
      <Container
        className={`section-standard ${backdrop ? "max-lg:pt-[14rem]" : ""}`}
      >
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-3xl font-display text-h1 text-ink">
          {title}
        </h1>
        {children && (
          <div className="mt-6 max-w-xl text-body-lg text-ink/70">
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
