import Link from "next/link";
import Image from "next/image";
import { getVoucherByCode, getSettings } from "@/lib/store";
import GiftReveal from "@/components/GiftReveal";

export default async function VoucherPage({
  params,
}: PageProps<"/gift/[code]">) {
  const { code } = await params;
  const voucher = getVoucherByCode(decodeURIComponent(code));
  const settings = getSettings();

  if (!voucher) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
        <Image
          src="/brand/wordmark-black.png"
          alt="Aello"
          width={90}
          height={33}
          className="opacity-80"
        />
        <p className="font-serif-display mt-8 text-2xl italic text-espresso">
          This gift could not be found.
        </p>
        <p className="mt-3 max-w-xs font-sans text-sm text-umber">
          The link may be incomplete, or the voucher may no longer exist.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full border border-espresso/25 px-6 py-3 font-sans text-xs tracking-luxe uppercase text-espresso transition-colors hover:border-espresso"
        >
          Return Home
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-[100dvh] flex-col items-center bg-paper">
      <GiftReveal
        data={{
          occasion: voucher.occasion,
          recipientName: voucher.recipientName,
          senderName: voucher.senderName,
          message: voucher.message,
          totalClasses: voucher.totalClasses,
          remainingClasses: voucher.remainingClasses,
          code: voucher.code,
          expiryDate: voucher.expiryDate,
          studioImageUrl: settings.studioImageUrl,
          intuUrl: settings.intuUrl,
          locationUrl: settings.locationUrl,
        }}
      />
      <Link
        href="/"
        className="no-print pb-14 pt-2 font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber/60 transition-colors hover:text-umber"
      >
        Visit Aello Pilates
      </Link>
    </main>
  );
}
