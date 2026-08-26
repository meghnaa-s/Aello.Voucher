import Image from "next/image";
import { getSettings } from "@/lib/store";

export default function Footer() {
  const settings = getSettings();

  const links = [
    { label: "Instagram", href: settings.instagramUrl },
    { label: "Intu", href: settings.intuUrl },
    { label: "Location", href: settings.locationUrl },
    { label: "Contact", href: `mailto:${settings.contactEmail}` },
  ];

  return (
    <footer className="border-t border-espresso/10 bg-paper px-6 py-14">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Image src="/brand/wordmark-black.png" alt="Aello" width={70} height={26} className="opacity-80" />
        <p className="mt-4 font-sans text-xs tracking-luxe-sm uppercase text-umber">
          Pilates Studio
        </p>
        <p className="mt-1 font-sans text-xs text-umber/80">Al Ansab, Muscat, Oman</p>

        <nav className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="font-sans text-[0.65rem] tracking-luxe-sm uppercase text-espresso/80 transition-colors hover:text-espresso"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <p className="mt-10 font-sans text-[0.6rem] tracking-luxe-sm uppercase text-umber/60">
          © Aello
        </p>
      </div>
    </footer>
  );
}
