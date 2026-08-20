export const intro = {
  eyebrow: "The solution",
  headline:
    "One mismatch between what the truck says and what the product actually experienced can mean a rejected load, a disputed claim, or a failed audit.",
  sub: "FARMILY closes that gap.",
};

export const pillars = [
  {
    key: "sense",
    name: "Continuous Monitoring",
    description:
      "Temperature, humidity, and location data captured throughout the journey — not just a single reading at pickup and drop-off.",
  },
  {
    key: "detect",
    name: "AI Exception Detection",
    description:
      "FARMILY flags a developing problem — a power disconnect, a door left open, a slow temperature drift — while there's still time to act, not after the shipment has already failed.",
  },
  {
    key: "prove",
    name: "Tamper-Evident Compliance Records",
    description:
      "When an auditor or buyer asks for proof, generate a complete, verifiable record in minutes — not a scramble through PDFs and spreadsheets.",
  },
] as const;

export const segments = [
  {
    key: "distributors",
    name: "Distributors & Importers",
    line: "Stay audit-ready without hiring a compliance team.",
    // Photo: Unsplash, "white truck parked near white building" — unsplash.com/photos/crHhZlES310
    image: "/images/segment-distributors.jpg",
  },
  {
    key: "coldstorage",
    name: "Cold Storage & Logistics Operators",
    line: "Give your customers proof, not promises.",
    // Photo: Unsplash, "a warehouse filled with lots of shelves filled with boxes" by Brayden Prato — unsplash.com/photos/If5vloAJSBQ
    image: "/images/segment-coldstorage.jpg",
  },
] as const;

export const statusNote =
  "FARMILY is currently in active development, working directly with early pilot partners to shape the product around real operational needs.";
