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
      "Built to capture temperature, humidity and location for the whole journey, not just one reading at pickup and drop-off. Tested with simulated sensors so far.",
  },
  {
    key: "detect",
    name: "Smart Rules and Early Warnings",
    description:
      "FARMILY is built to flag a problem while it is still developing: a power cut, a door left open, a slow temperature drift. The aim is time to act before the shipment fails. Tested on simulated trips so far.",
  },
  {
    key: "prove",
    name: "Tamper-Evident Compliance Records",
    description:
      "When an auditor or buyer asks for proof, you hand over a report built from sealed records. Each record is hash-chained and signed, so it can be checked offline. No scramble through PDFs and spreadsheets.",
  },
] as const;

export const segments = [
  {
    key: "distributors",
    name: "Distributors & Importers",
    line: "Records built for audits, without an enterprise budget.",
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
  "FARMILY is in active development. It is built and tested with simulated data, and we're looking for our first pilot partners.";
