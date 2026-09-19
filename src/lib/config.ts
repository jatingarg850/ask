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

export const config = {
  // ── names ────────────────────────────────────────────────
  herName: "Riddhima Mishra", // 👈 put her name here, e.g. "Priya"
  yourName: "Jatin Garg", // 👈 your name

  // ── scene 1: lock screen notification ───────────────────
  lockMessage: "I need to ask you something important… 👀 unlock me",

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
    startISO: "2026-10-03T19:00:00", // local time, format: YYYY-MM-DDTHH:mm:ss
    durationHours: 3,
    whenLabel: "Sat, 3 Oct",
    timeLabel: "7:00 PM",
    where: "I'll pick you up 🚗", // hidden under a scratch card on the ticket
  },
  ps: "P.S. I'm already excited. Don't be late. 💘",

  // ── optional extras ─────────────────────────────────────
  // your WhatsApp number in international format, digits only (e.g. "919876543210").
  // leave empty to hide the "send my answer" button.
  whatsapp: "",
  // drop an mp3 in /public and set e.g. "/music.mp3" to play it after she unlocks.
  music: "",
};
