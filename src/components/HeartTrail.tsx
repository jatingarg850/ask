"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Heart = {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: string;
  rise: number;
  drift: number;
  spin: number;
};

const HUES = ["#ff5c8a", "#ffb86b", "#8b5cf6", "#f472b6", "#22d3ee"];
const MAX = 24;
const EVERY_MS = 55;

// little hearts that trail behind the finger / cursor everywhere
export default function HeartTrail() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const last = useRef(0);
  const nextId = useRef(0);

  useEffect(() => {
    const spawn = (x: number, y: number) => {
      const now = performance.now();
      if (now - last.current < EVERY_MS) return;
      last.current = now;
      const id = nextId.current++;
      const heart: Heart = {
        id,
        x,
        y,
        size: 10 + Math.random() * 12,
        hue: HUES[id % HUES.length],
        rise: 40 + Math.random() * 40,
        drift: (Math.random() - 0.5) * 40,
        spin: (Math.random() - 0.5) * 60,
      };
      setHearts((h) => [...h.slice(-(MAX - 1)), heart]);
      setTimeout(() => setHearts((h) => h.filter((k) => k.id !== id)), 900);
    };
    const onMove = (e: PointerEvent) => {
      // on touch only trail while the finger is down
      if (e.pointerType === "touch" && e.buttons === 0) return;
      spawn(e.clientX, e.clientY);
    };
    const onDown = (e: PointerEvent) => spawn(e.clientX, e.clientY);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            className="absolute select-none"
            style={{ left: h.x, top: h.y, fontSize: h.size, color: h.hue }}
            initial={{ opacity: 0.9, scale: 0.4, x: "-50%", y: "-50%" }}
            animate={{
              opacity: 0,
              scale: 1.2,
              y: `calc(-50% - ${h.rise}px)`,
              x: `calc(-50% + ${h.drift}px)`,
              rotate: h.spin,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            ♥
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
