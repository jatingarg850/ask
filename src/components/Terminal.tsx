"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { config } from "@/lib/config";
import { sfx } from "@/lib/sfx";
import { say } from "@/lib/voice";

const lines = config.terminal.map((l) =>
  l.replaceAll("{her}", config.herName).replaceAll("{me}", config.yourName),
);

function charDelay(ch: string) {
  if (ch === ".") return 70;
  if (ch === "█") return 55;
  return 14;
}

export default function Terminal({ onDone }: { onDone: () => void }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [chars, setChars] = useState(0);
  const done = lineIdx >= lines.length;

  useEffect(() => {
    if (done) {
      sfx.chime();
      say("Access granted. Loading the question.", { pitch: 0.5, rate: 0.9 });
      const t = setTimeout(onDone, 1600);
      return () => clearTimeout(t);
    }
    const line = lines[lineIdx];
    if (chars < line.length) {
      const t = setTimeout(() => setChars((c) => c + 1), charDelay(line[chars]));
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLineIdx((i) => i + 1);
      setChars(0);
    }, 380);
    return () => clearTimeout(t);
  }, [lineIdx, chars, done, onDone]);

  return (
    <motion.div
      className="w-full max-w-lg px-4 pt-10"
      animate={done ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass scanlines relative overflow-hidden rounded-2xl !bg-[#160a2e]/80">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-white/50">
            {config.yourName.toLowerCase()}@heart — ~/love
          </span>
        </div>

        <div className="min-h-72 p-5 font-mono text-[13px] leading-7 sm:text-sm">
          {lines.slice(0, Math.min(lineIdx + 1, lines.length)).map((line, i) => {
            const isCurrent = i === lineIdx;
            const text = isCurrent ? line.slice(0, chars) : line;
            const granted = line.includes("GRANTED");
            const ok = /\[OK\]|✓|done|free/.test(text);
            return (
              <p
                key={i}
                className={`whitespace-pre-wrap ${
                  granted
                    ? "gradient-text mt-2 text-lg font-bold sm:text-xl"
                    : ok
                      ? "text-emerald-300"
                      : "text-pink-200/90"
                } ${isCurrent ? "caret" : ""}`}
              >
                {text}
              </p>
            );
          })}
          {done && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{ duration: 0.6 }}
              className="mt-2 text-white/40"
            >
              &gt; launching…
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
