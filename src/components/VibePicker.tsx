"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { config, type Vibe } from "@/lib/config";

export default function VibePicker({
  onSelect,
}: {
  onSelect: (vibe: Vibe) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [spinIdx, setSpinIdx] = useState<number | null>(null);
  const spinning = useRef(false);
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const choose = (v: Vibe) => {
    if (picked) return;
    setPicked(v.id);
    if (navigator.vibrate) navigator.vibrate(30);
    setTimeout(() => onSelect(v), 1000);
  };

  // 🎰 cycle the highlight faster → slower, then land somewhere random
  const spin = () => {
    if (spinning.current || picked) return;
    spinning.current = true;
    if (navigator.vibrate) navigator.vibrate(20);
    const n = config.vibes.length;
    const target = Math.floor(Math.random() * n);
    const totalSteps = n * 3 + target + 1;
    let step = 0;
    let idx = -1;
    const tick = () => {
      idx = (idx + 1) % n;
      setSpinIdx(idx);
      step++;
      if (step >= totalSteps) {
        spinning.current = false;
        choose(config.vibes[idx]);
        return;
      }
      const t = step / totalSteps;
      const delay = 70 + t * t * 420; // ease-out
      timer.current = window.setTimeout(tick, delay);
    };
    tick();
  };

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-7 px-5 text-center">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-white/50">
          I knew it 😌
        </p>
        <p className="mt-2 font-serif text-3xl italic sm:text-4xl">
          Now pick our adventure
        </p>
      </motion.div>

      <div className="grid w-full grid-cols-2 gap-3 sm:gap-4">
        {config.vibes.map((v, i) => {
          const isPicked = picked === v.id;
          const dimmed = picked !== null && !isPicked;
          const spinHit = spinIdx === i && !picked;
          return (
            <motion.button
              key={v.id}
              onClick={() => !spinning.current && choose(v)}
              initial={{ opacity: 0, y: 30, rotate: i % 2 ? 3 : -3 }}
              animate={{
                opacity: dimmed ? 0.25 : 1,
                y: 0,
                rotate: 0,
                scale: isPicked ? 1.08 : dimmed ? 0.92 : spinHit ? 1.05 : 1,
              }}
              transition={{
                delay: picked || spinIdx !== null ? 0 : 0.1 + i * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 16,
              }}
              whileHover={picked ? undefined : { y: -8, rotate: i % 2 ? 1.5 : -1.5 }}
              whileTap={picked ? undefined : { scale: 0.96 }}
              className={`group relative flex flex-col items-start gap-2 overflow-hidden rounded-3xl bg-gradient-to-br p-4 text-left shadow-lg sm:p-6 ${v.gradient} ${
                isPicked || spinHit ? "ring-4 ring-white/85" : "ring-0"
              }`}
            >
              <span className="text-4xl drop-shadow sm:text-5xl">{v.emoji}</span>
              <span className="font-serif text-lg font-semibold leading-tight text-white sm:text-2xl">
                {v.title}
              </span>
              <span className="text-[11px] leading-snug text-white/85 sm:text-sm">
                {v.desc}
              </span>
              <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20 blur-2xl transition-transform duration-500 group-hover:scale-150" />
              {isPicked && (
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-sm text-black"
                >
                  ✓
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: picked ? 0 : 1 }}
        transition={{ delay: 0.6 }}
        onClick={spin}
        whileTap={{ scale: 0.95 }}
        className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm text-white/80 backdrop-blur transition hover:bg-white/10"
      >
        🎰 can&rsquo;t decide? spin for me
      </motion.button>
    </div>
  );
}
