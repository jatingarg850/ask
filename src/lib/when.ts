import { config } from "./config";

// helpers around "when is the date" — she picks it in the schedule scene

export function fallbackWhen() {
  return new Date(config.date.startISO);
}

export function dayLabel(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function timeLabel(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

/** the days she can choose from: config.schedule.days, or the next 14 days */
export function availableDays(): Date[] {
  const custom = config.schedule.days
    .map((iso) => new Date(`${iso}T12:00:00`))
    .filter((d) => !Number.isNaN(d.getTime()));
  if (custom.length) return custom;

  const out: Date[] = [];
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  for (let i = 1; i <= 14; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push(d);
  }
  return out;
}

export function combine(day: Date, hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(day);
  d.setHours(h, m || 0, 0, 0);
  return d;
}

export function periodEmoji(hhmm: string) {
  const h = Number(hhmm.split(":")[0]);
  if (h < 12) return "🌅";
  if (h < 17) return "☀️";
  if (h < 20) return "🌇";
  return "🌙";
}

export function periodName(hhmm: string) {
  const h = Number(hhmm.split(":")[0]);
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 20) return "evening";
  return "night";
}
