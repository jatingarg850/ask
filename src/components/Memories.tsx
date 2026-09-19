"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { config } from "@/lib/config";
import { sfx } from "@/lib/sfx";

const photos = config.photos;

// a messy pile of polaroids she can drag around
export default function Memories({ onDone }: { onDone: () => void }) {
  const [order, setOrder] = useState<number[]>(() => photos.map((_, i) => i));

  const bringToFront = (i: number) => {
    setOrder((o) => [...o.filter((x) => x !== i), i]);
    sfx.blip();
  };

  return (
    <div className="flex h-full w-full max-w-md flex-col items-center px-5 pt-14 text-center">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">
          a quick look back 📸
        </p>
        <p className="mt-2 font-serif text-3xl italic sm:text-4xl">
          Remember these?
        </p>
      </motion.div>

      <div className="relative mt-2 w-full flex-1">
        {photos.map((p, i) => {
          const rot = ((i * 37) % 21) - 10;
          const dx = ((i * 53) % 41) - 20;
          const dy = ((i * 29) % 31) - 15;
          return (
            <motion.div
              key={i}
              drag
              dragMomentum={false}
              onPointerDown={() => bringToFront(i)}
              initial={{ opacity: 0, y: 120, rotate: rot * 2, scale: 0.8 }}
              animate={{ opacity: 1, y: dy, x: dx, rotate: rot, scale: 1 }}
              transition={{
                delay: 0.25 + i * 0.18,
                type: "spring",
                stiffness: 120,
                damping: 14,
              }}
              whileTap={{ scale: 1.06, rotate: 0 }}
              style={{ zIndex: order.indexOf(i) + 1, touchAction: "none" }}
              className="polaroid absolute left-1/2 top-1/2 w-52 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-md p-2.5 pb-3 active:cursor-grabbing sm:w-60"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-neutral-200">
                <Image
                  src={p.src}
                  alt={p.caption}
                  fill
                  sizes="240px"
                  className="pointer-events-none object-cover"
                  draggable={false}
                />
              </div>
              <p className="mt-2.5 font-serif text-[15px] italic leading-tight text-neutral-700">
                {p.caption}
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-[11px] text-white/45"
      >
        drag them around · tap to bring one forward
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        onClick={onDone}
        className="btn-primary mb-4 mt-3 px-8 py-3.5 text-base"
      >
        ok… now the real reason you&rsquo;re here →
      </motion.button>
    </div>
  );
}
