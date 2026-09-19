"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { config } from "@/lib/config";
import { sfx } from "@/lib/sfx";

// a fake government-style emergency alert. very serious. very important.
export default function Alert({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    sfx.siren();
    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center px-5">
      {/* red flashing wash */}
      <motion.div
        className="pointer-events-none absolute inset-0 bg-red-600"
        animate={{ opacity: [0, 0.45, 0, 0.45, 0, 0.25, 0] }}
        transition={{ duration: 1.6, ease: "linear" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: -40 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          x: [0, -6, 6, -6, 6, -3, 3, 0],
        }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { type: "spring", stiffness: 320, damping: 18 },
          y: { type: "spring", stiffness: 320, damping: 18 },
          x: { delay: 0.2, duration: 0.5 },
        }}
        className="w-full max-w-sm overflow-hidden rounded-3xl border-4 border-red-500 bg-[#1a0b1c] shadow-[0_0_80px_rgba(239,68,68,0.6)]"
      >
        <div className="flex items-center gap-3 bg-red-600 px-5 py-3 text-white">
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-2xl"
          >
            ⚠️
          </motion.span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em]">
              {config.alert.title}
            </p>
            <p className="text-[10px] text-white/80">
              Priority: 💘 Critical · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        <div className="px-5 py-5 text-left">
          <p className="font-mono text-[15px] leading-relaxed text-white">
            {config.alert.body}
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] text-white/50">
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-red-500"
            />
            THIS IS NOT A TEST. (ok it kind of is.)
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            onClick={() => {
              sfx.blip();
              onDone();
            }}
            whileTap={{ scale: 0.95 }}
            className="w-full rounded-2xl bg-white py-3.5 text-base font-bold text-red-600"
          >
            {config.alert.button}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
