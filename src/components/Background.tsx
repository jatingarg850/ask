"use client";

import { motion } from "framer-motion";

// deterministic pseudo-random so server + client render the same sky
function seeded(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = seeded(7);

const stars = Array.from({ length: 56 }, () => ({
  x: rand() * 100,
  y: rand() * 100,
  s: 1 + rand() * 2.2,
  delay: rand() * 4,
  dur: 2 + rand() * 3,
}));

const blobs = [
  { color: "#ff7eb3", size: 560, left: "-12%", top: "-14%", dur: 18 },
  { color: "#a78bfa", size: 640, left: "55%", top: "-5%", dur: 22 },
  { color: "#ffd166", size: 440, left: "8%", top: "58%", dur: 20 },
  { color: "#5eead4", size: 400, left: "62%", top: "62%", dur: 26 },
];

const floaters = [
  { x: 6, delay: 0, dur: 16, size: 18, char: "♥", color: "#ff7eb3" },
  { x: 15, delay: 3, dur: 20, size: 14, char: "✦", color: "#ffd166" },
  { x: 26, delay: 7, dur: 18, size: 22, char: "♥", color: "#ff9ec6" },
  { x: 37, delay: 1.5, dur: 24, size: 16, char: "✧", color: "#c4b5fd" },
  { x: 48, delay: 9, dur: 17, size: 16, char: "♥", color: "#ff7eb3" },
  { x: 57, delay: 4.5, dur: 21, size: 24, char: "✦", color: "#5eead4" },
  { x: 66, delay: 11, dur: 19, size: 12, char: "♥", color: "#ffb86b" },
  { x: 75, delay: 2.5, dur: 23, size: 18, char: "✧", color: "#ffd166" },
  { x: 85, delay: 6, dur: 16, size: 14, char: "♥", color: "#ff9ec6" },
  { x: 93, delay: 8.5, dur: 22, size: 20, char: "✦", color: "#c4b5fd" },
];

export default function Background() {
  return (
    <div className="sky pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* aurora blobs */}
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 62%)`,
            filter: "blur(44px)",
            opacity: 0.6,
          }}
          animate={{
            x: [0, 90, -70, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.18, 0.94, 1],
          }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* twinkling stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="twinkle absolute rounded-full bg-white"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              boxShadow: "0 0 6px rgba(255,255,255,0.9)",
              "--delay": `${s.delay}s`,
              "--dur": `${s.dur}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* floating hearts + sparkles */}
      {floaters.map((h, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ left: `${h.x}%`, fontSize: h.size, bottom: -40, color: h.color }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: "-110vh",
            x: [0, 20, -20, 10, 0],
            opacity: [0, 0.6, 0.6, 0],
            rotate: [0, 25, -15, 0],
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

      {/* soft vignette + grain for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(20,5,50,0.55)_100%)]" />
      <div className="grain absolute inset-0 opacity-50" />
    </div>
  );
}
