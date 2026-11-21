export const hero = {
  headline: "Supply Chain Compliance, Automated.",
  subLine:
    "Sensor monitoring, smart rules, early warnings and audit-ready records. Built for food distributors and importers, not enterprise budgets.",
  supportingLine:
    "When a shipment arrives, or an auditor asks for proof, you shouldn't have to scramble for it.",
  primaryCta: { label: "Talk to us about piloting", href: "/contact" },
  secondaryCta: { label: "See how it works", href: "/solution#demo" },
  status: "Working prototype. Tested with simulated sensors. First real device next.",
};

export const pillars = [
  {
    key: "sense",
    name: "Sense",
    description:
      "Continuous IoT monitoring of temperature, location, and handling events.",
  },
  {
    key: "detect",
    name: "Detect",
    description:
      "Smart rules and early warnings flag problems before they become a rejected shipment.",
  },
  {
    key: "prove",
    name: "Prove",
    description:
      "Tamper-evident, audit-ready records, generated in one click.",
  },
] as const;

export const videoSection = {
  eyebrow: "How it works",
  headline: "One shipment, from dock to proof.",
  body: "A sensor goes in with the cargo. FARMILY watches the whole route, catches problems early, and hands over a record anyone downstream can trust.",
};

export const demoTeaser = {
  eyebrow: "Try it yourself",
  headline: "Break a shipment on purpose.",
  body: "Step through one simulated trip. Cut the power, watch the early warning, and see the sealed report at the end.",
  cta: { label: "Try the demo", href: "/solution#demo" },
};

export const closingCta = {
  line: "Built and tested with simulated data. We're looking for our first pilot partners.",
  cta: "Talk to us about piloting",
};

// Hero report card. Numbers come from the FARMILY simulator's power_loss
// scenario (S2), a 2-hour run with one reading a minute. Always labelled
// as simulated.
export const heroReport = {
  title: "Sealed shipment report",
  lot: "Lot S2-DEMO · Chilled seafood",
  simulatedLabel: "Simulated data",
  chartLabel: "Temperature over 2 hours",
  limitLabel: "Limit 5°C",
  excursionNote: "Reefer power lost for 22 minutes. Peak 9.4°C.",
  stats: [
    { label: "Peak", value: "9.4°C" },
    { label: "Above limit", value: "22 min" },
    { label: "In spec", value: "98 of 120 min" },
  ],
  integrityLabel: "Sealed record unchanged",
  integrityValue: "Integrity: PASS",
  ariaLabel:
    "Example sealed shipment report, simulated data. Lot S2-DEMO, chilled seafood. Over a 2-hour run, reefer power was lost for 22 minutes and the temperature rose above the 5°C limit for 22 minutes, peaking at 9.4°C. In spec 98 of 120 minutes. Integrity check: pass.",
} as const;
