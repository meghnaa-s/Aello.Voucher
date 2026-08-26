"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Envelope from "./Envelope";
import VoucherCard, { VoucherCardData } from "./VoucherCard";

export default function GiftReveal({ data }: { data: VoucherCardData }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative w-full">
      {!revealed && (
        <Envelope occasion={data.occasion} onOpened={() => setRevealed(true)} />
      )}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full px-4 py-12 sm:py-16"
          >
            <VoucherCard data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
