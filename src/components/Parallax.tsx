"use client";

import { useEffect, useRef, type ReactNode } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Ambient pointer-parallax — the background layer drifts a few px toward
 * the cursor, smoothed by a short CSS transition. This is the passive
 * translation of Apple's "fluid interfaces" response principle: there's no
 * drag here, so it's continuous ambient response rather than 1:1 tracking.
 * No-ops under reduced motion or on touch/coarse pointers.
 */
export default function Parallax({
  children,
  strength = 16,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const target = targetRef.current;
    if (!wrap || !target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    // The layer this wraps sits behind the hero text (negative z-index), so
    // it's never the hit-tested target — listen on window and compute the
    // offset against this element's own rect instead.
    function onMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      const x = clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
      const y = clamp((e.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
      target!.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [strength]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 ${className}`}>
      <div
        ref={targetRef}
        className="h-full w-full transition-transform duration-500 ease-out will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
