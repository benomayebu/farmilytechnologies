/**
 * Pure math for the interactive shipment demo — no React, no DOM. Kept
 * separate so the curve tuning (which drives the demo's whole narrative:
 * "caught early, not a write-off") can be reasoned about and adjusted
 * without touching rendering code.
 *
 * Tuning notes: peak 9.4°C, flagged ~24 min before the safe limit is
 * crossed, ~36 min spent above it — a caught-early event, not a 90+ minute
 * excursion. The wobble term is cosmetic (keeps the "in range" stretches
 * from looking like a dead flat line).
 */

export const TRIP_MINUTES = 14 * 60;

export const FAULT_START = 0.52;
export const RISE_SPAN = 0.065;
export const RECOVER_SPAN = 0.055;
export const ALERT_AT = FAULT_START + 0.006;
export const GAP_START = 0.3;
export const GAP_END = 0.375;

const PEAK_TEMP = 9.4;
const BASE_TEMP = 2.0;
const FLOOR_TEMP = 2.7;

export const CHART_X0 = 70;
export const CHART_X1 = 960;
export const CHART_Y0 = 24;
export const CHART_Y1 = 196;
export const CHART_TEMP_MAX = 12;

function smoothStep(t: number): number {
  const u = Math.min(1, Math.max(0, t));
  return u * u * (3 - 2 * u);
}

function easeOutCubic(t: number): number {
  const u = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - u, 3);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Temperature at a point in the trip (0-1), with or without the fault. */
export function temperatureAt(fraction: number, fault: boolean): number {
  const wobble = 0.34 * Math.sin(fraction * 41) + 0.19 * Math.sin(fraction * 11);
  if (!fault || fraction <= FAULT_START) return BASE_TEMP + wobble;
  if (fraction <= FAULT_START + RISE_SPAN) {
    const t = smoothStep((fraction - FAULT_START) / RISE_SPAN);
    return BASE_TEMP + (PEAK_TEMP - BASE_TEMP) * t + wobble * 0.3;
  }
  if (fraction <= FAULT_START + RISE_SPAN + RECOVER_SPAN) {
    const t = easeOutCubic((fraction - FAULT_START - RISE_SPAN) / RECOVER_SPAN);
    return PEAK_TEMP - (PEAK_TEMP - FLOOR_TEMP) * t + wobble * 0.3;
  }
  return FLOOR_TEMP + wobble;
}

/** First fraction where the curve crosses `limit`, searching forward (dir 1) or backward (dir -1) through the fault window. */
export function findCrossing(limit: number, dir: 1 | -1): number {
  const lo = dir > 0 ? FAULT_START : FAULT_START + RISE_SPAN;
  const hi = dir > 0 ? FAULT_START + RISE_SPAN : FAULT_START + RISE_SPAN + RECOVER_SPAN;
  for (let f = lo; f <= hi; f += 0.0008) {
    const above = temperatureAt(f, true) >= limit;
    if (dir > 0 ? above : !above) return f;
  }
  return hi;
}

export function chartX(fraction: number): number {
  return CHART_X0 + fraction * (CHART_X1 - CHART_X0);
}

export function chartY(temp: number): number {
  return CHART_Y1 - (clamp(temp, 0, CHART_TEMP_MAX) / CHART_TEMP_MAX) * (CHART_Y1 - CHART_Y0);
}

export function formatClock(fraction: number): string {
  const totalMinutes = Math.round(fraction * TRIP_MINUTES);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}h ${minutes}m`;
}

export type CurveSegments = { cool: string; hot: string; gap: string };

/** Builds three SVG path strings (in-range, over-limit, signal-gap) for the full trip curve. */
export function buildCurveSegments(fault: boolean, limit: number): CurveSegments {
  const segments: Record<"cool" | "hot" | "gap", string[]> = { cool: [], hot: [], gap: [] };
  let previousKey: string | null = null;

  for (let i = 0; i <= 300; i++) {
    const fraction = i / 300;
    const key: "cool" | "hot" | "gap" =
      fraction >= GAP_START && fraction <= GAP_END
        ? "gap"
        : temperatureAt(fraction, fault) >= limit
          ? "hot"
          : "cool";
    const point = `${chartX(fraction).toFixed(1)} ${chartY(temperatureAt(fraction, fault)).toFixed(1)}`;
    segments[key].push(`${key === previousKey ? "L" : "M"}${point}`);
    previousKey = key;
  }

  return {
    cool: segments.cool.join(" "),
    hot: segments.hot.join(" "),
    gap: segments.gap.join(" "),
  };
}
