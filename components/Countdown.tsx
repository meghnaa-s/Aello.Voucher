"use client";

import { useEffect, useState } from "react";

function getRemaining(expiryDate: string) {
  const total = new Date(expiryDate).getTime() - Date.now();
  if (total <= 0) {
    return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { expired: false, days, hours, minutes, seconds };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function Countdown({ expiryDate }: { expiryDate: string }) {
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(getRemaining(expiryDate));
    const immediate = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(immediate);
      clearInterval(interval);
    };
  }, [expiryDate]);

  if (!remaining) {
    return <div className="h-14" aria-hidden />;
  }

  if (remaining.expired) {
    return (
      <p className="font-sans text-xs tracking-luxe-sm text-clay uppercase">
        Voucher Expired
      </p>
    );
  }

  const units = [
    { value: remaining.days, label: "Days" },
    { value: remaining.hours, label: "Hours" },
    { value: remaining.minutes, label: "Min" },
    { value: remaining.seconds, label: "Sec" },
  ];

  return (
    <div className="flex items-start justify-center gap-3 sm:gap-5">
      {units.map((u, i) => (
        <div key={u.label} className="flex items-start gap-3 sm:gap-5">
          <div className="flex flex-col items-center min-w-[2.6rem]">
            <span className="font-serif-display text-2xl sm:text-3xl font-light text-espresso tabular-nums">
              {pad(u.value)}
            </span>
            <span className="mt-1 font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-mocha text-lg font-light pt-1">·</span>
          )}
        </div>
      ))}
    </div>
  );
}
