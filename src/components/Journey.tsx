"use client";

import { motion } from "framer-motion";

type Props = {
  steps: string[]; // emoji per step
  current: number; // index of the active step
  muted: boolean;
  onToggleMute: () => void;
};

// compact progress pill: done = gradient dot, active = wide pill w/ emoji, upcoming = faint dot
export default function Journey({ steps, current, muted, onToggleMute }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass fixed left-1/2 top-3 z-40 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-2.5 py-1.5"
    >
      {steps.map((emoji, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <motion.div
            key={i}
            layout
            animate={{
              width: active ? 34 : 9,
              height: active ? 24 : 9,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={`grid place-items-center overflow-hidden rounded-full text-[13px] ${
              done
                ? "bg-gradient-to-br from-blush to-grape shadow-[0_0_10px_rgba(255,111,165,0.7)]"
                : active
                  ? "bg-white/20 ring-1 ring-white/40"
                  : "bg-white/15"
            }`}
          >
            {active && (
              <motion.span
                key={emoji}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
              >
                {emoji}
              </motion.span>
            )}
          </motion.div>
        );
      })}

      <span className="mx-1 h-4 w-px bg-white/20" />

      <button
        onClick={onToggleMute}
        aria-label={muted ? "unmute sounds" : "mute sounds"}
        className="grid h-6 w-6 place-items-center rounded-full text-[13px] transition hover:bg-white/15 active:scale-90"
      >
        {muted ? "🔇" : "🔊"}
      </button>
    </motion.div>
  );
}
