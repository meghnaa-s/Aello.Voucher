"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import VoucherCard from "@/components/VoucherCard";
import CopyCode from "@/components/CopyCode";
import { OCCASIONS } from "@/lib/types";
import { defaultMessageFor } from "@/lib/occasion-messages";
import type { SiteSettings, Voucher } from "@/lib/types";

type Step = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS: Record<Step, string> = {
  1: "Choose Your Gift",
  2: "Personalize",
  3: "Preview",
  4: "Checkout",
  5: "Sent",
};

function defaultExpiry(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export default function GiftWizard() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [step, setStep] = useState<Step>(1);

  const [classes, setClasses] = useState<number | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [occasion, setOccasion] = useState<string>(OCCASIONS[0]);
  const [message, setMessage] = useState(defaultMessageFor(OCCASIONS[0]));
  const [expiryDate, setExpiryDate] = useState("");
  const [messageTouched, setMessageTouched] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setSettings(d.settings);
        setExpiryDate(defaultExpiry(d.settings.defaultValidityMonths));
      })
      .catch(() => setError("Could not load gift options. Please refresh."));
  }, []);

  const selectedPackage = useMemo(
    () => settings?.packages.find((p) => p.classes === classes) ?? null,
    [settings, classes]
  );

  function handleOccasionChange(next: string) {
    setOccasion(next);
    if (!messageTouched) setMessage(defaultMessageFor(next));
  }

  async function handleCheckout() {
    if (!selectedPackage) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName,
          senderName,
          occasion,
          message,
          classes: selectedPackage.classes,
          expiryDate: new Date(expiryDate).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setVoucher(data.voucher);
      setShareUrl(`${window.location.origin}/gift/${data.voucher.code}`);
      setStep(5);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "A gift from Aello",
          text: `${senderName || "Someone"} sent you a Pilates gift from Aello.`,
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled or share failed — fall back to copy
      }
    }
    handleCopyLink();
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // ignore — confirmation still shown so flow doesn't stall
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 1800);
  }

  const canContinueFromStep2 =
    recipientName.trim().length > 0 && senderName.trim().length > 0 && message.trim().length > 0;

  return (
    <main className="min-h-[100dvh] px-5 py-10 sm:py-14">
      <div className="mx-auto flex max-w-lg flex-col items-center">
        <Link href="/">
          <Image
            src="/brand/wordmark-black.png"
            alt="Aello"
            width={72}
            height={27}
            className="opacity-90"
          />
        </Link>

        {step < 5 && (
          <div className="mt-8 flex w-full items-center justify-center gap-2">
            {([1, 2, 3, 4] as Step[]).map((s) => (
              <span
                key={s}
                className={clsx(
                  "h-[2px] w-9 rounded-full transition-colors",
                  s <= step ? "bg-espresso" : "bg-espresso/15"
                )}
              />
            ))}
          </div>
        )}
        {step < 5 && (
          <p className="mt-3 font-sans text-[0.65rem] tracking-luxe uppercase text-umber">
            Step {step} · {STEP_LABELS[step]}
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-md bg-clay/10 px-4 py-2 font-sans text-xs text-clay">
            {error}
          </p>
        )}

        {/* Step 1 */}
        {step === 1 && settings && (
          <section className="mt-10 w-full">
            <h1 className="font-serif-display text-center text-3xl font-light text-espresso">
              Choose Your Gift
            </h1>
            <p className="mt-3 text-center font-sans text-sm text-umber">
              Every gift is an invitation to move.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {settings.packages.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setClasses(pkg.classes)}
                  className={clsx(
                    "rounded-[3px] border px-5 py-7 text-center transition-all duration-300",
                    classes === pkg.classes
                      ? "border-espresso bg-cream shadow-[0_18px_35px_-18px_rgba(44,33,24,0.4)]"
                      : "border-espresso/15 hover:border-espresso/40"
                  )}
                >
                  <p className="font-serif-display text-3xl font-light text-espresso">
                    {pkg.classes}
                  </p>
                  <p className="mt-1 font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber">
                    {pkg.classes === 1 ? "Class" : "Classes"}
                  </p>
                  <p className="mt-4 font-sans text-xs text-umber/80">
                    {settings.currency} {pkg.price.toFixed(3)}
                  </p>
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!classes}
              onClick={() => setStep(2)}
              className="mt-10 w-full rounded-full bg-espresso py-4 font-sans text-xs tracking-luxe uppercase text-paper transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue
            </button>
          </section>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <section className="mt-10 w-full">
            <h1 className="font-serif-display text-center text-3xl font-light text-espresso">
              Personalize
            </h1>

            <div className="mt-8 space-y-6">
              <Field label="Recipient's Name">
                <input
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Sara"
                  className={inputClass}
                />
              </Field>

              <Field label="Your Name">
                <input
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Maya"
                  className={inputClass}
                />
              </Field>

              <Field label="Occasion">
                <select
                  value={occasion}
                  onChange={(e) => handleOccasionChange(e.target.value)}
                  className={inputClass}
                >
                  {OCCASIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Personal Message">
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setMessageTouched(true);
                  }}
                  rows={4}
                  maxLength={300}
                  className={clsx(inputClass, "resize-none")}
                />
              </Field>

              <Field label="Voucher Valid Until">
                <input
                  type="date"
                  value={expiryDate}
                  min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mt-10 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-full border border-espresso/25 py-4 font-sans text-xs tracking-luxe uppercase text-espresso transition-colors hover:border-espresso"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!canContinueFromStep2}
                onClick={() => setStep(3)}
                className="flex-1 rounded-full bg-espresso py-4 font-sans text-xs tracking-luxe uppercase text-paper transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                Preview
              </button>
            </div>
          </section>
        )}

        {/* Step 3 */}
        {step === 3 && selectedPackage && (
          <section className="mt-10 w-full">
            <h1 className="font-serif-display text-center text-3xl font-light text-espresso">
              Preview Your Gift
            </h1>
            <p className="mt-3 text-center font-sans text-sm text-umber">
              This is exactly what {recipientName || "they"} will receive.
            </p>

            <div className="mt-8">
              <VoucherCard
                isPreview
                data={{
                  occasion,
                  recipientName,
                  senderName,
                  message,
                  totalClasses: selectedPackage.classes,
                  expiryDate: new Date(expiryDate).toISOString(),
                  studioImageUrl: settings?.studioImageUrl,
                  intuUrl: settings?.intuUrl,
                  locationUrl: settings?.locationUrl,
                }}
              />
            </div>

            <div className="mt-10 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 rounded-full border border-espresso/25 py-4 font-sans text-xs tracking-luxe uppercase text-espresso transition-colors hover:border-espresso"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex-1 rounded-full bg-espresso py-4 font-sans text-xs tracking-luxe uppercase text-paper transition-colors hover:bg-ink"
              >
                Continue
              </button>
            </div>
          </section>
        )}

        {/* Step 4 */}
        {step === 4 && selectedPackage && settings && (
          <section className="mt-10 w-full">
            <h1 className="font-serif-display text-center text-3xl font-light text-espresso">
              Checkout
            </h1>

            <div className="mt-8 rounded-[3px] border border-espresso/15 bg-cream/60 p-6">
              <div className="flex items-center justify-between font-sans text-sm text-espresso">
                <span>
                  {selectedPackage.classes} Pilates{" "}
                  {selectedPackage.classes === 1 ? "Class" : "Classes"}
                </span>
                <span>
                  {settings.currency} {selectedPackage.price.toFixed(3)}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-espresso/10 pt-4 font-sans text-xs tracking-luxe-sm uppercase text-umber">
                <span>Total</span>
                <span className="font-serif-display text-base normal-case tracking-normal text-espresso">
                  {settings.currency} {selectedPackage.price.toFixed(3)}
                </span>
              </div>
            </div>

            <p className="mt-6 text-center font-sans text-xs leading-relaxed text-umber">
              This is a demo checkout — no real payment is processed. Completing
              this step generates the personalized voucher and its shareable
              link.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 rounded-full border border-espresso/25 py-4 font-sans text-xs tracking-luxe uppercase text-espresso transition-colors hover:border-espresso"
              >
                Back
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleCheckout}
                className="flex-1 rounded-full bg-espresso py-4 font-sans text-xs tracking-luxe uppercase text-paper transition-colors hover:bg-ink disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Complete Gift"}
              </button>
            </div>
          </section>
        )}

        {/* Step 5 */}
        {step === 5 && voucher && (
          <section className="mt-10 w-full">
            <h1 className="font-serif-display text-center text-3xl font-light text-espresso">
              Your Gift Is Ready
            </h1>
            <p className="mt-3 text-center font-sans text-sm text-umber">
              Share this link with {recipientName || "them"} — they&apos;ll open
              it just like a real envelope.
            </p>

            <div className="mt-8 rounded-[3px] border border-dashed border-espresso/25 bg-paper px-5 py-5 text-center">
              <p className="break-all font-sans text-xs text-espresso">{shareUrl}</p>
              <div className="no-print mt-4 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="rounded-full border border-espresso/25 px-5 py-2 font-sans text-[0.65rem] tracking-luxe-sm uppercase text-espresso transition-colors hover:border-espresso"
                >
                  {linkCopied ? "Copied" : "Copy Link"}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-full bg-espresso px-5 py-2 font-sans text-[0.65rem] tracking-luxe-sm uppercase text-paper transition-colors hover:bg-ink"
                >
                  Share
                </button>
                <Link
                  href={`/gift/${voucher.code}`}
                  className="rounded-full border border-espresso/25 px-5 py-2 font-sans text-[0.65rem] tracking-luxe-sm uppercase text-espresso transition-colors hover:border-espresso"
                >
                  View Gift
                </Link>
              </div>
            </div>

            <div className="mt-10">
              <VoucherCard
                data={{
                  occasion: voucher.occasion,
                  recipientName: voucher.recipientName,
                  senderName: voucher.senderName,
                  message: voucher.message,
                  totalClasses: voucher.totalClasses,
                  remainingClasses: voucher.remainingClasses,
                  code: voucher.code,
                  expiryDate: voucher.expiryDate,
                  studioImageUrl: settings?.studioImageUrl,
                  intuUrl: settings?.intuUrl,
                  locationUrl: settings?.locationUrl,
                }}
              />
              <div className="no-print mt-4 flex justify-center gap-3">
                <CopyCode code={voucher.code} />
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-full border border-espresso/30 px-5 py-2 font-sans text-[0.65rem] tracking-luxe-sm uppercase text-espresso transition-colors hover:border-espresso"
                >
                  Download
                </button>
              </div>
            </div>

            <div className="no-print mt-10 text-center">
              <Link
                href="/"
                className="font-sans text-[0.65rem] tracking-luxe-sm uppercase text-umber underline decoration-umber/30 underline-offset-4 hover:text-espresso"
              >
                Return Home
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-[2px] border border-espresso/20 bg-paper px-4 py-3 font-sans text-sm text-ink outline-none transition-colors focus:border-espresso";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber">
        {label}
      </span>
      {children}
    </label>
  );
}
