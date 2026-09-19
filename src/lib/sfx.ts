// Tiny synthesized sound effects via the Web Audio API — no audio files needed.
// Everything is short, soft and skippable via `sfx.enabled`.

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tone(
  freq: number,
  {
    type = "sine" as OscillatorType,
    start = 0,
    duration = 0.15,
    volume = 0.25,
    slideTo,
  }: {
    type?: OscillatorType;
    start?: number;
    duration?: number;
    volume?: number;
    slideTo?: number;
  } = {},
) {
  const c = audio();
  if (!c || !sfx.enabled) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export const sfx = {
  enabled: true,

  /** wake the audio context — call from a user gesture */
  unlockAudio() {
    audio();
  },

  /** balloon pop */
  pop() {
    tone(620, { duration: 0.13, slideTo: 140, volume: 0.35 });
    tone(1800, { type: "triangle", duration: 0.05, volume: 0.12 });
  },

  /** soft message blip */
  blip() {
    tone(880, { duration: 0.08, volume: 0.12 });
    tone(1320, { start: 0.06, duration: 0.1, volume: 0.1 });
  },

  /** rising unlock sound */
  unlock() {
    tone(523, { duration: 0.12, volume: 0.2 });
    tone(784, { start: 0.1, duration: 0.18, volume: 0.22 });
    tone(1047, { start: 0.2, duration: 0.3, volume: 0.2 });
  },

  /** wheel-of-fortune clicker */
  tick() {
    tone(1400, { type: "square", duration: 0.03, volume: 0.06 });
  },

  /** two-tone emergency siren (short, we're not monsters) */
  siren() {
    for (let i = 0; i < 3; i++) {
      tone(880, { type: "square", start: i * 0.5, duration: 0.24, volume: 0.09 });
      tone(660, { type: "square", start: i * 0.5 + 0.25, duration: 0.24, volume: 0.09 });
    }
  },

  /** countdown beep */
  beep(high = false) {
    tone(high ? 1320 : 880, { type: "triangle", duration: 0.09, volume: 0.14 });
  },

  /** kaboom */
  boom() {
    tone(120, { type: "sawtooth", duration: 0.5, slideTo: 30, volume: 0.35 });
    tone(60, { duration: 0.7, slideTo: 25, volume: 0.35 });
  },

  /** cheeky "boing" when the No button runs away */
  boing() {
    tone(300, { type: "triangle", duration: 0.18, slideTo: 90, volume: 0.18 });
  },

  /** low stamp thud */
  stamp() {
    tone(160, { type: "square", duration: 0.09, slideTo: 60, volume: 0.25 });
    tone(80, { duration: 0.22, slideTo: 40, volume: 0.3 });
  },

  /** happy success arpeggio */
  chime() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((n, i) =>
      tone(n, { start: i * 0.09, duration: 0.5, volume: 0.16 }),
    );
    tone(261.63, { type: "triangle", duration: 0.9, volume: 0.08 });
  },

  /** big finale fanfare */
  tada() {
    const notes = [392, 523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    notes.forEach((n, i) =>
      tone(n, { start: i * 0.08, duration: 0.6, volume: 0.15 }),
    );
    [523.25, 659.25, 783.99].forEach((n) =>
      tone(n, { type: "triangle", start: 0.6, duration: 1.4, volume: 0.08 }),
    );
  },
};
