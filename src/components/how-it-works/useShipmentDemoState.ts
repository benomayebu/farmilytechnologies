import { useMemo } from "react";
import {
  ALERT_AT,
  FAULT_START,
  GAP_END,
  GAP_START,
  RECOVER_SPAN,
  RISE_SPAN,
  TRIP_MINUTES,
  buildCurveSegments,
  findCrossing,
  formatClock,
  temperatureAt,
} from "@/lib/shipmentPhysics";

export type ShipmentStatus =
  | "inRange"
  | "noSignal"
  | "aboveLimit"
  | "alertSent"
  | "rising"
  | "cooling"
  | "resolved";

export function useShipmentDemoState(pos: number, fault: boolean, limit: number) {
  return useMemo(() => {
    const temp = temperatureAt(pos, fault);
    const inGap = pos >= GAP_START && pos <= GAP_END;
    const crossUp = fault ? findCrossing(limit, 1) : 1;
    const crossDown = fault ? findCrossing(limit, -1) : 1;

    const rising = fault && pos > FAULT_START && pos < FAULT_START + RISE_SPAN;
    const falling = fault && pos >= FAULT_START + RISE_SPAN && pos < FAULT_START + RISE_SPAN + RECOVER_SPAN;
    const breached = fault && temp >= limit;
    const alertSent = fault && pos >= ALERT_AT;
    const predicting = alertSent && !breached && rising;
    const resolved = fault && pos >= crossDown;

    let status: ShipmentStatus = "inRange";
    if (inGap) status = "noSignal";
    else if (breached) status = "aboveLimit";
    else if (predicting) status = "alertSent";
    else if (rising) status = "rising";
    else if (falling) status = "cooling";
    else if (resolved) status = "resolved";

    const segments = buildCurveSegments(fault, limit);

    return {
      temp,
      inGap,
      rising,
      falling,
      breached,
      alertSent,
      predicting,
      resolved,
      status,
      segments,
      clockText: formatClock(pos),
      faultAtText: formatClock(FAULT_START),
      sentAtText: formatClock(ALERT_AT),
      predictedMinutes: Math.max(1, Math.round((crossUp - pos) * TRIP_MINUTES)),
      leadMinutes: Math.round((crossUp - ALERT_AT) * TRIP_MINUTES),
      excursionMinutes: Math.round((crossDown - crossUp) * TRIP_MINUTES),
    };
  }, [pos, fault, limit]);
}
