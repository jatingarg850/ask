"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { sfx } from "@/lib/sfx";
import Wheel from "./Wheel";

const NO_LABELS = [
  "No",
  "Are you sure?",
  "Really sure?",
  "Think again!",
  "Last chance!",
  "Surely not?",
  "You might regret this!",
  "Give it another thought!",
  "Are you absolutely certain?",
  "This could be a mistake!",
  "Have a heart!",
  "Don’t be so cold!",
  "Change of heart?",
  "Wouldn’t you reconsider?",
  "Is that your final answer?",
  "You’re breaking my heart 💔",
];

const GIVE_UP_AT = 12;
const FUSE_SECONDS = 20; // the No button self-destructs after this long

export default function YesNo({ onYes }: { onYes: () => void }) {
  const [attempts, setAttempts] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [fuse, setFuse] = useState(FUSE_SECONDS);
  const [exploded, setExploded] = useState(false);
  const [wheel, setWheel] = useState(false);
  const noRef = useRef<HTMLButtonElement>(null);
  const answered = useRef(false);

  const gaveUp = attempts >= GIVE_UP_AT;
  const noGone = gaveUp || exploded;

  // ⏱ the fuse: counts down, then the No button goes kaboom
  const fuseRef = useRef(FUSE_SECONDS);
  useEffect(() => {
    if (noGone) return;
    const id = setInterval(() => {
      const f = fuseRef.current - 1;
      fuseRef.current = f;
      setFuse(f);
      if (f > 0 && f <= 6) sfx.beep(f <= 3);
      if (f > 0) return;

      clearInterval(id);
      const rect = noRef.current?.getBoundingClientRect();
      const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
      const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;
      setExploded(true);
      sfx.boom();
      if (navigator.vibrate) navigator.vibrate([80, 40, 200]);
      confetti({
        particleCount: 90,
        spread: 360,
        startVelocity: 35,
        gravity: 1.1,
        scalar: 0.9,
        origin: { x, y },
        colors: ["#ff6fa5", "#ffb86b", "#ffffff", "#ff3d3d"],
      });
    }, 1000);
    return () => clearInterval(id);
  }, [noGone]);

  const dodge = () => {
    if (noGone) return;
    const pad = 24;
    const w = 220;
    const h = 60;
    const x = pad + Math.random() * Math.max(1, window.innerWidth - w - pad * 2);
    const y = pad + Math.random() * Math.max(1, window.innerHeight - h - pad * 2);
    setNoPos({ x, y });
    setAttempts((a) => a + 1);
    sfx.boing();
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const yes = () => {
    if (answered.current) return;
    answered.current = true;
    sfx.chime();
    onYes();
  };

  const yesScale = 1 + Math.min(attempts, 10) * 0.11;
  const noLabel = NO_LABELS[Math.min(attempts, NO_LABELS.length - 1)];
  const urgent = fuse <= 5 && !noGone;

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        className="flex flex-wrap items-center justify-center gap-5"
      >
        <motion.button
          onClick={yes}
          animate={{
            scale: yesScale,
            rotate: attempts ? [0, -4, 4, -2, 2, 0] : 0,
          }}
          whileHover={{ scale: yesScale * 1.06 }}
          whileTap={{ scale: yesScale * 0.94 }}
          transition={{
            scale: { type: "spring", stiffness: 260, damping: 14 },
            rotate: { duration: 0.45 },
          }}
          className="btn-primary px-10 py-4 text-lg"
        >
          Yes! 💖
        </motion.button>

        <motion.button
          ref={noRef}
          onPointerEnter={dodge}
          onTouchStart={dodge}
          onClick={dodge}
          animate={
            noPos
              ? {
                  left: noPos.x,
                  top: noPos.y,
                  scale: noGone ? 0 : urgent ? [1, 1.06, 1] : 1,
                  opacity: noGone ? 0 : 1,
                }
              : { scale: noGone ? 0 : urgent ? [1, 1.06, 1] : 1, opacity: noGone ? 0 : 1 }
          }
          transition={{
            left: { type: "spring", stiffness: 300, damping: 20 },
            top: { type: "spring", stiffness: 300, damping: 20 },
            opacity: { duration: 0.2 },
            scale: urgent ? { duration: 0.4, repeat: Infinity } : { type: "spring", stiffness: 300, damping: 20 },
          }}
          style={noPos ? { position: "fixed", zIndex: 50 } : undefined}
          className={`btn-ghost relative whitespace-nowrap px-8 py-4 text-lg text-white/85 ${
            urgent ? "!border-red-400/70 !bg-red-500/20" : ""
          }`}
        >
          {noLabel}
          {!noGone && (
            <span
              className={`absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold tabular-nums ${
                urgent ? "bg-red-500 text-white" : "bg-white/15 text-white/80"
              }`}
            >
              {fuse}
            </span>
          )}
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {exploded ? (
          <motion.p
            key="exploded"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm text-white/60"
          >
            💥 the &ldquo;No&rdquo; button self-destructed. tragic. anyway—
          </motion.p>
        ) : gaveUp ? (
          <motion.p
            key="gaveup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-white/60"
          >
            the &ldquo;No&rdquo; button has left the chat 🫠
          </motion.p>
        ) : attempts > 0 ? (
          <motion.p
            key={attempts}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-white/50"
          >
            {attempts === 1
              ? "nice try 😏"
              : `${attempts} escape attempts and counting…`}
          </motion.p>
        ) : (
          <motion.p
            key="fuse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-white/45"
          >
            (the No button self-destructs in {fuse}s. no pressure.)
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        onClick={() => {
          sfx.blip();
          setWheel(true);
        }}
        className="btn-ghost mt-1 px-5 py-2.5 text-sm text-white/80"
      >
        🎡 can&rsquo;t decide? let fate decide
      </motion.button>

      <AnimatePresence>
        {wheel && (
          <Wheel
            key="wheel"
            onClose={() => setWheel(false)}
            onResult={() => {
              setWheel(false);
              yes();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
