export const intro = {
  eyebrow: "Try it yourself",
  headline: "Four things happen to every shipment.",
  body: "Step through it, drag the timeline, break it on purpose. Nothing here is a video.",
};

export const steps = [
  { key: "pair", label: "Sensor goes in" },
  { key: "watch", label: "It watches" },
  { key: "warn", label: "It warns first" },
  { key: "proof", label: "Sealed proof" },
] as const;

export const shipment = {
  id: "SR-5182",
  description: "Example trip · Chilled seafood · Dubai → Riyadh",
};

export const pairing = {
  headline: "A sensor is added to the shipment.",
  body: "Four taps at the loading dock. Then the door closes and nobody has to remember anything.",
  checklist: [
    "Scan the sensor's code",
    "Pick the shipment",
    "Set the example limit: 6°C",
    "Seal it and shut the door",
  ],
  ctaLabels: [
    "Tap to scan",
    "Tap to pick the shipment",
    "Tap to set the range",
    "Tap to seal",
  ],
  doneLabel: "Paired. Logging every 5 minutes.",
  whoseSensor: {
    toggle: "Whose sensor is it?",
    body: "FARMILY doesn't make sensors. The plan is to read the ones already on the market: travelling trackers (the category Tive builds) and fixed cold-store probes (the category Monnit builds). No real device is connected yet.",
    caveat: "Named as categories only. No partnership exists yet.",
  },
};

export const watch = {
  headline: "It watches the whole way, signal or no signal.",
  body: "Drag the handle across the trip. Most of it is uneventful, which is the point. Pass through the grey band to see what happens when the truck loses signal.",
};

export const warn = {
  headline: "It watches the pattern, not just the number.",
  body: "A thermometer tells you the load is warm. FARMILY tells you it's going to be warm, while there's still time to act. Break the shipment and drag through it.",
  breakCta: "Simulate a power loss",
  resetCta: "Reset the shipment",
  panelLabel: "What FARMILY did",
  noEvent: "Nothing yet. The load is in range. Break it, then drag the handle past the fault.",
  watching: (clock: string) => `Power cut at ${clock}. Drag the handle forward through it.`,
  predictionLabel: "Prediction",
  prediction: (limit: string, mins: number) =>
    `May exceed ${limit} in ${mins} min if unaddressed`,
  alert: {
    message: "Idris, cargo temp climbing on SR-5182. Check reefer power at Stop 4.",
    sentAt: (time: string) => `Sent ${time} (simulated)`,
  },
  breached: (mins: number) => `Now above the example limit, but flagged ${mins} minutes before it got here.`,
  resolved: (mins: number) => `Power restored, load cooling. Total excursion ${mins} minutes. Recorded, not hidden.`,
};

export const proof = {
  headline: "One sealed report, at the end.",
  body: "This is the record a receiver or an inspector would check before accepting a load. It reflects the trip you just dragged through.",
  tamperToggle: "How is it tamper-evident?",
  tamperBody: "Each reading is locked to the one before it, so changing any single value after sealing breaks the chain visibly.",
  reportTitle: "Trip report",
  fields: {
    excursions: "Excursions",
    peakTemp: "Peak temperature",
    signalGaps: "Signal gaps",
    flagged: "Flagged",
  },
  signalGapsValue: "1 · backfilled",
  noExcursions: "None",
  noFlag: "Nothing to flag",
  cleanPeak: "2.4°C",
  footer: "Sealed. Any later change is detectable.",
};

export const chart = {
  title: "Cargo temperature · 14 hour trip",
  safeLimitLabel: (limit: string) => `example limit ${limit}`,
  startLabel: "0h",
  endLabel: "14h",
  gapLabel: "no signal",
  hint: "Drag the handle, or use the arrow keys.",
  sliderLabel: "Scrub the shipment timeline",
  status: {
    inRange: "In range",
    noSignal: "No signal",
    aboveLimit: "Above example limit",
    alertSent: "Alert sent",
    rising: "Rise detected",
    cooling: "Cooling",
    resolved: "Resolved",
  },
};

export const faqHints = [
  "Two worth opening here: whose hardware it is, and who pays for it.",
  "The offline question is answered in full below.",
  "Fair to ask at this point whether any of this exists yet.",
  "Including the one about blockchain.",
];

export const faqLabel = "The questions we actually get";

export const faqs = [
  {
    key: "tive",
    question: "Why not just use Tive or another sensor company directly?",
    answer:
      "They build excellent tracking hardware, priced and sold to enterprise logistics teams who live in dashboards. What they sell is visibility. FARMILY aims to turn that same sensor data into a sealed report a small importer can hand to a buyer or an inspector. That isn't in their product line.",
  },
  {
    key: "buys",
    question: "Who actually buys the sensor?",
    answer:
      "Most likely the distributor. It could come with a FARMILY subscription that includes the hardware, or they could connect sensors they already own. Pricing isn't set yet.",
  },
  {
    key: "offline",
    question: "What happens with no internet connection?",
    answer:
      "Most shipment sensors keep recording without a signal and send everything once they reconnect, like a fitness tracker that keeps counting steps when your phone is at home. FARMILY is built to take those late readings and put them in the right place on the timeline.",
  },
  {
    key: "chain",
    question: "Is this blockchain?",
    answer:
      "It borrows one idea from it: records linked together so none can be quietly changed. No cryptocurrency, no tokens, nothing to buy.",
  },
  {
    key: "real",
    question: "Is this a real product today?",
    answer:
      "It's a working prototype, built and tested with simulated data. We're looking for our first pilot partners. No deployed pilots, no customer list, and everything on this page is illustrative.",
  },
] as const;
