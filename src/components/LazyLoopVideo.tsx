"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Silent, looping video that doesn't download until it scrolls near the
 * viewport — shows `poster` until then. Muted autoplay is allowed by every
 * browser regardless of user gesture, so no play button is needed by default.
 *
 * Respects prefers-reduced-motion: the video still loads (so there's
 * something to play) but doesn't autoplay/loop on its own — native controls
 * appear instead, so reduced-motion visitors choose if and when it plays.
 */
export default function LazyLoopVideo({
  src,
  poster,
  width,
  height,
  className = "",
  ariaLabel,
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  className?: string;
  ariaLabel: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !shouldLoad) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.controls = true;
    } else {
      el.loop = true;
      el.play().catch(() => {});
    }
  }, [shouldLoad]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      width={width}
      height={height}
      src={shouldLoad ? src : undefined}
      muted
      playsInline
      preload="none"
      aria-label={ariaLabel}
    />
  );
}
