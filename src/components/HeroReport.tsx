import { heroReport } from "@/lib/content/home";

/**
 * The home hero's "product moment": one sealed shipment report, drawn from
 * the FARMILY simulator's power_loss scenario (S2). Real HTML text, clearly
 * labelled as simulated.
 *
 * The curve is the scenario's own minute-by-minute data: a 2-hour run with
 * the temperature walking between 2 and 3 °C, reefer power lost at minute 60
 * for 22 minutes, above the 5.00 °C limit from minute 71 to 92, peak 9.40 °C
 * at minute 82. Values are hundredths of a degree, as the simulator sends them.
 */
const POWER_CURVE = [
  250, 275, 300, 325, 350, 375, 400, 425, 450, 475, 500,
  540, 580, 620, 660, 700, 740, 780, 820, 860, 900, 920, 940,
  900, 840, 780, 720, 660, 600, 560, 530, 510, 502,
  490, 460, 430, 400, 370, 340, 310, 280,
];
const EVENT_AT = 60;
const RUN_MINUTES = 120;
// The simulator's quiet stretches wander between 2.00 and 3.00 °C; a fixed,
// gentle pattern keeps this chart identical on every render.
const quiet = (m: number) => 250 + Math.round(22 * Math.sin(m / 7) + 12 * Math.sin(m / 2.3));

const LIMIT = 500;
const PEAK_MINUTE = 82;
const EXCURSION_START = 71;
const EXCURSION_END = 92;

// Chart geometry (viewBox units). Temperature axis 0 to 11 °C.
const W = 320;
const H = 96;
const T_MAX = 1100;
const x = (m: number) => (m / RUN_MINUTES) * W;
const y = (t: number) => H - (t / T_MAX) * H;

const points = Array.from({ length: RUN_MINUTES + 1 }, (_, m) => {
  const i = m - EVENT_AT;
  const t = i >= 0 && i < POWER_CURVE.length ? POWER_CURVE[i] : quiet(m);
  return `${x(m).toFixed(1)},${y(t).toFixed(1)}`;
}).join(" ");

export default function HeroReport({ className = "" }: { className?: string }) {
  const r = heroReport;
  return (
    <figure
      className={`rounded-2xl border border-paper/15 bg-paper p-5 text-ink shadow-2xl shadow-black/30 sm:p-6 ${className}`}
      aria-label={r.ariaLabel}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg leading-tight">{r.title}</p>
          <p className="mt-1 text-small text-ink/70">{r.lot}</p>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full border border-ink/20 px-2.5 py-1 text-eyebrow font-semibold uppercase text-ink/70">
          {r.simulatedLabel}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between text-xs text-ink/70">
          <span>{r.chartLabel}</span>
          <span className="text-alert">{r.limitLabel}</span>
        </div>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mt-2 h-auto w-full overflow-visible"
          aria-hidden="true"
        >
          <rect
            x={x(EXCURSION_START)}
            y={0}
            width={x(EXCURSION_END) - x(EXCURSION_START)}
            height={H}
            fill="var(--alert-mark)"
            opacity={0.1}
          />
          <line
            x1={0}
            y1={y(LIMIT)}
            x2={W}
            y2={y(LIMIT)}
            stroke="var(--alert)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <polyline
            points={points}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={1.75}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle cx={x(PEAK_MINUTE)} cy={y(940)} r={3.5} fill="var(--alert-mark)" stroke="var(--paper)" strokeWidth={1.5} />
        </svg>
        <p className="mt-2 text-small text-alert">{r.excursionNote}</p>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
        {r.stats.map((s) => (
          <div key={s.label}>
            <dt className="text-xs text-ink/70">{s.label}</dt>
            <dd className="mt-1 whitespace-nowrap font-display text-base leading-tight">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-teal-deep/[0.08] px-4 py-3">
        <span className="flex items-center gap-2 text-small text-teal-deep">
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
            <path d="M10 2.5 16 5v4.5C16 13.5 13.5 16.5 10 17.5 6.5 16.5 4 13.5 4 9.5V5z" strokeLinejoin="round" />
            <path d="M7.3 9.7 9.2 11.6 12.8 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {r.integrityLabel}
        </span>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-teal-deep px-2.5 py-1 text-xs font-semibold tracking-wide text-paper">
          {r.integrityValue}
        </span>
      </div>
    </figure>
  );
}
