const CORE_PTS =
  "40,150 90,148 140,152 190,149 230,151 260,150 280,120 300,52.5 318,70 336,95 356,120 400,148 460,150 520,149 560,151 580,150";

const STATS = [
  { label: "Time in spec", value: "97.3%" },
  { label: "Peak core temp", value: "9.4°C" },
  { label: "Exceptions", value: "1" },
] as const;

export default function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4 sm:px-8">
        <div>
          <p className="font-display text-lg text-ink">Lot #4521</p>
          <p className="text-xs text-ink/55">
            Chilled Seafood · 1,800 kg · Muscat → Abu Dhabi
          </p>
        </div>
        <span className="rounded-full bg-[#B3453A]/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-[#9A3A30]">
          1 exception
        </span>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">
          Temperature history
        </p>
        <svg
          viewBox="0 0 600 200"
          className="h-auto w-full"
          role="img"
          aria-label="Temperature history chart showing a brief exception above the safe limit, back in range within the hour"
        >
          <rect x={40} y={107.5} width={540} height={62.5} fill="var(--teal)" opacity={0.07} />
          <rect x={280} y={20} width={60} height={150} fill="#B3453A" opacity={0.08} />
          <line
            x1={40}
            y1={107.5}
            x2={580}
            y2={107.5}
            stroke="#B3453A"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.5}
          />
          <text x={578} y={101} textAnchor="end" className="fill-[#9A3A30]" fontSize={10} fontFamily="var(--font-body)">
            Safe limit 5°C
          </text>
          <polyline
            points={CORE_PTS}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={300} cy={52.5} r={4.5} fill="#B3453A" />
          <text x={200} y={200} textAnchor="middle" className="fill-ink/40" fontSize={10} fontFamily="var(--font-body)">
            11 Aug
          </text>
          <text x={410} y={200} textAnchor="middle" className="fill-ink/40" fontSize={10} fontFamily="var(--font-body)">
            12 Aug
          </text>
        </svg>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/60">
          14:12 — power disconnect at Port of Jebel Ali, 22 min. Back in spec by 15:26.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-6">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">
                {stat.label}
              </p>
              <p className="mt-1.5 font-display text-xl text-ink sm:text-2xl">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 border-t border-line pt-5 text-sm font-medium text-teal-deep">
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d="M10 2.5 16 5v4.5C16 13.5 13.5 16.5 10 17.5 6.5 16.5 4 13.5 4 9.5V5z" strokeLinejoin="round" />
            <path d="M7.3 9.7 9.2 11.6 12.8 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Verified — tamper-evident record
        </div>
      </div>

      <p className="border-t border-line bg-paper-deep px-6 py-3 text-center text-[11px] text-ink/45 sm:px-8">
        Illustrative preview — fictional lot, not live shipment data.
      </p>
    </div>
  );
}
