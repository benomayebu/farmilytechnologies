"use client";

import { useRef, useState } from "react";
import {
  CHART_X0,
  CHART_X1,
  chartX,
  chartY,
  clamp,
} from "@/lib/shipmentPhysics";
import { chart } from "@/lib/content/howItWorksDemo";
import type { CurveSegments } from "@/lib/shipmentPhysics";

// A muted neutral for "no signal" — needs to read clearly against the dark
// ink-soft card, so neither --ink (too dark, near-invisible here) nor a
// brand color (would wrongly imply good/bad) works.
const NEUTRAL = "#8CA0B3";

// Matches ProductPreview.tsx's exception-tag red on this same Solution page
// — an actual breach should read as visibly more severe than "still just a
// warning," and reusing this color ties the two features together instead
// of inventing a second "danger" hue.
const DANGER = "#B3453A";

const STATUS_COLOR: Record<string, string> = {
  inRange: "var(--teal)",
  noSignal: NEUTRAL,
  aboveLimit: DANGER,
  alertSent: "var(--wheat)",
  rising: "var(--wheat)",
  cooling: "var(--teal)",
  resolved: "var(--teal)",
};

export default function TimelineScrubber({
  pos,
  onPosChange,
  temp,
  clockText,
  status,
  inGap,
  segments,
  limit,
}: {
  pos: number;
  onPosChange: (pos: number) => void;
  temp: number;
  clockText: string;
  status: keyof typeof chart.status;
  inGap: boolean;
  segments: CurveSegments;
  limit: number;
}) {
  const trackRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);

  function setFractionFromClientX(clientX: number) {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width) return;
    const viewBoxX = ((clientX - rect.left) / rect.width) * 1000;
    onPosChange(clamp((viewBoxX - CHART_X0) / (CHART_X1 - CHART_X0), 0, 1));
  }

  const statusColor = STATUS_COLOR[status] ?? "var(--teal)";
  const hx = chartX(pos);
  const hy = chartY(temp);

  // Chart-relative labels are plain HTML, not SVG <text> — SVG text scales
  // down with the viewBox and becomes illegible on narrow screens (the whole
  // point of a fluid chart), while HTML text keeps its own readable size
  // regardless of how wide the chart itself renders.
  return (
    <div className="rounded-2xl border border-line/20 bg-ink-soft p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-paper/70">
            {chart.title}
          </p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-4xl text-paper sm:text-5xl">
              {temp.toFixed(1)}°C
            </span>
            <span className="text-base text-paper/70">at {clockText}</span>
          </div>
          <p className="mt-1.5 text-[13px] text-wheat-light">
            {chart.safeLimitLabel(`${limit}°C`)}
          </p>
        </div>
        <div className="flex items-center gap-2.5 rounded-full border border-paper/15 px-4 py-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-200"
            style={{ backgroundColor: statusColor }}
          />
          <span className="text-[15px] font-medium text-paper">{chart.status[status]}</span>
        </div>
      </div>

      <svg
        ref={trackRef}
        viewBox="0 0 1000 210"
        role="slider"
        tabIndex={0}
        aria-label={chart.sliderLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos * 100)}
        className="mt-6 w-full touch-none outline-none focus-visible:ring-2 focus-visible:ring-wheat focus-visible:ring-offset-4 focus-visible:ring-offset-ink-soft"
        style={{ overflow: "visible", cursor: "ew-resize" }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
          setFractionFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging) setFractionFromClientX(e.clientX);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={(e) => {
          const delta = e.key === "ArrowRight" ? 0.005 : e.key === "ArrowLeft" ? -0.005 : 0;
          if (!delta) return;
          e.preventDefault();
          onPosChange(clamp(pos + delta, 0, 1));
        }}
      >
        <rect
          x={chartX(0.3)}
          y={24}
          width={chartX(0.375) - chartX(0.3)}
          height={172}
          fill="var(--ink)"
        />
        <line x1={70} y1={196} x2={960} y2={196} stroke="var(--line)" strokeWidth={2} />
        <line
          x1={70}
          y1={chartY(limit)}
          x2={960}
          y2={chartY(limit)}
          stroke="var(--wheat)"
          strokeWidth={2}
          strokeDasharray="8 8"
          opacity={0.6}
        />
        <path d={segments.cool} stroke="var(--teal)" strokeWidth={4} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path
          d={segments.hot}
          stroke={DANGER}
          strokeWidth={4}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="transition-opacity duration-500 motion-reduce:transition-none"
          opacity={segments.hot ? 1 : 0}
        />
        <path d={segments.gap} stroke="var(--paper)" strokeWidth={4} fill="none" strokeDasharray="6 9" strokeLinecap="round" opacity={0.35} />
        <line
          x1={hx}
          y1={18}
          x2={hx}
          y2={204}
          stroke="var(--paper)"
          strokeWidth={2}
          opacity={0.4}
          className={dragging ? "" : "transition-[x1,x2] duration-500 ease-out motion-reduce:transition-none"}
        />
        <circle
          cx={hx}
          cy={hy}
          r={10}
          fill={statusColor}
          stroke="var(--ink-soft)"
          strokeWidth={3}
          className={dragging ? "" : "transition-[cx,cy] duration-500 ease-out motion-reduce:transition-none"}
        />
      </svg>

      <div className="mt-2 flex justify-between text-[13px] text-paper/70">
        <span>{chart.startLabel}</span>
        <span>{chart.endLabel}</span>
      </div>

      {inGap && (
        <p className="animate-fade-in mt-4 rounded-lg border-l-[3px] border-paper/30 bg-ink px-5 py-4 text-[15px] leading-relaxed text-paper">
          No signal here — still recording, and it syncs once back in range.
        </p>
      )}
      <p className="mt-4 text-sm text-paper/70">{chart.hint}</p>
    </div>
  );
}
