"use client";

import { useState } from "react";
import { faqLabel, faqs } from "@/lib/content/howItWorksDemo";

export default function FaqAccordion({ hint }: { hint: string }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="mt-16 border-t border-line pt-10 sm:mt-20 sm:pt-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-deep">{faqLabel}</p>
      <p className="mt-2 text-base text-ink/70">{hint}</p>

      <div className="mt-6 border-t border-line">
        {faqs.map((faq) => {
          const open = openKey === faq.key;
          return (
            <div key={faq.key} className="border-b border-line">
              <button
                type="button"
                onClick={() => setOpenKey(open ? null : faq.key)}
                aria-expanded={open}
                className="flex w-full items-baseline justify-between gap-6 py-5 text-left transition-colors hover:text-teal-deep"
              >
                <span className="font-display text-lg leading-snug text-ink sm:text-xl">
                  {faq.question}
                </span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 text-2xl font-light text-ink/55 transition-transform duration-150 ease-out ${open ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-3xl pb-6 text-[16px] leading-relaxed text-ink/65">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
