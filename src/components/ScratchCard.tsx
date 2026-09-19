"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BRUSH = 30;
const REVEAL_AT = 0.45; // fraction scratched before the foil auto-clears

type Props = {
  onReveal?: () => void;
  children: React.ReactNode;
  label?: string;
  sub?: string;
  brush?: number;
  className?: string;
};

export default function ScratchCard({
  onReveal,
  children,
  label = "✨  scratch here  ✨",
  sub = "(use your finger)",
  brush = BRUSH,
  className = "rounded-3xl",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const moves = useRef(0);
  const [gone, setGone] = useState(false);

  // paint the silver foil
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = wrap.getBoundingClientRect();
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, "#b8b8c8");
    g.addColorStop(0.35, "#f2f2f7");
    g.addColorStop(0.6, "#c4c4d2");
    g.addColorStop(1, "#8e8ea0");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // sparkle speckles
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.5, 1.5);
    }

    ctx.fillStyle = "#3f3f50";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const small = height < 80;
    ctx.font = `600 ${small ? 12 : 15}px system-ui, sans-serif`;
    ctx.fillText(label, width / 2, sub && !small ? height / 2 - 10 : height / 2);
    if (sub && !small) {
      ctx.font = "400 12px system-ui, sans-serif";
      ctx.fillStyle = "#5c5c70";
      ctx.fillText(sub, width / 2, height / 2 + 12);
    }

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brush * 2;
  }, [label, sub, brush]);

  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) {
      total++;
      if (data[i] === 0) clear++;
    }
    if (clear / total >= REVEAL_AT) {
      setGone(true);
      if (navigator.vibrate) navigator.vibrate([30, 40, 30]);
      onReveal?.();
    }
  };

  const scratchTo = (p: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    if (last.current) ctx.moveTo(last.current.x, last.current.y);
    else ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(p.x, p.y, brush, 0, Math.PI * 2);
    ctx.fill();
    last.current = p;
    if (++moves.current % 8 === 0) checkProgress();
  };

  const down = (e: React.PointerEvent) => {
    if (gone) return;
    drawing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    last.current = null;
    scratchTo(pos(e));
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current || gone) return;
    scratchTo(pos(e));
  };
  const up = () => {
    drawing.current = false;
    last.current = null;
    if (!gone) checkProgress();
  };

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      {children}
      <AnimatePresence>
        {!gone && (
          <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 cursor-crosshair"
            style={{ touchAction: "none" }}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onPointerLeave={up}
            exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
