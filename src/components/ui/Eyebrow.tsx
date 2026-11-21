import type { CSSProperties } from "react";

export default function Eyebrow({
  children,
  tone = "ink",
  as: Tag = "span",
  className = "",
  style,
}: {
  children: string;
  tone?: "ink" | "paper";
  /** Render as a heading when the label names a section (e.g. "What we do"),
   *  so screen-reader users can jump to it. Looks identical either way. */
  as?: "span" | "h2";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Tag
      className={`inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] ${
        tone === "paper" ? "text-paper/70" : "text-teal-deep"
      } ${className}`}
      style={style}
    >
      <span aria-hidden="true" className="h-px w-6 bg-current opacity-60" />
      {children}
    </Tag>
  );
}
