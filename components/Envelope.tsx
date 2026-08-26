"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const EASE = [0.65, 0, 0.35, 1] as const;

export default function Envelope({
  onOpened,
  occasion,
}: {
  onOpened: () => void;
  occasion?: string;
}) {
  const [phase, setPhase] = useState<"closed" | "opening" | "done">("closed");
  const [flapBehind, setFlapBehind] = useState(false);

  function handleOpen() {
    if (phase !== "closed") return;
    setPhase("opening");
    window.setTimeout(() => setFlapBehind(true), 620);
    window.setTimeout(() => {
      setPhase("done");
      onOpened();
    }, 1650);
  }

  const isOpen = phase !== "closed";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.5, ease: EASE } }}
          className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 py-12"
        >
          <div
            className="relative w-[86vw] max-w-[360px]"
            style={{ aspectRatio: "3 / 4", perspective: "1600px" }}
          >
            {/* Back of envelope */}
            <div className="paper-grain absolute inset-0 rounded-[3px] border border-espresso/15 bg-taupe shadow-[0_35px_70px_-30px_rgba(44,33,24,0.5)]" />

            {/* Card teaser sliding up from inside */}
            <motion.div
              initial={{ y: "4%", opacity: 0, scale: 0.94 }}
              animate={
                isOpen
                  ? { y: "-42%", opacity: 1, scale: 1 }
                  : { y: "4%", opacity: 0, scale: 0.94 }
              }
              transition={{ duration: 1.05, ease: EASE, delay: isOpen ? 0.5 : 0 }}
              className="absolute inset-x-[8%] top-[10%] bottom-[8%] z-10 flex flex-col items-center justify-center rounded-[2px] border border-espresso/10 bg-cream px-5 py-8 text-center shadow-[0_20px_45px_-20px_rgba(44,33,24,0.4)]"
            >
              <Image
                src="/brand/wordmark-black.png"
                alt="Aello"
                width={64}
                height={24}
                className="opacity-90"
              />
              <p className="font-serif-display mt-6 text-lg italic text-espresso">
                {occasion || "For you"}
              </p>
              <p className="mt-3 font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber">
                A Pilates Gift Awaits
              </p>
            </motion.div>

            {/* Front pocket */}
            <div
              className="paper-grain absolute inset-0 z-20 rounded-[3px] border border-espresso/15 bg-cream"
              style={{
                clipPath: "polygon(0% 34%, 50% 4%, 100% 34%, 100% 100%, 0% 100%)",
              }}
            />

            {/* Front content (logo, labels) */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[30%] z-30 flex flex-col items-center justify-between px-6 pb-7 pt-6 text-center">
              <div className="flex flex-col items-center">
                <Image
                  src="/brand/wordmark-black.png"
                  alt="Aello"
                  width={78}
                  height={29}
                  priority
                />
                <p className="font-serif-display mt-4 text-base italic text-espresso sm:text-lg">
                  A Little Gift For You
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpen}
                disabled={isOpen}
                className="pointer-events-auto group inline-flex flex-col items-center gap-2"
                aria-label="Open your gift"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/30 text-espresso transition-transform duration-500 group-hover:-translate-y-0.5">
                  <ChevronUp />
                </span>
                <span className="font-sans text-[0.65rem] tracking-luxe uppercase text-espresso">
                  Open Your Gift
                </span>
              </button>
            </div>

            {/* Flap */}
            <motion.div
              className="absolute inset-x-0 top-0 z-40"
              style={{
                height: "38%",
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
                zIndex: flapBehind ? 5 : 40,
              }}
              animate={isOpen ? { rotateX: -165 } : { rotateX: 0 }}
              transition={{ duration: 1.0, ease: EASE, delay: 0.1 }}
            >
              <div
                className="paper-grain absolute inset-0 border border-espresso/15 bg-taupe"
                style={{ clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)" }}
              />
              {/* Wax seal */}
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={isOpen ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute left-1/2 top-[58%] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-espresso shadow-[0_6px_14px_-4px_rgba(44,33,24,0.6)]"
              >
                <Image src="/brand/mark-ivory.png" alt="" width={20} height={20} />
              </motion.div>
            </motion.div>
          </div>

          <p className="no-print mt-8 font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber/70">
            Tap to open
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChevronUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 15l7-7 7 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
