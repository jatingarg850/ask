import { config } from "./config";
import { sfx } from "./sfx";

// the browser's own robot voice 🤖 — no audio files, no API, just speechSynthesis
export function say(text: string, opts: { pitch?: number; rate?: number } = {}) {
  if (!config.voice || !sfx.enabled) return;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = opts.rate ?? 0.95;
    u.pitch = opts.pitch ?? 0.7;
    u.volume = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const en = voices.find((v) => /^en/i.test(v.lang) && /google|natural|samantha|daniel/i.test(v.name))
      ?? voices.find((v) => /^en/i.test(v.lang));
    if (en) u.voice = en;
    window.speechSynthesis.speak(u);
  } catch {
    // speech is a bonus, never a blocker
  }
}

export function hush() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}
