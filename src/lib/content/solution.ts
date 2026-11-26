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

/**
 * Real screens from a FARMILY development build, captured from a local run on
 * simulated trips. Test labels (lot codes, account names) were swapped for
 * plain demo names; every reading, status and banner is as the app shows it.
 */
export const appScreens = {
  eyebrow: "Inside FARMILY",
  headline: "Real screens, on simulated trips.",
  sub: "These screens come from a development build of FARMILY, running on trips from our simulator. Alerts, the web screens and the first real sensor are still in progress.",
  items: [
    {
      key: "shipments",
      title: "Every lot in one list.",
      body: "Status, lane and the last 24 hours of readings for each shipment. Flagged lots stand out.",
      image: "/images/app/shipments.png",
      width: 1600,
      height: 1075,
      alt: "FARMILY shipments list showing nine simulated lots. Two are flagged, the rest are on track, draft or delivered.",
    },
    {
      key: "lot",
      title: "See what went wrong, and when.",
      body: "The temperature line, the limits and events like a power loss, on one screen.",
      image: "/images/app/lot.png",
      width: 1600,
      height: 1075,
      alt: "A flagged simulated lot of chilled lobster. The chart shows the temperature rising to 9.4 °C after a power loss, then recovering. 75.8% of the trip was in spec.",
    },
    {
      key: "alert",
      title: "An alert page made for a phone.",
      body: "One tap tells the team someone has seen the alert, so it stops going to the next person. How alerts get sent, by text or another channel, is not set yet.",
      image: "/images/app/alert-phone.png",
      width: 780,
      height: 1688,
      alt: "A critical alert on a phone for a simulated lot of chilled lamb: peak 9.4 °C against a 5 °C limit, with an I've seen this button.",
      phone: true,
    },
    {
      key: "report",
      title: "A report anyone can check.",
      body: "Each report is built from sealed records. FARMILY checks that nothing has changed since they were sealed.",
      image: "/images/app/report.png",
      width: 1600,
      height: 1075,
      alt: "A simulated lot report: no temperature excursion, 100% time in spec, and a Verified badge confirming the sealed records are unchanged.",
    },
  ],
} as const;
