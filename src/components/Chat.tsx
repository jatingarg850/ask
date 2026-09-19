"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { config } from "@/lib/config";
import { sfx } from "@/lib/sfx";

type Msg = { id: number; from: "me" | "her"; text: string };

const script = config.chat;

export default function Chat({ onDone }: { onDone: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<string[] | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // drive the script
  useEffect(() => {
    if (step >= script.length) {
      const t = setTimeout(onDone, 700);
      return () => clearTimeout(t);
    }
    const s = script[step];
    if (typeof s !== "string") {
      const t = setTimeout(() => setChoices(s.choices), 450);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setTyping(true), 400);
    const t2 = setTimeout(
      () => {
        setTyping(false);
        sfx.blip();
        setMsgs((m) => [...m, { id: step, from: "me", text: s }]);
        setStep((x) => x + 1);
      },
      400 + 650 + Math.min(1500, s.length * 40),
    );
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [step, onDone]);

  // keep scrolled to the bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing, choices]);

  const reply = (text: string) => {
    setChoices(null);
    if (navigator.vibrate) navigator.vibrate(15);
    setMsgs((m) => [...m, { id: step, from: "her", text }]);
    setStep((x) => x + 1);
  };

  return (
    <div className="glass flex h-[82dvh] w-full max-w-md flex-col overflow-hidden rounded-[2rem]">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
        <div className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blush to-grape font-semibold">
          {config.yourName.slice(0, 1).toUpperCase()}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-black bg-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">{config.yourName}</p>
          <p className="text-[11px] text-emerald-400">online</p>
        </div>
        <span className="text-lg text-white/40">⋯</span>
      </div>

      {/* messages */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">
        <p className="mb-2 text-center text-[11px] text-white/35">Today</p>
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div
              key={`${m.from}-${m.id}`}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[15px] leading-snug ${
                m.from === "me"
                  ? "self-start rounded-bl-md bg-white/14 text-white"
                  : "self-end rounded-br-md bg-gradient-to-br from-blush to-grape text-white"
              }`}
            >
              {m.text}
            </motion.div>
          ))}
          {typing && (
            <motion.div
              key="typing"
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 self-start rounded-2xl rounded-bl-md bg-white/12 px-4 py-3"
            >
              <span className="dot h-2 w-2 rounded-full bg-white/80" />
              <span className="dot h-2 w-2 rounded-full bg-white/80" />
              <span className="dot h-2 w-2 rounded-full bg-white/80" />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* composer / quick replies */}
      <div className="border-t border-white/10 px-4 py-3">
        <AnimatePresence mode="wait">
          {choices ? (
            <motion.div
              key="choices"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-wrap justify-end gap-2"
            >
              {choices.map((c) => (
                <motion.button
                  key={c}
                  onClick={() => reply(c)}
                  whileTap={{ scale: 0.93 }}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  {c}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="composer"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/30">
                {step >= script.length ? "…" : "wait for it…"}
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/40">
                ↑
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
