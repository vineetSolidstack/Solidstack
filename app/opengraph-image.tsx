import { ImageResponse } from "next/og";

export const alt = "SolidStack — Never miss a booking again";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background:
            "radial-gradient(circle at 50% 0%, rgba(109,94,248,0.45), #08080B 65%)",
          backgroundColor: "#08080B",
          color: "#F4F4F7",
        }}
      >
        <div style={{ fontSize: 34, color: "#C3C3CE" }}>SolidStack</div>
        <div
          style={{
            marginTop: 28,
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: -3,
            lineHeight: 1.05,
          }}
        >
          Never miss a booking again.
        </div>
        <div style={{ marginTop: 32, fontSize: 36, color: "#C3C3CE" }}>
          A website and an AI receptionist, live in 7 days.
        </div>
      </div>
    ),
    size,
  );
}
