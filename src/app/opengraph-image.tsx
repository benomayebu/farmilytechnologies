import { ImageResponse } from "next/og";
import { hero } from "@/lib/content/home";

// Share card for links to the site. Built from the same copy as the home
// hero, so the two can't drift apart.
export const alt = `FARMILY. ${hero.headline} ${hero.subLine}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#10263a",
          color: "#f8fafb",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#c4cdd5",
            }}
          >
            Compliance software for food supply chains
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.08,
              maxWidth: 900,
            }}
          >
            {hero.headline}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.4,
              maxWidth: 880,
              color: "#c4cdd5",
            }}
          >
            {hero.subLine}
          </div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 6 }}>
          FARMILY
        </div>
      </div>
    ),
    { ...size },
  );
}
