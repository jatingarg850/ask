"use client";

import { motion } from "framer-motion";

const blobs = [
  { color: "#ff5c8a", size: 560, left: "-12%", top: "-14%", dur: 18 },
  { color: "#8b5cf6", size: 640, left: "55%", top: "-5%", dur: 22 },
  { color: "#ffb86b", size: 440, left: "10%", top: "60%", dur: 20 },
  { color: "#22d3ee", size: 400, left: "65%", top: "65%", dur: 26 },
];

// hand-placed so server + client render identically (no Math.random in render)
const hearts = [
  { x: 6, delay: 0, dur: 16, size: 18, char: "♥" },
  { x: 16, delay: 3, dur: 20, size: 12, char: "♥" },
  { x: 27, delay: 7, dur: 18, size: 22, char: "♥" },
  { x: 38, delay: 1.5, dur: 24, size: 14, char: "♥" },
  { x: 49, delay: 9, dur: 17, size: 16, char: "♥" },
  { x: 58, delay: 4.5, dur: 21, size: 24, char: "♥" },
  { x: 67, delay: 11, dur: 19, size: 12, char: "♥" },
  { x: 76, delay: 2.5, dur: 23, size: 18, char: "♥" },
  { x: 85, delay: 6, dur: 16, size: 14, char: "♥" },
  { x: 93, delay: 8.5, dur: 22, size: 20, char: "♥" },
];

export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 65%)`,
            filter: "blur(48px)",
            opacity: 0.5,
          }}
          animate={{
            x: [0, 90, -70, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.18, 0.94, 1],
          }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {hearts.map((h, i) => (
        <motion.span
          key={i}
          className="absolute text-blush"
          style={{ left: `${h.x}%`, fontSize: h.size, bottom: -40 }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: "-110vh",
            x: [0, 20, -20, 10, 0],
            opacity: [0, 0.35, 0.35, 0],
            rotate: [0, 15, -10, 0],
          }}
          transition={{
            duration: h.dur,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {h.char}
        </motion.span>
      ))}

      {/* vignette + grain for that cinematic feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.7)_100%)]" />
      <div className="grain absolute inset-0 opacity-60" />
    </div>
  );
}
