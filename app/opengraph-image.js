import { ImageResponse } from "next/og";

export const alt = "The World of Samay Raina — an independent fan tribute";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 85% 20%, #5a0a12 0%, #0a0a0b 55%)",
          color: "#f5f5f4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, letterSpacing: 8, color: "#ff2e3f" }}>
          <div style={{ width: 60, height: 2, background: "#ff2e3f" }} />
          AN INDEPENDENT FAN TRIBUTE
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 120, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4 }}>
          <span style={{ fontSize: 40, letterSpacing: 6, color: "#a8a29e" }}>THE WORLD OF</span>
          <span>SAMAY</span>
          <span style={{ color: "#ff2e3f" }}>RAINA</span>
        </div>
        <div style={{ fontSize: 30, fontStyle: "italic", color: "#d6d3d1" }}>
          Comedy. Chaos. Creativity. Unfiltered Entertainment.
        </div>
      </div>
    ),
    size
  );
}
