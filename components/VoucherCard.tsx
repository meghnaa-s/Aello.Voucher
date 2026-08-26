import Image from "next/image";
import Countdown from "./Countdown";
import CopyCode from "./CopyCode";
import StudioPhoto from "./StudioPhoto";
import { formatVoucherDate } from "@/lib/format";

export interface VoucherCardData {
  occasion: string;
  recipientName: string;
  senderName: string;
  message: string;
  totalClasses: number;
  remainingClasses?: number;
  code?: string;
  expiryDate: string;
  studioImageUrl?: string | null;
  intuUrl?: string;
  locationUrl?: string;
}

const steps = [
  { n: "01", label: "Download the Intu App" },
  { n: "02", label: "Choose your class" },
  { n: "03", label: "Enter your voucher code" },
];

export default function VoucherCard({
  data,
  isPreview = false,
}: {
  data: VoucherCardData;
  isPreview?: boolean;
}) {
  const {
    occasion,
    recipientName,
    senderName,
    message,
    totalClasses,
    remainingClasses,
    code,
    expiryDate,
    studioImageUrl,
    intuUrl = "#",
    locationUrl = "#",
  } = data;

  const isPartial =
    typeof remainingClasses === "number" && remainingClasses < totalClasses;

  return (
    <div
      id="voucher-card"
      className="paper-grain relative mx-auto w-full max-w-[440px] rounded-[3px] border border-espresso/10 bg-cream px-6 py-10 shadow-[0_30px_70px_-25px_rgba(44,33,24,0.45)] sm:px-10 sm:py-12"
    >
      {isPreview && (
        <div className="no-print absolute right-3 top-3 rounded-full border border-espresso/20 bg-paper/80 px-3 py-1 font-sans text-[0.55rem] tracking-luxe-sm uppercase text-umber">
          Preview
        </div>
      )}

      {/* Brand */}
      <div className="flex flex-col items-center text-center">
        <Image
          src="/brand/wordmark-black.png"
          alt="Aello"
          width={92}
          height={34}
          className="opacity-90"
          priority
        />
        <p className="mt-4 font-sans text-[0.65rem] tracking-luxe uppercase text-umber">
          A Little Something For You
        </p>
      </div>

      {/* Occasion heading */}
      <h1 className="font-serif-display mt-6 text-center text-[2.1rem] font-light leading-[1.05] tracking-wide text-espresso sm:text-[2.5rem]">
        {occasion}
      </h1>

      <div className="mx-auto mt-6 flex items-center justify-center gap-3 text-mocha">
        <span className="h-px w-10 bg-mocha/60" />
        <MiniMark />
        <span className="h-px w-10 bg-mocha/60" />
      </div>

      {/* Recipient */}
      <div className="mt-7 text-center">
        <p className="font-serif-display text-lg italic text-espresso">
          Dear {recipientName || "Friend"},
        </p>
        <p className="mx-auto mt-3 max-w-[30ch] font-sans text-[0.95rem] leading-relaxed text-ink/80">
          {message}
        </p>
        <p className="font-serif-display mt-4 text-sm italic text-umber">
          — {senderName || "Aello"}
        </p>
      </div>

      {/* Gift */}
      <div className="mt-9 text-center">
        <p className="font-sans text-[0.65rem] tracking-luxe uppercase text-umber">
          Your Gift
        </p>
        <p className="font-serif-display mt-2 text-2xl font-light tracking-wide text-espresso sm:text-[1.7rem]">
          {totalClasses} Pilates {totalClasses === 1 ? "Class" : "Classes"}
        </p>
        <p className="mx-auto mt-2 max-w-[28ch] font-sans text-xs leading-relaxed text-ink/70">
          Your voucher includes {totalClasses} Pilates{" "}
          {totalClasses === 1 ? "class" : "classes"} at Aello.
        </p>
        {isPartial && (
          <p className="mt-3 font-sans text-[0.6rem] tracking-luxe-sm uppercase text-clay">
            {remainingClasses} of {totalClasses} classes remaining
          </p>
        )}
      </div>

      {/* Photo */}
      <div className="mt-9">
        <StudioPhoto src={studioImageUrl} />
      </div>

      {/* Valid through */}
      <div className="mt-9 text-center">
        <p className="font-sans text-[0.65rem] tracking-luxe uppercase text-umber">
          Valid Through
        </p>
        <p className="font-serif-display mt-2 text-lg tracking-wide text-espresso">
          {formatVoucherDate(expiryDate)}
        </p>
        <div className="mt-4">
          <Countdown expiryDate={expiryDate} />
        </div>
      </div>

      {/* Code */}
      <div className="mt-9 rounded-[2px] border border-dashed border-espresso/25 bg-paper/60 px-5 py-6 text-center">
        <p className="font-sans text-[0.65rem] tracking-luxe uppercase text-umber">
          Your Voucher Code
        </p>
        <p className="font-serif-display mt-2 text-xl tracking-[0.15em] text-espresso">
          {code ?? "AELLO-••••-•••"}
        </p>
        <div className="mt-4 flex justify-center">
          {code ? (
            <CopyCode code={code} />
          ) : (
            <span className="font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber/60">
              Generated after checkout
            </span>
          )}
        </div>
      </div>

      {/* How to use */}
      <div className="mt-9">
        <p className="text-center font-sans text-[0.65rem] tracking-luxe uppercase text-umber">
          How To Use Your Gift
        </p>
        <ol className="mt-5 space-y-4">
          {steps.map((s) => (
            <li key={s.n} className="flex items-center gap-4">
              <span className="font-serif-display text-sm text-mocha">{s.n}</span>
              <span className="h-px flex-1 bg-espresso/10" />
              <span className="font-sans text-xs tracking-luxe-sm uppercase text-ink/75">
                {s.label}
              </span>
            </li>
          ))}
        </ol>

        <a
          href={intuUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 block rounded-full bg-espresso py-3.5 text-center font-sans text-xs tracking-luxe uppercase text-paper transition-colors hover:bg-ink"
        >
          Book Your Class
        </a>
        <a
          href={intuUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center font-sans text-[0.65rem] tracking-luxe-sm uppercase text-umber underline decoration-umber/30 underline-offset-4 transition-colors hover:text-espresso"
        >
          Book With Intu →
        </a>
      </div>

      {/* Studio info */}
      <div className="mt-10 border-t border-espresso/10 pt-7 text-center">
        <p className="font-sans text-xs tracking-luxe uppercase text-espresso">
          Aello Pilates
        </p>
        <p className="mt-1 font-sans text-xs text-umber">Al Ansab, Muscat, Oman</p>
        <p className="font-serif-display mt-2 text-sm italic text-umber">
          Movement, made intentional.
        </p>
        <a
          href={locationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber transition-colors hover:text-espresso"
        >
          <PinIcon />
          Get Directions
        </a>
      </div>
    </div>
  );
}

function MiniMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 100 100" fill="none">
      <path
        d="M50 8c14 0 20 10 20 22 0 8-4 14-4 20 6 0 12-4 20-4 12 0 22 6 22 20 0 14-10 20-22 20-8 0-14-4-20-4 0 6 4 12 4 20 0 12-6 22-20 22-14 0-20-10-20-22 0-8 4-14 4-20-6 0-12 4-20 4-12 0-22-6-22-20 0-14 10-20 22-20 8 0 14 4 20 4 0-6-4-12-4-20 0-12 6-22 20-22Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22s7-7.58 7-13a7 7 0 10-14 0c0 5.42 7 13 7 13z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
