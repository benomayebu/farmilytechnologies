import type { CSSProperties } from "react";

export default function Eyebrow({
  children,
  tone = "ink",
  className = "",
  style,
}: {
  children: string;
  tone?: "ink" | "paper";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] ${
        tone === "paper" ? "text-paper/70" : "text-teal-deep"
      } ${className}`}
      style={style}
    >
      <span className="h-px w-6 bg-current opacity-60" />
      {children}
    </span>
  );
}
