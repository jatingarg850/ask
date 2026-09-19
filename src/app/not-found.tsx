"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Background from "@/components/Background";
import { config } from "@/lib/config";

export default function NotFound() {
  return (
    <main className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      <Background />

      <motion.p
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 12 }}
        className="gradient-text font-serif text-[120px] font-bold leading-none sm:text-[160px]"
      >
        404
      </motion.p>

      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, rotate: [0, -6, 6, -4, 4, 0] }}
        transition={{
          opacity: { delay: 0.3 },
          y: { delay: 0.3 },
          rotate: { delay: 0.8, duration: 0.8, repeat: Infinity, repeatDelay: 2 },
        }}
        className="mt-2 text-6xl drop-shadow-[0_0_24px_rgba(255,92,138,0.6)]"
      >
        💔
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <p className="font-serif text-2xl italic sm:text-3xl">
          Wrong link… but the right person.
        </p>
        <p className="mt-2 text-sm text-white/55">
          This page ran away. (Unlike me. I&rsquo;m not going anywhere.)
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <Link
          href="/"
          className="btn-primary inline-block px-8 py-3.5 text-base"
        >
          take me to the question 💌
        </Link>
      </motion.div>

      <p className="absolute bottom-6 text-xs text-white/30">
        made with ♥ by {config.yourName}
      </p>
    </main>
  );
}
