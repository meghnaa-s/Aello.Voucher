"use client";

import { useState } from "react";
import clsx from "clsx";

export default function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // clipboard unavailable — still show confirmation state so the UI doesn't stall
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={clsx(
        "no-print inline-flex items-center gap-2 rounded-full border px-5 py-2 font-sans text-[0.65rem] tracking-luxe-sm uppercase transition-all duration-300",
        copied
          ? "border-umber bg-umber text-paper"
          : "border-espresso/30 text-espresso hover:border-espresso hover:bg-espresso hover:text-paper"
      )}
    >
      <span
        className={clsx(
          "transition-opacity duration-300",
          copied ? "opacity-100" : "opacity-0 absolute"
        )}
      >
        Copied
      </span>
      <span className={clsx("transition-opacity duration-300", copied && "opacity-0")}>
        Copy Code
      </span>
    </button>
  );
}
