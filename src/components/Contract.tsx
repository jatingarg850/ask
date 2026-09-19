"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { config, type Vibe } from "@/lib/config";
import { sfx } from "@/lib/sfx";
import { dayLabel, timeLabel } from "@/lib/when";

type Props = {
  vibe: Vibe;
  when: Date;
  onSigned: (signaturePng: string) => void;
};

export default function Contract({ vibe, when, onSigned }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasInk, setHasInk] = useState(false);
  const [sealed, setSealed] = useState(false);

  // hi-dpi canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#fff";
    ctx.shadowColor = "rgba(255,92,138,0.8)";
    ctx.shadowBlur = 6;
  }, []);

  const point = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const down = (e: React.PointerEvent) => {
    if (sealed) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = point(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x + 0.1, p.y + 0.1);
    ctx.stroke();
    setHasInk(true);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };
  const up = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    setHasInk(false);
  };

  const seal = () => {
    if (!hasInk || sealed) return;
    setSealed(true);
    sfx.stamp();
    if (navigator.vibrate) navigator.vibrate([40, 30, 90]);
    const png = canvasRef.current?.toDataURL("image/png") ?? "";
    setTimeout(() => onSigned(png), 1500);
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-5 px-5 pt-10 text-center">
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs uppercase tracking-[0.35em] text-white/50"
      >
        one last thing 📜
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 25 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="relative w-full overflow-hidden rounded-3xl border border-white/15 bg-[#fffaf3] p-5 text-left text-[#2a2230] shadow-2xl sm:p-6"
        style={{ perspective: 1000 }}
      >
        <p className="text-center font-serif text-xl font-bold tracking-wide sm:text-2xl">
          OFFICIAL DATE AGREEMENT
        </p>
        <p className="mt-1 text-center text-[11px] uppercase tracking-[0.25em] text-[#2a2230]/50">
          {vibe.emoji} {vibe.title} · {dayLabel(when)} · {timeLabel(when)}
        </p>

        <ol className="mt-4 space-y-2 text-[13px] leading-snug">
          {config.terms.map((t, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.18 }}
              className="flex gap-2"
            >
              <span className="font-serif font-semibold text-blush">
                {i + 1}.
              </span>
              <span>{t}</span>
            </motion.li>
          ))}
        </ol>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + config.terms.length * 0.18 }}
          className="mt-5"
        >
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#2a2230]/50">
            <span>Sign here, {config.herName}</span>
            {hasInk && !sealed && (
              <button onClick={clear} className="underline">
                clear
              </button>
            )}
          </div>
          <div className="relative mt-1 h-28 w-full rounded-2xl bg-[#1a1420]">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full rounded-2xl"
              style={{ touchAction: "none" }}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
              onPointerLeave={up}
            />
            {!hasInk && (
              <span className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-white/35">
                ✍️ draw your signature with your finger
              </span>
            )}
            <span className="pointer-events-none absolute bottom-3 left-4 right-4 border-b border-white/20" />
          </div>
        </motion.div>

        {/* APPROVED stamp */}
        <AnimatePresence>
          {sealed && (
            <motion.div
              initial={{ opacity: 0, scale: 3, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: -14 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="pointer-events-none absolute right-5 top-16 rounded-lg border-[5px] border-blush px-4 py-1.5 font-serif text-3xl font-black uppercase tracking-widest text-blush"
              style={{ boxShadow: "inset 0 0 0 2px #fffaf3, 0 0 0 2px #ff5c8a" }}
            >
              approved
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.button
        onClick={seal}
        animate={{ opacity: hasInk ? 1 : 0.35, scale: hasInk && !sealed ? [1, 1.04, 1] : 1 }}
        transition={{ scale: { duration: 1, repeat: Infinity } }}
        whileTap={hasInk ? { scale: 0.95 } : undefined}
        disabled={!hasInk || sealed}
        className="btn-primary px-8 py-3.5 text-base"
      >
        {sealed ? "sealed 💋" : "seal the deal 💋"}
      </motion.button>
    </div>
  );
}
