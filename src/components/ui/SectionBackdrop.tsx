import type { CSSProperties } from "react";

/**
 * Decorative photo behind a section. Two layers sit under the content:
 *   1. the photo, as a CSS background (opacity applies to this layer only),
 *   2. a gradient overlay that keeps the text above it readable.
 *
 * With `band`, narrow screens show the photo as a clear, unshaded band at the
 * top of the section that fades into the section colour; the section adds top
 * padding so its text starts below the photo instead of on top of it. Wider
 * screens show the photo across the whole section with `overlay`.
 *
 * The photos are generated, not taken at a real site, so each one carries a
 * small "Illustration" label in its top-right corner.
 *
 * Both layers are aria-hidden, so screen readers go straight to the content.
 * The parent section must be `relative isolate overflow-hidden` and carry a
 * solid background colour, which is what shows when the layers are hidden
 * (increased contrast, forced colours, or the photo failing to load).
 */

// Written out in full so Tailwind can see every class.
const BAND_CLASSES = {
  md: {
    image: "max-md:h-(--band)",
    shade:
      "max-md:bg-[linear-gradient(to_bottom,transparent_0,transparent_calc(var(--band)*0.55),var(--fade)_var(--band))]",
  },
  lg: {
    image: "max-lg:h-(--band)",
    shade:
      "max-lg:bg-[linear-gradient(to_bottom,transparent_0,transparent_calc(var(--band)*0.55),var(--fade)_var(--band))]",
  },
} as const;

export default function SectionBackdrop({
  image,
  position = "right center",
  mobilePosition,
  overlay = "",
  imageClassName = "",
  band,
}: {
  image: string;
  /** CSS background-position on wide screens. */
  position?: string;
  /** CSS background-position on narrow screens. Defaults to `position`. */
  mobilePosition?: string;
  /** Tailwind classes for the gradient layer on wide screens. */
  overlay?: string;
  /** Extra classes for the photo layer, e.g. an entrance animation. */
  imageClassName?: string;
  /** Show the photo as a top band below this breakpoint. */
  band?: {
    below: "md" | "lg";
    /** Band height, e.g. "14rem". */
    height: string;
    /** The section colour the band fades into, e.g. "var(--ink)". */
    fade: string;
  };
}) {
  const style = {
    backgroundImage: `url(${image})`,
    "--backdrop-pos": position,
    "--backdrop-pos-sm": mobilePosition ?? position,
    ...(band ? { "--band": band.height, "--fade": band.fade } : {}),
  } as CSSProperties;
  const bandClasses = band ? BAND_CLASSES[band.below] : { image: "", shade: "" };

  return (
    <>
      <div
        aria-hidden="true"
        className={`section-backdrop pointer-events-none absolute inset-0 -z-20 bg-cover bg-no-repeat [background-position:var(--backdrop-pos-sm)] md:[background-position:var(--backdrop-pos)] ${bandClasses.image} ${imageClassName}`}
        style={style}
      />
      <div
        aria-hidden="true"
        className={`section-backdrop pointer-events-none absolute inset-0 -z-10 ${bandClasses.shade} ${overlay}`}
        style={band ? ({ "--band": band.height, "--fade": band.fade } as CSSProperties) : undefined}
      />
      <span
        aria-hidden="true"
        className="section-backdrop pointer-events-none absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[0.8125rem] leading-none text-paper/90 sm:right-4 sm:top-4"
      >
        Illustration
      </span>
    </>
  );
}
