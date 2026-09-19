"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { config, type Vibe } from "@/lib/config";
import ScratchCard from "./ScratchCard";

const COLORS = ["#ff5c8a", "#ffb86b", "#8b5cf6", "#22d3ee", "#ffffff"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// local wall-clock time, no timezone suffix — calendar apps treat it as local
function toCalStamp(d: Date) {
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

function eventDetails(vibe: Vibe) {
  const start = new Date(config.date.startISO);
  const end = new Date(start.getTime() + config.date.durationHours * 3600_000);
  return {
    start,
    end,
    title: `${vibe.emoji} ${vibe.title} with ${config.yourName}`,
    details: `${config.question} — you said yes. 💘`,
    location: config.date.where,
  };
}

function googleCalendarUrl(vibe: Vibe) {
  const e = eventDetails(vibe);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${toCalStamp(e.start)}/${toCalStamp(e.end)}`,
    details: e.details,
    location: e.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadIcs(vibe: Vibe) {
  const e = eventDetails(vibe);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ask//date night//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@date-night`,
    `DTSTAMP:${toCalStamp(new Date())}`,
    `DTSTART:${toCalStamp(e.start)}`,
    `DTEND:${toCalStamp(e.end)}`,
    `SUMMARY:${e.title}`,
    `DESCRIPTION:${e.details}`,
    `LOCATION:${e.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "date-night.ics";
  a.click();
  URL.revokeObjectURL(url);
}

function whatsappUrl(vibe: Vibe) {
  const msg =
    `YES!!! 💖 I'll go on a date with you.\n` +
    `${vibe.emoji} ${vibe.title} — ${config.date.whenLabel}, ${config.date.timeLabel}.\n` +
    `Signed, sealed, delivered. Don't be late 😏`;
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msg)}`;
}

type Props = { vibe: Vibe; signature: string };

export default function Celebration({ vibe, signature }: Props) {
  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([60, 40, 60, 40, 140]);

    // opening burst
    confetti({
      particleCount: 200,
      spread: 120,
      startVelocity: 50,
      origin: { y: 0.65 },
      colors: COLORS,
    });

    // fireworks all over the sky
    const fireworks = setInterval(() => {
      confetti({
        particleCount: 70,
        spread: 360,
        startVelocity: 28,
        ticks: 90,
        gravity: 0.7,
        decay: 0.92,
        scalar: 1.1,
        origin: { x: 0.1 + Math.random() * 0.8, y: Math.random() * 0.45 },
        colors: COLORS,
      });
    }, 380);
    const stopFireworks = setTimeout(() => clearInterval(fireworks), 6500);

    // heart rain from both sides
    const heart = confetti.shapeFromText({ text: "💖", scalar: 2 });
    const end = Date.now() + 3600;
    let raf = 0;
    const frame = () => {
      const opts = { particleCount: 2, spread: 60, shapes: [heart], scalar: 2, colors: COLORS };
      confetti({ ...opts, angle: 60, origin: { x: 0, y: 0.7 } });
      confetti({ ...opts, angle: 120, origin: { x: 1, y: 0.7 } });
      if (Date.now() < end) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      clearInterval(fireworks);
      clearTimeout(stopFireworks);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 px-5 py-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 11 }}
      >
        <p className="gradient-text font-serif text-5xl font-bold sm:text-6xl">
          It&rsquo;s a date!
        </p>
        <p className="mt-2 text-white/60">
          You just made my whole year, {config.herName}.
        </p>
      </motion.div>

      {/* the ticket */}
      <motion.div
        initial={{ opacity: 0, y: 60, rotate: -5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 120, damping: 14 }}
        className="relative w-full overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-2xl backdrop-blur-xl"
      >
        <div className={`bg-gradient-to-r ${vibe.gradient} p-5 text-left`}>
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.35em] text-white/80">
            <span>Admit two</span>
            <span>No refunds</span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <span className="text-5xl drop-shadow">{vibe.emoji}</span>
            <div>
              <p className="font-serif text-2xl font-semibold text-white">
                {vibe.title}
              </p>
              <p className="text-xs text-white/85">{vibe.desc}</p>
            </div>
          </div>
        </div>

        {/* perforation */}
        <div className="relative flex items-center">
          <span className="absolute -left-3 h-6 w-6 rounded-full bg-ink" />
          <span className="mx-4 h-0 w-full border-t-2 border-dashed border-white/20" />
          <span className="absolute -right-3 h-6 w-6 rounded-full bg-ink" />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-4 p-5 text-left">
          <Field label="When" value={config.date.whenLabel} />
          <Field label="Time" value={config.date.timeLabel} />
          <div className="col-span-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Where
            </p>
            <ScratchCard
              className="mt-1 rounded-xl"
              label="scratch to reveal 👀"
              sub=""
              brush={18}
            >
              <p className="rounded-xl bg-white/5 px-3 py-2.5 font-medium text-white">
                {config.date.where}
              </p>
            </ScratchCard>
          </div>
          <Field label="With" value={config.yourName} />
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Signed by {config.herName}
            </p>
            {signature ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={signature}
                alt="her signature"
                className="mt-0.5 h-10 w-auto max-w-full object-contain object-left"
              />
            ) : (
              <p className="mt-0.5 font-serif italic text-white">❤️</p>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-3 text-left text-xs text-white/60">
          {config.ps}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex w-full flex-col gap-2.5"
      >
        {config.whatsapp && (
          <a
            href={whatsappUrl(vibe)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-black transition hover:brightness-110 active:scale-95"
          >
            💬 Send my answer on WhatsApp
          </a>
        )}
        <a
          href={googleCalendarUrl(vibe)}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90 active:scale-95"
        >
          📅 Add to Google Calendar
        </a>
        <button
          onClick={() => downloadIcs(vibe)}
          className="rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm text-white/90 backdrop-blur transition hover:bg-white/10 active:scale-95"
        >
           Add to Apple Calendar (.ics)
        </button>
        <p className="mt-1 text-xs text-white/40">
          now screenshot this and send it to me 📸
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
        {label}
      </p>
      <p className="mt-0.5 font-medium text-white">{value}</p>
    </div>
  );
}
