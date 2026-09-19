"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { config } from "@/lib/config";
import { sfx } from "@/lib/sfx";
import {
  availableDays,
  combine,
  dayLabel,
  periodEmoji,
  periodName,
  timeLabel,
} from "@/lib/when";

const days = availableDays();
const times = config.schedule.times;

export default function Schedule({ onDone }: { onDone: (when: Date) => void }) {
  const [dayIdx, setDayIdx] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  const when = dayIdx !== null && time ? combine(days[dayIdx], time) : null;

  const pickDay = (i: number) => {
    if (locked) return;
    setDayIdx(i);
    sfx.blip();
    if (navigator.vibrate) navigator.vibrate(12);
  };
  const pickTime = (t: string) => {
    if (locked) return;
    setTime(t);
    sfx.blip();
    if (navigator.vibrate) navigator.vibrate(12);
  };
  const random = () => {
    if (locked) return;
    setDayIdx(Math.floor(Math.random() * days.length));
    setTime(times[Math.floor(Math.random() * times.length)]);
    sfx.pop();
  };
  const lockIn = () => {
    if (!when || locked) return;
    setLocked(true);
    sfx.chime();
    if (navigator.vibrate) navigator.vibrate([30, 30, 80]);
    setTimeout(() => onDone(when), 900);
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 px-5 pt-12 text-center">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">
          you&rsquo;re in charge now 📅
        </p>
        <p className="mt-2 font-serif text-3xl italic sm:text-4xl">
          When works for you?
        </p>
      </motion.div>

      {/* day strip */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        className="-mx-5 w-[calc(100%+2.5rem)]"
      >
        <div
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ touchAction: "pan-x" }}
        >
          {days.map((d, i) => {
            const on = dayIdx === i;
            return (
              <motion.button
                key={i}
                onClick={() => pickDay(i)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, scale: on ? 1.08 : 1 }}
                transition={{ delay: 0.2 + i * 0.04, type: "spring", stiffness: 260, damping: 18 }}
                whileTap={{ scale: 0.94 }}
                className={`glass flex w-[4.4rem] shrink-0 snap-center flex-col items-center rounded-2xl py-3 ${
                  on ? "!bg-gradient-to-b !from-blush !to-grape shadow-[0_10px_30px_rgba(255,111,165,0.5)]" : ""
                }`}
              >
                <span className={`text-[10px] font-semibold uppercase tracking-widest ${on ? "text-white" : "text-white/55"}`}>
                  {d.toLocaleDateString(undefined, { weekday: "short" })}
                </span>
                <span className="mt-1 font-serif text-3xl leading-none">
                  {d.getDate()}
                </span>
                <span className={`mt-1 text-[10px] ${on ? "text-white/90" : "text-white/50"}`}>
                  {d.toLocaleDateString(undefined, { month: "short" })}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* time chips */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="grid w-full grid-cols-2 gap-3"
      >
        {times.map((t) => {
          const on = time === t;
          const preview = combine(new Date(), t);
          return (
            <motion.button
              key={t}
              onClick={() => pickTime(t)}
              animate={{ scale: on ? 1.04 : 1 }}
              whileTap={{ scale: 0.95 }}
              className={`glass flex items-center gap-3 rounded-2xl px-4 py-3 text-left ${
                on ? "!bg-gradient-to-r !from-blush !to-grape shadow-[0_10px_30px_rgba(255,111,165,0.45)]" : ""
              }`}
            >
              <span className="text-2xl">{periodEmoji(t)}</span>
              <span>
                <span className="block text-sm font-semibold">{timeLabel(preview)}</span>
                <span className={`block text-[11px] ${on ? "text-white/90" : "text-white/50"}`}>
                  {periodName(t)}
                </span>
              </span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* summary + lock in */}
      <div className="flex min-h-24 w-full flex-col items-center gap-3">
        <AnimatePresence mode="wait">
          {when ? (
            <motion.p
              key={when.getTime()}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="gradient-text font-serif text-2xl font-semibold"
            >
              {dayLabel(when)} · {timeLabel(when)} 💘
            </motion.p>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-white/50"
            >
              pick a day and a time ✨
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <motion.button
            onClick={lockIn}
            disabled={!when || locked}
            animate={{ opacity: when ? 1 : 0.35, scale: when && !locked ? [1, 1.04, 1] : 1 }}
            transition={{ scale: { duration: 1.1, repeat: Infinity } }}
            className="btn-primary px-8 py-3.5 text-base"
          >
            {locked ? "locked in 🔒" : "lock it in 🔒"}
          </motion.button>
          {!locked && (
            <button onClick={random} className="btn-ghost px-5 py-3.5 text-sm text-white/85">
              🎲 surprise me
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
