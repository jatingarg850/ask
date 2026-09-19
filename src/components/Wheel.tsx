"use client";

import confetti from "canvas-confetti";
import { animate, motion, useMotionValue } from "framer-motion";
import { useState } from "react";
import { sfx } from "@/lib/sfx";

// every single segment is some flavour of "yes". fate is rigged. sorry not sorry.
const SEGMENTS = [
  { label: "YES", color: "#ff6fa5" },
  { label: "obviously", color: "#a78bfa" },
  { label: "sí 💃", color: "#ffb86b" },
  { label: "duh", color: "#5eead4" },
  { label: "oui 🥐", color: "#f472b6" },
  { label: "YES!!", color: "#ffd166" },
  { label: "haan ji", color: "#c4b5fd" },
  { label: "absolutely", color: "#fb7185" },
];

const N = SEGMENTS.length;
const SEG = 360 / N;
const R = 140;

function arcPath(i: number) {
  const a0 = ((i * SEG - 90) * Math.PI) / 180;
  const a1 = (((i + 1) * SEG - 90) * Math.PI) / 180;
  const x0 = R + R * Math.cos(a0);
  const y0 = R + R * Math.sin(a0);
  const x1 = R + R * Math.cos(a1);
  const y1 = R + R * Math.sin(a1);
  return `M${R},${R} L${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} Z`;
}

type Props = { onResult: (label: string) => void; onClose: () => void };

export default function Wheel({ onResult, onClose }: Props) {
  const rotation = useMotionValue(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const spin = () => {
    if (spinning || result) return;
    setSpinning(true);
    sfx.pop();
    const winner = Math.floor(Math.random() * N);
    // land the winner under the pointer at the top, plus a few full turns
    const target = 360 * (5 + Math.floor(Math.random() * 3)) + (360 - (winner * SEG + SEG / 2));
    let lastTick = 0;
    animate(rotation, rotation.get() + target, {
      duration: 5.2,
      ease: [0.12, 0.8, 0.1, 1],
      onUpdate: (v) => {
        const tick = Math.floor(v / SEG);
        if (tick !== lastTick) {
          lastTick = tick;
          sfx.tick();
        }
      },
      onComplete: () => {
        setSpinning(false);
        setResult(SEGMENTS[winner].label);
        sfx.chime();
        if (navigator.vibrate) navigator.vibrate([40, 40, 120]);
        confetti({
          particleCount: 120,
          spread: 90,
          startVelocity: 40,
          origin: { y: 0.55 },
          colors: SEGMENTS.map((s) => s.color),
        });
        setTimeout(() => onResult(SEGMENTS[winner].label), 1600);
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#1b0b3a]/85 px-5 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.6, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">
            can&rsquo;t decide?
          </p>
          <p className="mt-1 font-serif text-3xl italic">Let fate decide 🎡</p>
        </div>

        <div className="relative">
          {/* pointer */}
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-2 text-3xl drop-shadow-lg">
            🔻
          </div>
          <motion.svg
            width={R * 2}
            height={R * 2}
            viewBox={`0 0 ${R * 2} ${R * 2}`}
            style={{ rotate: rotation }}
            className="rounded-full shadow-[0_0_60px_rgba(255,111,165,0.5)]"
          >
            {SEGMENTS.map((s, i) => (
              <g key={i}>
                <path d={arcPath(i)} fill={s.color} stroke="#1b0b3a" strokeWidth="2" />
                <text
                  x={R}
                  y={R}
                  fill="#1b0b3a"
                  fontSize="13"
                  fontWeight="700"
                  textAnchor="middle"
                  transform={`rotate(${i * SEG + SEG / 2} ${R} ${R}) translate(0 ${-R * 0.62})`}
                >
                  {s.label}
                </text>
              </g>
            ))}
            <circle cx={R} cy={R} r="22" fill="#fff" />
            <text x={R} y={R + 7} textAnchor="middle" fontSize="20">
              💘
            </text>
          </motion.svg>
        </div>

        <div className="h-9">
          {result && (
            <motion.p
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="gradient-text font-serif text-3xl font-bold"
            >
              fate says: {result}
            </motion.p>
          )}
        </div>

        <div className="flex gap-3">
          {!result && (
            <motion.button
              onClick={spin}
              disabled={spinning}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-10 py-3.5 text-base disabled:opacity-60"
            >
              {spinning ? "spinning…" : "SPIN 🎰"}
            </motion.button>
          )}
          {!spinning && !result && (
            <button onClick={onClose} className="btn-ghost px-5 py-3.5 text-sm text-white/80">
              nvm
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
