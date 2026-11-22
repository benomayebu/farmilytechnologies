/**
 * Marks any report, reading, shipment or excursion on the site as made-up
 * data. FARMILY has no customers or live shipments yet, so everything that
 * looks like product output carries this label.
 */
export default function SimulatedBadge({
  tone = "ink",
  className = "",
}: {
  tone?: "ink" | "paper";
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-eyebrow font-semibold uppercase ${
        tone === "paper" ? "border-paper/30 text-paper/80" : "border-ink/20 text-ink/70"
      } ${className}`}
    >
      Simulated data
    </span>
  );
}
