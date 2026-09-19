"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Alert from "@/components/Alert";
import Background from "@/components/Background";
import Balloons from "@/components/Balloons";
import Celebration from "@/components/Celebration";
import Chat from "@/components/Chat";
import Contract from "@/components/Contract";
import HeartTrail from "@/components/HeartTrail";
import Journey from "@/components/Journey";
import LockScreen from "@/components/LockScreen";
import Memories from "@/components/Memories";
import Schedule from "@/components/Schedule";
import Terminal from "@/components/Terminal";
import VibePicker from "@/components/VibePicker";
import { config, type Vibe } from "@/lib/config";
import { sfx } from "@/lib/sfx";
import { hush } from "@/lib/voice";
import { fallbackWhen } from "@/lib/when";

type Scene =
  | "lock"
  | "alert"
  | "chat"
  | "memories"
  | "terminal"
  | "question"
  | "vibe"
  | "schedule"
  | "contract"
  | "party";

const hasPhotos = config.photos.length > 0;

// the journey bar steps (lock screen + alert are the door, not steps)
const JOURNEY: { scene: Scene; emoji: string }[] = [
  { scene: "chat", emoji: "💬" },
  ...(hasPhotos ? [{ scene: "memories" as Scene, emoji: "📸" }] : []),
  { scene: "terminal", emoji: "💻" },
  { scene: "question", emoji: "🎈" },
  { scene: "vibe", emoji: "🎯" },
  { scene: "schedule", emoji: "📅" },
  { scene: "contract", emoji: "📜" },
  { scene: "party", emoji: "🎉" },
];

function Scene({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      className="absolute inset-0 flex items-center justify-center overflow-y-auto py-6"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.98, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

const TITLES = ["💌 open me", "👀 pls", "💌 it's important", "🥺 promise it's worth it"];

export default function Home() {
  const [scene, setScene] = useState<Scene>("lock");
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [when, setWhen] = useState<Date | null>(null);
  const [signature, setSignature] = useState("");
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // flicker the tab title so it nags her to open it
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % TITLES.length;
      document.title = TITLES[i];
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const toAlert = useCallback(() => {
    setScene("alert");
    audioRef.current?.play().catch(() => {});
  }, []);
  const toChat = useCallback(() => setScene("chat"), []);
  const afterChat = useCallback(
    () => setScene(hasPhotos ? "memories" : "terminal"),
    [],
  );
  const toTerminal = useCallback(() => setScene("terminal"), []);
  const toQuestion = useCallback(() => setScene("question"), []);
  const toVibe = useCallback(() => setScene("vibe"), []);
  const toSchedule = useCallback((v: Vibe) => {
    setVibe(v);
    setScene("schedule");
  }, []);
  const toContract = useCallback((d: Date) => {
    setWhen(d);
    setScene("contract");
  }, []);
  const toParty = useCallback((png: string) => {
    setSignature(png);
    setScene("party");
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sfx.enabled = !next;
    if (next) hush();
    const a = audioRef.current;
    if (a) {
      a.muted = next;
      if (a.paused && !next) a.play().catch(() => {});
    }
  };

  const journeyIdx = JOURNEY.findIndex((j) => j.scene === scene);
  const dateWhen = when ?? fallbackWhen();

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <Background />
      <HeartTrail />

      {config.music && (
        <audio ref={audioRef} src={config.music} loop preload="auto" />
      )}

      {journeyIdx >= 0 && (
        <Journey
          steps={JOURNEY.map((j) => j.emoji)}
          current={journeyIdx}
          muted={muted}
          onToggleMute={toggleMute}
        />
      )}

      <AnimatePresence mode="wait">
        {scene === "lock" && (
          <Scene key="lock">
            <LockScreen onUnlock={toAlert} />
          </Scene>
        )}
        {scene === "alert" && (
          <Scene key="alert">
            <Alert onDone={toChat} />
          </Scene>
        )}
        {scene === "chat" && (
          <Scene key="chat">
            <Chat onDone={afterChat} />
          </Scene>
        )}
        {scene === "memories" && (
          <Scene key="memories">
            <Memories onDone={toTerminal} />
          </Scene>
        )}
        {scene === "terminal" && (
          <Scene key="terminal">
            <Terminal onDone={toQuestion} />
          </Scene>
        )}
        {scene === "question" && (
          <Scene key="question">
            <Balloons onYes={toVibe} />
          </Scene>
        )}
        {scene === "vibe" && (
          <Scene key="vibe">
            <VibePicker onSelect={toSchedule} />
          </Scene>
        )}
        {scene === "schedule" && (
          <Scene key="schedule">
            <Schedule onDone={toContract} />
          </Scene>
        )}
        {scene === "contract" && vibe && (
          <Scene key="contract">
            <Contract vibe={vibe} when={dateWhen} onSigned={toParty} />
          </Scene>
        )}
        {scene === "party" && vibe && (
          <Scene key="party">
            <Celebration vibe={vibe} when={dateWhen} signature={signature} />
          </Scene>
        )}
      </AnimatePresence>
    </main>
  );
}
