"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { config } from "@/lib/config";
import { sfx } from "@/lib/sfx";
import { say } from "@/lib/voice";
import YesNo from "./YesNo";

const words = config.question.split(" ");

const COLORS = [
  "#ff5c8a",
  "#8b5cf6",
  "#ffb86b",
  "#22d3ee",
  "#f472b6",
  "#a3e635",
  "#fb7185",
  "#c084fc",
  "#34d399",
  "#fbbf24",
];

// lay balloons out on a loose grid; the last row is centred
function layout(n: number) {
  const cols = n <= 4 ? 2 : 3;
  const rows = Math.ceil(n / cols);
  return Array.from({ length: n }, (_, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const inRow = Math.min(cols, n - row * cols);
    const jitterX = (((i * 7) % 5) - 2) * 2.5;
    const jitterY = (((i * 11) % 5) - 2) * 2;
    return {
      left: ((col + 0.5) / inRow) * 100 + jitterX,
      top: ((row + 0.5) / rows) * 100 + jitterY,
    };
  });
}

const positions = layout(words.length);

export default function Balloons({ onYes }: { onYes: () => void }) {
  const [popped, setPopped] = useState<boolean[]>(() => words.map(() => false));
  const remaining = popped.filter((p) => !p).length;
  const complete = remaining === 0;

  const pop = (i: number, e: React.PointerEvent) => {
    if (popped[i]) return;
    const next = popped.map((v, j) => (j === i ? true : v));
    setPopped(next);
    sfx.pop();
    if (next.every(Boolean)) {
      setTimeout(() => say(config.question, { pitch: 0.9, rate: 0.9 }), 700);
    }
    if (navigator.vibrate) navigator.vibrate(18);
    confetti({
      particleCount: 26,
      spread: 70,
      startVelocity: 22,
      ticks: 60,
      scalar: 0.8,
      gravity: 1.2,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: [COLORS[i % COLORS.length], "#ffffff"],
    });
  };

  return (
    <div className="flex h-full w-full max-w-xl flex-col items-center px-4 pt-14 text-center">
      {/* the sentence being revealed */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs uppercase tracking-[0.35em] text-white/50"
      >
        {complete ? "so…" : `pop the balloons 🎈 (${remaining} left)`}
      </motion.p>

      <motion.div
        layout
        className={`mt-4 flex flex-wrap items-end justify-center gap-x-2.5 gap-y-1 font-serif text-3xl leading-tight sm:text-5xl ${
          complete ? "gradient-text font-semibold" : ""
        }`}
        animate={complete ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {words.map((w, i) =>
          popped[i] ? (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.3, y: 20, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
            >
              {w}
            </motion.span>
          ) : (
            <span
              key={i}
              className="inline-block border-b-2 border-dashed border-white/25 text-transparent"
              aria-hidden
            >
              {w}
            </span>
          ),
        )}
      </motion.div>

      {/* balloon field / answer */}
      <div className="relative mt-2 w-full flex-1">
        <AnimatePresence>
          {!complete &&
            words.map((_, i) => {
              const color = COLORS[i % COLORS.length];
              const p = positions[i];
              return (
                <motion.button
                  key={i}
                  aria-label={`balloon ${i + 1}`}
                  onPointerDown={(e) => pop(i, e)}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${p.left}%`, top: `${p.top}%`, color }}
                  initial={{ opacity: 0, y: 120, scale: 0.6 }}
                  animate={
                    popped[i]
                      ? { opacity: 0, scale: 1.6, y: 0 }
                      : {
                          opacity: 1,
                          scale: 1,
                          y: [0, -14, 0],
                          rotate: [-3, 3, -3],
                        }
                  }
                  exit={{ opacity: 0, scale: 0 }}
                  transition={
                    popped[i]
                      ? { duration: 0.18 }
                      : {
                          opacity: { delay: 0.1 + i * 0.08, duration: 0.4 },
                          scale: { delay: 0.1 + i * 0.08, type: "spring", stiffness: 180, damping: 12 },
                          y: { duration: 2.2 + (i % 3) * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.13 },
                          rotate: { duration: 2.6 + (i % 4) * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 },
                        }
                  }
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
                    className="balloon relative h-24 w-[4.6rem] sm:h-28 sm:w-[5.5rem]"
                    style={{
                      background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.6), transparent 38%), ${color}`,
                    }}
                  >
                    <span className="absolute inset-0 grid place-items-center text-2xl text-white/90 drop-shadow">
                      ?
                    </span>
                  </div>
                  <span className="mx-auto block h-10 w-px bg-white/40" />
                </motion.button>
              );
            })}
        </AnimatePresence>

        <AnimatePresence>
          {complete && (
            <motion.div
              key="answer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6"
            >
              <p className="text-sm text-white/50">(this is not a drill)</p>
              <YesNo onYes={onYes} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
