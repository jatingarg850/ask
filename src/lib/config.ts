// ─────────────────────────────────────────────────────────────
//  💌  CUSTOMIZE EVERYTHING HERE
//  This is the only file you need to touch.
// ─────────────────────────────────────────────────────────────

export type Vibe = {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  gradient: string; // tailwind gradient classes
};

// a string = a message from you; { choices } = quick replies she can tap
export type ChatStep = string | { choices: string[] };

export type Photo = { src: string; caption: string };

export const config = {
  // ── names ────────────────────────────────────────────────
  herName: "Avantika", // 👈 put her name here, e.g. "Priya"
  yourName: "Siddhant srivastav", // 👈 your name

  // ── scene 1: lock screen notification ───────────────────
  lockMessage: "I need to ask you something important… 👀 unlock me",

  // ── scene 1.5: the fake emergency alert ─────────────────
  alert: {
    title: "EMERGENCY ALERT",
    body: "Extreme cuteness detected in your area. One (1) person urgently requires a date with you. Please remain calm and keep scrolling.",
    button: "ok?? 😳",
  },

  // ── scene 2: the chat ───────────────────────────────────
  chat: [
    "hey 👋",
    "so… I've been thinking",
    { choices: ["about? 👀", "uh oh"] },
    "about you. obviously.",
    "and there's something I want to ask you",
    "but over text? nah. too boring for you.",
    "so I built this whole thing instead 😌",
    "ready?",
    { choices: ["ready 🫣", "born ready 😎"] },
  ] as ChatStep[],

  // ── scene 2.5: memories (optional) ──────────────────────
  // drop photos into /public/photos/ and list them here.
  // leave the array empty to skip this scene entirely.
  photos: [
    // { src: "/photos/1.jpg", caption: "that one time 🌸" },
    // { src: "/photos/2.jpg", caption: "my favourite view 😌" },
    // { src: "/photos/3.jpg", caption: "we looked cute here ngl" },
  ] as Photo[],

  // ── scene 3: hacker terminal ({her} / {me} get replaced) ──
  terminal: [
    "> booting heart.exe .......... [OK]",
    "> scanning contacts for the prettiest girl alive...",
    "> match found: {her}  (100% ✓)",
    "> checking her availability ... free (I asked your bestie 🤫)",
    "> disabling all excuses ...... done",
    "> loading the question",
    "> [████████████████████] 100%",
    "> ACCESS GRANTED 💘",
  ],

  // ── scene 4: the question (each word becomes a balloon) ──
  question: "Will you go on a date with me?",

  // ── scene 5: date options ───────────────────────────────
  vibes: [
    {
      id: "dinner",
      emoji: "🍝",
      title: "Dinner date",
      desc: "Candles, good food, and me pretending not to stare at you.",
      gradient: "from-rose-500 to-orange-400",
    },
    {
      id: "movie",
      emoji: "🎬",
      title: "Movie night",
      desc: "Popcorn, a blanket, and your head on my shoulder.",
      gradient: "from-violet-500 to-fuchsia-500",
    },
    {
      id: "stars",
      emoji: "🌌",
      title: "Stargazing",
      desc: "Hot chocolate, a rooftop, and a sky full of stars.",
      gradient: "from-sky-500 to-indigo-500",
    },
    {
      id: "surprise",
      emoji: "🎲",
      title: "Surprise me",
      desc: "I plan everything. You just show up looking cute.",
      gradient: "from-emerald-400 to-teal-500",
    },
  ] as Vibe[],

  // ── scene 5.5: she picks the day + time ─────────────────
  schedule: {
    // ISO days you're free (YYYY-MM-DD). leave empty = the next 14 days.
    days: [] as string[],
    // time slots she can pick (24h "HH:mm")
    times: ["11:00", "16:00", "19:00", "21:00"],
  },

  // ── scene 6: the "official date agreement" ──────────────
  terms: [
    "Party B (you) agrees to laugh at Party A's jokes. Even the bad ones.",
    "Party A (me) agrees to pay. This is not up for discussion.",
    "Phones stay face-down — unless it's for a cute photo of us.",
    "Dessert is mandatory. Sharing is optional. (It's not optional.)",
    "Party B will wear whatever makes her feel amazing. Party A will stare.",
    "This agreement is legally binding in the court of my heart.",
  ],

  // ── scene 7: the actual plan (ticket + calendar) ────────
  date: {
    // fallback only — she picks the real day + time in the schedule scene
    startISO: "2026-10-03T19:00:00", // local time, format: YYYY-MM-DDTHH:mm:ss
    durationHours: 3,
    where: "I'll pick you up 🚗", // hidden under a scratch card on the ticket
  },
  ps: "P.S. I'm already excited. Don't be late. 💘",

  // ── optional extras ─────────────────────────────────────
  // let the browser *speak* "access granted" and the question in a robot voice 🤖
  voice: true,
  // the day you two started (YYYY-MM-DD). shows "Day N of us" on the ticket.
  // leave empty to hide.
  sinceISO: "",
  // your WhatsApp number in international format, digits only (e.g. "919876543210").
  // leave empty to hide the "send my answer" button.
  whatsapp: "",
  // drop an mp3 in /public and set e.g. "/music.mp3" to play it after she unlocks.
  music: "",
};
