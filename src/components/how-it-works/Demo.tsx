"use client";

import { useState, type CSSProperties } from "react";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import TimelineScrubber from "@/components/how-it-works/TimelineScrubber";
import PairingChecklist from "@/components/how-it-works/PairingChecklist";
import SealedReport from "@/components/how-it-works/SealedReport";
import FaqAccordion from "@/components/how-it-works/FaqAccordion";
import { useShipmentDemoState } from "@/components/how-it-works/useShipmentDemoState";
import { FAULT_START } from "@/lib/shipmentPhysics";
import { faqHints, intro, steps, warn, watch } from "@/lib/content/howItWorksDemo";

const SAFE_LIMIT = 6;

export default function HowItWorksDemo() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [pos, setPos] = useState(0.12);
  const [fault, setFault] = useState(false);

  function goToStep(n: number) {
    setDirection(n >= step ? 1 : -1);
    setStep(n);
  }

  const demo = useShipmentDemoState(pos, fault, SAFE_LIMIT);
  const showTimeline = step === 2 || step === 3;

  return (
    <section className="border-t border-line bg-paper">
      <Container className="py-20 sm:py-28">
        <div className="max-w-2xl">
          <Eyebrow>{intro.eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-3xl text-ink sm:text-4xl sm:tracking-[-0.03em]">
            {intro.headline}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/65">{intro.body}</p>
        </div>

        {/* Step nav */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4 sm:gap-4">
          {steps.map((s, i) => {
            const n = i + 1;
            const active = step === n;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => goToStep(n)}
                aria-current={active ? "step" : undefined}
                className="flex flex-col gap-3 py-1 text-left"
              >
                <span
                  className={`block h-1 rounded-full transition-colors duration-300 ${active ? "bg-teal" : "bg-line"}`}
                />
                <span className="flex items-baseline gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`font-display text-[15px] font-semibold transition-colors duration-300 ${active ? "text-teal-deep" : "text-ink/55"}`}
                  >
                    0{n}
                  </span>
                  <span className="text-[15px] text-ink">{s.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <div
          key={step}
          className="animate-step-in mt-12 sm:mt-14"
          style={{ "--step-enter-x": direction > 0 ? "12px" : "-12px" } as CSSProperties}
        >
          {step === 1 && <PairingChecklist />}

          {step === 2 && (
            <div className="max-w-2xl">
              <h3 className="font-display text-2xl text-ink sm:text-3xl">{watch.headline}</h3>
              <p className="mt-4 text-lg leading-relaxed text-ink/65">{watch.body}</p>
            </div>
          )}

          {step === 3 && (
            <div className="grid items-start gap-10 md:grid-cols-[1fr_1fr] md:gap-14">
              <div>
                <h3 className="font-display text-2xl text-ink sm:text-3xl">{warn.headline}</h3>
                <p className="mt-4 text-lg leading-relaxed text-ink/65">{warn.body}</p>
                {!fault ? (
                  <button
                    type="button"
                    onClick={() => {
                      setFault(true);
                      setPos(FAULT_START - 0.008);
                    }}
                    className="mt-7 inline-flex items-center gap-3 rounded-xl bg-wheat px-6 py-4 text-[17px] font-semibold text-ink transition-colors duration-200 hover:brightness-95 active:scale-[0.98]"
                  >
                    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                      <path d="M12.4 1.5 3 12.2h6L8.6 20.5 18 9.8h-6z" fill="currentColor" />
                    </svg>
                    {warn.breakCta}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setFault(false);
                      setPos(0.12);
                    }}
                    className="mt-7 rounded-xl border border-line px-6 py-4 text-[16px] text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
                  >
                    {warn.resetCta}
                  </button>
                )}
              </div>

              <div className="min-h-[220px] rounded-2xl border border-line bg-paper-deep p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/70">
                  {warn.panelLabel}
                </p>

                {!fault && (
                  <p className="animate-fade-in mt-5 text-[17px] leading-relaxed text-ink/65">
                    {warn.noEvent}
                  </p>
                )}

                {fault && !demo.alertSent && (
                  <p className="animate-fade-in mt-5 text-[17px] leading-relaxed text-ink/65">
                    {warn.watching(demo.faultAtText)}
                  </p>
                )}

                {demo.predicting && (
                  <div className="animate-fade-in mt-5 rounded-xl border border-wheat bg-wheat/10 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7d5816]">
                      {warn.predictionLabel}
                    </p>
                    <p className="mt-2 font-display text-xl leading-snug text-ink sm:text-2xl">
                      {warn.prediction(`${SAFE_LIMIT}°C`, demo.predictedMinutes)}
                    </p>
                  </div>
                )}

                {demo.alertSent && (
                  <div className="animate-pop-in mt-5 flex items-start gap-4">
                    <svg width="38" height="60" viewBox="0 0 46 76" fill="none" aria-hidden="true" className="mt-1 shrink-0">
                      <rect x="1.5" y="1.5" width="43" height="73" rx="7" stroke="var(--teal)" strokeWidth={3} />
                      <rect x="16" y="7" width="14" height="3" rx="1.5" fill="var(--teal)" />
                      <circle cx="23" cy="66" r="3.4" fill="var(--teal)" />
                    </svg>
                    <div className="rounded-2xl rounded-bl-md bg-teal-deep px-5 py-4 text-[15px] leading-relaxed text-paper">
                      {warn.alert.message}
                      <p className="mt-2 text-[13px] text-paper/80">{warn.alert.sentAt(demo.sentAtText)}</p>
                    </div>
                  </div>
                )}

                {demo.breached && (
                  <p className="animate-fade-in mt-5 text-[15.5px] leading-relaxed text-[#9A3A30]">
                    {warn.breached(demo.leadMinutes)}
                  </p>
                )}
                {demo.resolved && (
                  <p className="animate-fade-in mt-5 text-[15.5px] leading-relaxed text-teal-deep">
                    {warn.resolved(demo.excursionMinutes)}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <SealedReport
              fault={fault}
              excursionMinutes={demo.excursionMinutes}
              leadMinutes={demo.leadMinutes}
            />
          )}
        </div>

        {/* Shared timeline — steps 2 and 3 */}
        {showTimeline && (
          <div className="mt-10">
            <TimelineScrubber
              pos={pos}
              onPosChange={setPos}
              temp={demo.temp}
              clockText={demo.clockText}
              status={demo.status}
              inGap={demo.inGap}
              segments={demo.segments}
              limit={SAFE_LIMIT}
            />
          </div>
        )}

        {/* Prev/Next */}
        <div className="mt-10 flex flex-wrap gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={() => goToStep(step - 1)}
              className="rounded-xl border border-line px-6 py-3.5 text-[16px] text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
            >
              Back
            </button>
          )}
          {step < 4 && (
            <button
              type="button"
              onClick={() => goToStep(step + 1)}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-teal-deep px-6 py-3.5 text-[16px] font-medium text-paper transition-colors duration-200 hover:bg-ink active:scale-[0.98]"
            >
              {step === 1 ? "See it watching" : step === 2 ? "Break it on purpose" : "See the proof"}
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </button>
          )}
        </div>

        <FaqAccordion hint={faqHints[step - 1]} />
      </Container>
    </section>
  );
}
