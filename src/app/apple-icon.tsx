import { ImageResponse } from "next/og";

// iOS "add to home screen" icon — generated at build time
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ff5c8a 0%, #8b5cf6 100%)",
        }}
      >
        <svg width="124" height="124" viewBox="0 0 64 64">
          <path
            d="M32 55 C 30 53, 7 39, 7 22.5 C 7 15, 12.5 9.5, 19.5 9.5 C 25 9.5, 29.5 12.5, 32 17 C 34.5 12.5, 39 9.5, 44.5 9.5 C 51.5 9.5, 57 15, 57 22.5 C 57 39, 34 53, 32 55 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    ),
    size,
  );
}
