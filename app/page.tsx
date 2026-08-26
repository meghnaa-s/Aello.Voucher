import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import StudioPhoto from "@/components/StudioPhoto";
import { getSettings } from "@/lib/store";

export default function HomePage() {
  const settings = getSettings();

  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-col items-center px-6 pb-20 pt-24 text-center sm:pt-32">
        <Image
          src="/brand/wordmark-black.png"
          alt="Aello"
          width={128}
          height={47}
          priority
          className="opacity-90"
        />

        <h1 className="font-serif-display mt-10 max-w-2xl text-[2.3rem] font-light leading-[1.15] tracking-wide text-espresso sm:text-6xl">
          Give the Gift
          <br />
          of Movement
        </h1>

        <p className="mt-6 max-w-xs font-sans text-sm leading-relaxed text-umber sm:max-w-sm">
          A thoughtful Pilates experience, beautifully gifted.
        </p>

        <div className="mt-10 flex w-full max-w-xs flex-col items-center gap-4">
          <Link
            href="/gift"
            className="w-full rounded-full bg-espresso px-8 py-4 text-center font-sans text-xs tracking-luxe uppercase text-paper transition-colors hover:bg-ink"
          >
            Gift An Aello Class
          </Link>
          <Link
            href="/gift/AELLO-DEMO-001"
            className="w-full rounded-full border border-espresso/25 px-8 py-4 text-center font-sans text-xs tracking-luxe uppercase text-espresso transition-colors hover:border-espresso"
          >
            View A Gift Voucher
          </Link>
        </div>
      </section>

      <section className="px-6 pb-24">
        <StudioPhoto
          src={settings.studioImageUrl}
          className="max-w-sm"
          caption="Al Ansab, Muscat, Oman"
        />
      </section>

      <section className="border-t border-espresso/10 bg-cream/50 px-6 py-20">
        <div className="mx-auto grid max-w-4xl gap-10 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: "Choose Your Gift",
              body: "Select from 1, 3, 5 or 10 Pilates classes.",
            },
            {
              n: "02",
              title: "Personalize It",
              body: "Add a name, an occasion, and a few gentle words.",
            },
            {
              n: "03",
              title: "Share The Moment",
              body: "Send a beautiful digital envelope, ready to open.",
            },
          ].map((s) => (
            <div key={s.n} className="text-center sm:text-left">
              <p className="font-serif-display text-2xl font-light text-mocha">{s.n}</p>
              <p className="mt-3 font-sans text-xs tracking-luxe-sm uppercase text-espresso">
                {s.title}
              </p>
              <p className="mt-2 font-sans text-sm leading-relaxed text-umber">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
