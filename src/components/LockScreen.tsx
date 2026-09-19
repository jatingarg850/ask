"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { config } from "@/lib/config";

const KNOB = 64;

export default function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [clock, setClock] = useState({ time: "", date: "" });
  const [trackW, setTrackW] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  const x = useMotionValue(0);
  const max = Math.max(0, trackW - KNOB - 8);
  const labelOpacity = useTransform(x, [0, Math.max(1, max * 0.55)], [1, 0]);
  const knobGlow = useTransform(
    x,
    [0, Math.max(1, max)],
    ["0 0 0px rgba(255,92,138,0)", "0 0 40px rgba(255,92,138,0.9)"],
  );

  // live clock
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock({
        time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: d.toLocaleDateString([], {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
      });
    };
    const id = setInterval(tick, 1000);
    const first = setTimeout(tick, 0);
    return () => {
      clearInterval(id);
      clearTimeout(first);
    };
  }, []);

  // measure slider track
  useEffect(() => {
    const measure = () => setTrackW(trackRef.current?.offsetWidth ?? 0);
    const first = setTimeout(measure, 0);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(first);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    if (navigator.vibrate) navigator.vibrate([20, 30, 70]);
    animate(x, max, { duration: 0.15 });
    setTimeout(onUnlock, 300);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between px-6 pb-10 pt-4 text-center">
      {/* fake status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex w-full max-w-sm items-center justify-between text-xs text-white/70"
      >
        <span>●●●● ᯤ</span>
        <span className="flex items-center gap-1">
          <span>100%</span>
          <span className="inline-block h-3 w-6 rounded-sm border border-white/70 p-px">
            <span className="block h-full w-full rounded-[1px] bg-white/90" />
          </span>
        </span>
      </motion.div>

      {/* clock */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mt-4"
      >
        <p className="text-sm font-medium text-white/70">{clock.date || " "}</p>
        <p className="font-serif text-[88px] leading-none tracking-tight text-white sm:text-[110px]">
          {clock.time || " "}
        </p>
      </motion.div>

      {/* notification */}
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.9 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: [0, 0, -1.5, 1.5, -1.5, 1.5, 0],
        }}
        transition={{
          opacity: { delay: 1.1, duration: 0.5 },
          y: { delay: 1.1, type: "spring", stiffness: 220, damping: 18 },
          scale: { delay: 1.1, type: "spring", stiffness: 220, damping: 18 },
          rotate: { delay: 2.4, duration: 0.7, repeat: Infinity, repeatDelay: 2.5 },
        }}
        className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/12 p-4 text-left shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blush to-grape text-xl shadow-lg">
            💌
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{config.yourName}</p>
              <p className="text-xs text-white/50">now</p>
            </div>
            <p className="text-xs text-white/60">Messages</p>
          </div>
        </div>
        <p className="mt-2.5 text-[15px] leading-snug text-white/90">
          {config.lockMessage}
        </p>
      </motion.div>

      {/* slide to unlock */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <div
          ref={trackRef}
          className="relative h-18 w-full rounded-full border border-white/15 bg-white/10 backdrop-blur-xl"
        >
          <motion.span
            style={{ opacity: labelOpacity }}
            className="shine-text pointer-events-none absolute inset-0 grid place-items-center pl-10 text-sm font-medium tracking-[0.25em]"
          >
            slide to unlock
          </motion.span>

          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: max }}
            dragElastic={0}
            dragMomentum={false}
            onDrag={() => {
              if (x.get() >= max - 2) finish();
            }}
            onDragEnd={() => {
              if (x.get() >= max * 0.85) finish();
              else animate(x, 0, { type: "spring", stiffness: 320, damping: 26 });
            }}
            style={{ x, boxShadow: knobGlow, touchAction: "none" }}
            className="absolute left-1 top-1 grid h-16 w-16 cursor-grab place-items-center rounded-full bg-gradient-to-br from-blush to-grape text-3xl active:cursor-grabbing"
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            >
              ❤️
            </motion.span>
          </motion.div>
        </div>
        <p className="mt-4 text-[11px] text-white/30">
          made with ♥ by {config.yourName}
        </p>
      </motion.div>
    </div>
  );
}
