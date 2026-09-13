"use client";

import { useState } from "react";
import { proof, shipment } from "@/lib/content/howItWorksDemo";

export default function SealedReport({
  fault,
  excursionMinutes,
  leadMinutes,
}: {
  fault: boolean;
  excursionMinutes: number;
  leadMinutes: number;
}) {
  const [tamperOpen, setTamperOpen] = useState(false);

  const excursionsValue = fault ? `1 · ${excursionMinutes} min` : proof.noExcursions;
  const peakValue = fault ? "9.4°C" : proof.cleanPeak;
  const flaggedValue = fault ? `In transit, ${leadMinutes} min early` : proof.noFlag;

  return (
    <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
      <div>
        <h3 className="font-display text-2xl text-ink sm:text-3xl">{proof.headline}</h3>
        <p className="mt-4 text-lg leading-relaxed text-ink/65">{proof.body}</p>
        <button
          type="button"
          onClick={() => setTamperOpen((v) => !v)}
          aria-expanded={tamperOpen}
          className="mt-7 inline-flex items-center rounded-lg border border-line px-5 py-3 text-[15px] font-medium text-teal-deep transition-colors hover:border-teal"
        >
          {proof.tamperToggle}
        </button>
        {tamperOpen && (
          <div className="animate-fade-in mt-4 rounded-lg border-l-[3px] border-teal bg-paper-deep px-6 py-5 text-[15px] leading-relaxed text-ink/80">
            {proof.tamperBody}
          </div>
        )}
      </div>

      <div key={fault ? "fault" : "clean"} className="animate-pop-in rounded-2xl border border-line bg-paper p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <svg width="42" height="42" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="shrink-0">
            <path d="M20 2l15 6v11c0 9.5-6.2 16.5-15 19C11.2 35.5 5 28.5 5 19V8z" fill="var(--teal)" />
            <path d="M13.5 20.5l4.7 4.7 8.6-9.4" stroke="var(--paper)" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p className="font-display text-xl text-ink">{proof.reportTitle}</p>
            <p className="mt-0.5 text-sm text-ink/55">{shipment.id} · {shipment.description}</p>
          </div>
        </div>

        <dl className="mt-2">
          {[
            [proof.fields.excursions, excursionsValue],
            [proof.fields.peakTemp, peakValue],
            [proof.fields.signalGaps, proof.signalGapsValue],
            [proof.fields.flagged, flaggedValue],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between border-t border-line py-3.5 text-[16px]">
              <dt className="text-ink/60">{label}</dt>
              <dd className="font-display font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex items-center gap-3 rounded-lg bg-teal/[0.08] px-4 py-3.5">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="shrink-0">
            <path d="M10 1l8 3.2v5.9c0 5.1-3.3 8.8-8 10.1-4.7-1.3-8-5-8-10.1V4.2z" fill="var(--teal-deep)" />
          </svg>
          <span className="text-sm text-teal-deep">{proof.footer}</span>
        </div>
      </div>
    </div>
  );
}
