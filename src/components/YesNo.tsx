"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

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

export default function YesNo({ onYes }: { onYes: () => void }) {
  const [attempts, setAttempts] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);

  const dodge = () => {
    if (attempts >= GIVE_UP_AT) return;
    const pad = 24;
    const w = 220;
    const h = 60;
    const x = pad + Math.random() * Math.max(1, window.innerWidth - w - pad * 2);
    const y = pad + Math.random() * Math.max(1, window.innerHeight - h - pad * 2);
    setNoPos({ x, y });
    setAttempts((a) => a + 1);
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const gaveUp = attempts >= GIVE_UP_AT;
  const yesScale = 1 + Math.min(attempts, 10) * 0.11;
  const noLabel = NO_LABELS[Math.min(attempts, NO_LABELS.length - 1)];

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 16 }}
        className="flex flex-wrap items-center justify-center gap-5"
      >
        <motion.button
          onClick={onYes}
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
          className="rounded-full bg-gradient-to-r from-blush to-grape px-10 py-4 text-lg font-semibold text-white shadow-[0_0_40px_rgba(255,92,138,0.55)]"
        >
          Yes! 💖
        </motion.button>

        <motion.button
          onPointerEnter={dodge}
          onTouchStart={dodge}
          onClick={dodge}
          animate={
            noPos
              ? {
                  left: noPos.x,
                  top: noPos.y,
                  scale: gaveUp ? 0 : 1,
                  opacity: gaveUp ? 0 : 1,
                }
              : { scale: 1, opacity: 1 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={noPos ? { position: "fixed", zIndex: 50 } : undefined}
          className="whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-8 py-4 text-lg text-white/80 backdrop-blur"
        >
          {noLabel}
        </motion.button>
      </motion.div>

      <AnimatePresence mode="wait">
        {gaveUp ? (
          <motion.p
            key="gaveup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-white/50"
          >
            the &ldquo;No&rdquo; button has left the chat 🫠
          </motion.p>
        ) : attempts > 0 ? (
          <motion.p
            key={attempts}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-white/40"
          >
            {attempts === 1
              ? "nice try 😏"
              : `${attempts} escape attempts and counting…`}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
