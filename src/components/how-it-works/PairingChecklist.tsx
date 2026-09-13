"use client";

import { useState } from "react";
import { pairing } from "@/lib/content/howItWorksDemo";

function CheckIcon({ done }: { done: boolean }) {
  return done ? (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="13" cy="13" r="13" fill="var(--teal)" />
      <path d="M7.5 13.5l3.8 3.8L18.5 9" stroke="var(--paper)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="13" cy="13" r="11.4" stroke="var(--paper)" strokeOpacity={0.25} strokeWidth={2.8} />
    </svg>
  );
}

export default function PairingChecklist() {
  const [progress, setProgress] = useState(0);
  const [tipOpen, setTipOpen] = useState(false);
  const done = progress >= pairing.checklist.length;

  return (
    <div className="grid items-start gap-10 md:grid-cols-2 md:gap-14">
      <div>
        <h3 className="font-display text-2xl text-ink sm:text-3xl">{pairing.headline}</h3>
        <p className="mt-4 text-lg leading-relaxed text-ink/65">{pairing.body}</p>
        <button
          type="button"
          onClick={() => setTipOpen((v) => !v)}
          aria-expanded={tipOpen}
          className="mt-7 inline-flex items-center gap-2.5 rounded-lg border border-line px-5 py-3 text-[15px] font-medium text-teal-deep transition-colors hover:border-teal"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth={2} />
            <path d="M10 9v5" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
            <circle cx="10" cy="6" r="1.3" fill="currentColor" />
          </svg>
          {pairing.whoseSensor.toggle}
        </button>
        {tipOpen && (
          <div className="animate-fade-in mt-4 rounded-lg border-l-[3px] border-teal bg-paper-deep px-6 py-5 text-[15px] leading-relaxed text-ink/80">
            {pairing.whoseSensor.body}
            <p className="mt-3 text-sm text-ink/50">{pairing.whoseSensor.caveat}</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-line bg-paper-deep p-6 sm:p-8">
        <div className="flex flex-col">
          {pairing.checklist.map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-4 border-b border-line py-4 last:border-b-0 ${i > progress ? "opacity-40" : ""}`}
            >
              <CheckIcon done={i < progress} />
              <span className="text-[17px] text-ink">{item}</span>
            </div>
          ))}
        </div>

        {!done ? (
          <button
            type="button"
            onClick={() => setProgress((p) => Math.min(pairing.checklist.length, p + 1))}
            className="mt-6 w-full rounded-xl bg-teal px-6 py-4 text-[17px] font-semibold text-paper transition-colors duration-200 hover:bg-teal-deep active:scale-[0.98]"
          >
            {pairing.ctaLabels[progress]}
          </button>
        ) : (
          <div className="animate-pop-in mt-6 flex items-center gap-3.5 rounded-xl border border-teal/40 bg-teal/[0.08] px-5 py-4">
            <svg width="24" height="24" viewBox="0 0 26 26" fill="none" aria-hidden="true" className="shrink-0">
              <circle cx="13" cy="13" r="13" fill="var(--teal)" />
              <path d="M7.5 13.5l3.8 3.8L18.5 9" stroke="var(--paper)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[17px] font-medium text-ink">{pairing.doneLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
