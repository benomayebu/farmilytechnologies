"use client";

import { useEffect } from "react";

/**
 * iOS Safari only applies the :active pseudo-class if a touchstart listener
 * exists somewhere in the document — otherwise press feedback (button/link
 * active states) is delayed or skipped entirely on touch. This is a no-op
 * listener that exists solely to unlock native :active feedback on iOS.
 */
export default function IOSTapFix() {
  useEffect(() => {
    const noop = () => {};
    document.addEventListener("touchstart", noop, false);
    return () => document.removeEventListener("touchstart", noop);
  }, []);

  return null;
}
