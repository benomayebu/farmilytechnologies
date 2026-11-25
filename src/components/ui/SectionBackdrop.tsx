import type { CSSProperties } from "react";

/**
 * Decorative photo behind a section. Two layers sit under the content:
 *   1. the photo, as a CSS background (opacity applies to this layer only),
 *   2. a gradient overlay that keeps the text above it readable.
 *
 * Both layers are aria-hidden, so screen readers go straight to the content.
 * The parent section must be `relative isolate overflow-hidden` and carry a
 * solid background colour, which is what shows when the layers are hidden
 * (increased contrast, forced colours, or the photo failing to load).
 */
export default function SectionBackdrop({
  image,
  position = "right center",
  mobilePosition,
  overlay,
  imageClassName = "",
}: {
  image: string;
  /** CSS background-position from the md breakpoint up. */
  position?: string;
  /** CSS background-position on phones. Defaults to `position`. */
  mobilePosition?: string;
  /** Tailwind classes for the gradient layer, mobile first. */
  overlay: string;
  /** Extra classes for the photo layer, e.g. an opacity or entrance. */
  imageClassName?: string;
}) {
  const style = {
    backgroundImage: `url(${image})`,
    "--backdrop-pos": position,
    "--backdrop-pos-sm": mobilePosition ?? position,
  } as CSSProperties;

  return (
    <>
      <div
        aria-hidden="true"
        className={`section-backdrop pointer-events-none absolute inset-0 -z-20 bg-cover bg-no-repeat [background-position:var(--backdrop-pos-sm)] md:[background-position:var(--backdrop-pos)] ${imageClassName}`}
        style={style}
      />
      <div
        aria-hidden="true"
        className={`section-backdrop pointer-events-none absolute inset-0 -z-10 ${overlay}`}
      />
    </>
  );
}
