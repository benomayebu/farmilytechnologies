export default function Eyebrow({
  children,
  tone = "ink",
}: {
  children: string;
  tone?: "ink" | "paper";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] ${
        tone === "paper" ? "text-paper/70" : "text-teal-deep"
      }`}
    >
      <span className="h-px w-6 bg-current opacity-60" />
      {children}
    </span>
  );
}
