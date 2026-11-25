import type { ReactNode } from "react";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import SectionBackdrop from "@/components/ui/SectionBackdrop";

/**
 * Pale overlay for a photo whose subject sits on the right. Solid behind the
 * headline on the left, thinning out toward the subject. On phones the photo
 * ends up behind the text, so the overlay is near solid there.
 */
export const PALE_RIGHT_OVERLAY =
  "bg-paper-deep/90 md:bg-transparent md:bg-gradient-to-r md:from-paper-deep md:from-30% md:via-paper-deep/85 md:via-55% md:to-paper-deep/0";

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
  /** Optional decorative photo behind the hero. */
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
        />
      )}
      <Container className="section-standard">
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
