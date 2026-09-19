"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Background from "@/components/Background";
import Balloons from "@/components/Balloons";
import Celebration from "@/components/Celebration";
import Chat from "@/components/Chat";
import Contract from "@/components/Contract";
import HeartTrail from "@/components/HeartTrail";
import LockScreen from "@/components/LockScreen";
import Terminal from "@/components/Terminal";
import VibePicker from "@/components/VibePicker";
import { config, type Vibe } from "@/lib/config";

type Scene =
  | "lock"
  | "chat"
  | "terminal"
  | "question"
  | "vibe"
  | "contract"
  | "party";

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

  const toChat = useCallback(() => {
    setScene("chat");
    audioRef.current?.play().catch(() => {});
  }, []);
  const toTerminal = useCallback(() => setScene("terminal"), []);
  const toQuestion = useCallback(() => setScene("question"), []);
  const toVibe = useCallback(() => setScene("vibe"), []);
  const toContract = useCallback((v: Vibe) => {
    setVibe(v);
    setScene("contract");
  }, []);
  const toParty = useCallback((png: string) => {
    setSignature(png);
    setScene("party");
  }, []);

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !muted;
    setMuted(!muted);
    if (a.paused) a.play().catch(() => {});
  };

  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <Background />
      <HeartTrail />

      {config.music && (
        <>
          <audio ref={audioRef} src={config.music} loop preload="auto" />
          {scene !== "lock" && (
            <button
              onClick={toggleMute}
              aria-label={muted ? "unmute" : "mute"}
              className="fixed right-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-lg backdrop-blur"
            >
              {muted ? "🔇" : "🎵"}
            </button>
          )}
        </>
      )}

      <AnimatePresence mode="wait">
        {scene === "lock" && (
          <Scene key="lock">
            <LockScreen onUnlock={toChat} />
          </Scene>
        )}
        {scene === "chat" && (
          <Scene key="chat">
            <Chat onDone={toTerminal} />
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
            <VibePicker onSelect={toContract} />
          </Scene>
        )}
        {scene === "contract" && vibe && (
          <Scene key="contract">
            <Contract vibe={vibe} onSigned={toParty} />
          </Scene>
        )}
        {scene === "party" && vibe && (
          <Scene key="party">
            <Celebration vibe={vibe} signature={signature} />
          </Scene>
        )}
      </AnimatePresence>
    </main>
  );
}
